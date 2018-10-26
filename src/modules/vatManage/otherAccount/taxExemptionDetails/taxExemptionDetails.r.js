/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-16 15:58:37
 *
 */
import React, {Component} from 'react';
import {Form, message} from 'antd';
import {connect} from 'react-redux';
import {fMoney, request, listMainResultStatus, composeBotton, requestResultStatus} from 'utils';
import {SearchTable, TableTotal} from 'compoments';
import PopModal from "./popModal";
import moment from 'moment';
import {NumericInputCell, SelectCell} from 'compoments/EditableCell';
import {BigNumber} from "bignumber.js";

const searchFields = (context, disabled, declare) => getFieldValue => ([
    {
        label: '纳税主体',
        fieldName: 'mainId',
        type: 'taxMain',
        span: 8,
        componentProps: {
            disabled
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && declare.mainId) || undefined,
            rules: [
                {
                    required: true,
                    message: '请选择纳税主体'
                }
            ]
        }
    }, {
        label: '查询期间',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 8,
        componentProps: {
            format: 'YYYY-MM',
            disabled
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            rules: [
                {
                    required: true,
                    message: '请选查询期间'
                }
            ]
        }
    },
    ...(context.state.showProfitCenter ? [{
        label: '利润中心',
        fieldName: 'profitCenterId',
        type: 'asyncSelect',
        span: 8,
        componentProps: {
            fieldTextName: 'profitName',
            fieldValueName: 'id',
            doNotFetchDidMount: true,
            fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
            url: `/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`
        }
    }] : [])
]);

const getColumns = (context, getFieldDecorator, disabled) => {
    return [
        ...(context.state.showProfitCenter ? [{
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width: '150px'
        }] : []),
        {
        title: '减税性质代码',
        dataIndex: 'reduceNum',
        width: '8%'
    }, {
        title: '减税性质名称',
        dataIndex: 'reduceName',
        width: '20%'
    }, {
        title: '期初余额',
        dataIndex: 'initialBalance',
        render: text => fMoney(text),
        width: '5%'
    }, {
        title: '本期发生额',
        children: [
            {
                title: '金额',
                dataIndex: 'amount',
                className: 'table-money',
                render: (text, record) => {
                    if (disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) {
                        return <NumericInputCell
                            fieldName={`list[${record.id}].amount`}
                            initialValue={text}
                            getFieldDecorator={getFieldDecorator}
                        />;
                    } else {
                        return record.amount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '10%'
            },
            {
                title: '税额',
                dataIndex: 'taxAmount',
                className: 'table-money',
                render: (text, record) => {
                    if (disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) {
                        return <NumericInputCell
                            fieldName={`list[${record.id}].taxAmount`}
                            initialValue={text}
                            getFieldDecorator={getFieldDecorator}
                        />;
                    } else {
                        return record.taxAmount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '10%'
            },
            {
                title: '减免税金额',
                dataIndex: 'reduceTaxAmount',
                className: 'table-money',
                //render:text=>fMoney(text),
                render: (text, record) => {
                    if (disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) {
                        return <NumericInputCell
                            fieldName={`list[${record.id}].reduceTaxAmount`}
                            initialValue={text}
                            getFieldDecorator={getFieldDecorator}
                            componentProps={{
                                disabled: true
                            }}
                        />;
                    } else {
                        return record.reduceTaxAmount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '10%'
            }
        ]
    }, {
        title: '进项税额是否认证抵扣',
        dataIndex: 'incomeTaxAuth',
        render: (text, record) => {
            if (disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) {
                return (
                    <SelectCell
                        fieldName={`list[${record.id}].incomeTaxAuth`}
                        options={[
                            {
                                text: '否',
                                value: '0'
                            }, {
                                text: '是',
                                value: '1'
                            }
                        ]}
                        initialValue={record.incomeTaxAuth.toString()}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            onChange: (value) => context.handleConfirmChange(value, record)
                        }}
                    />);
            } else {
                let txt = parseInt(text, 0);
                if (text === 0) {
                    txt = '否';
                }
                if (text === 1) {
                    txt = '是';
                }
                return txt;
            }
        },
        width: '8%'
    }, {
        title: '本期应抵减税额',
        dataIndex: 'currentDeductAmount',
        render: text => fMoney(text),
        width: '8%'
    }];
};
// 总计数据结构，用于传递至TableTotal中
const totalData = [
    {
        title: '合计',
        total: [
            {title: '金额', dataIndex: 'pageAmount'},
            {title: '税额', dataIndex: 'pageTaxAmount'},
            {title: '减免税金额', dataIndex: 'pageReduceTaxAmount'}
        ]
    }
];

class TaxExemptionDetails extends Component {
    state = {
        visible: false,
        action: undefined,
        opid: undefined,
        tableKey: Date.now(),
        filters: {},
        statusParam: {},
        searchTableLoading: false,
        totalSource: undefined,
        showProfitCenter: false
    };
    requestLoadType = (mainId) => {
        request.get('/dataCollection/loadType/' + mainId).then(({data})=>{
            this.setState({showProfitCenter: data.data === '2'})
        });
    };
    refreshTable = () => {
        this.setState({
            tableKey: Date.now()
        });
    };
    toggleSearchTableLoading = b => {
        this.setState({
            searchTableLoading: b
        });
    };
    hideModal = () => {
        this.setState({visible: false});
    };
    update = () => {
        this.refreshTable();
    };
    deleteRecord = (id, cb) => {
        this.toggleSearchTableLoading(true);
        request.delete(`/account/other/reduceTaxDetail/delete/${id}`)
        .then(({data}) => {
            this.toggleSearchTableLoading(false);
            if (data.code === 200) {
                message.success('删除成功！');
                cb && cb();
            } else {
                message.error(`删除失败:${data.msg}`);
            }
        }).catch(err => {
            message.error(err.message);
            this.toggleSearchTableLoading(false);
        });
    };

    fetchResultStatus = () => {
        requestResultStatus('/account/other/reduceTaxDetail/listMain', this.state.filters, result => {
            this.setState({
                statusParam: result
            });
        });
    };
    save = e => {
        e && e.preventDefault();
        this.toggleSearchTableLoading(true);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let nArr = [];
                for (let key in values) {
                    for (let nKey in values[key]) {
                        nArr = nArr.concat(
                            {
                                ...values[key][nKey],
                                id: nKey
                            }
                        );
                    }
                }
                request.post('/account/other/reduceTaxDetail/save', {
                    list: nArr,
                    mainId: this.state.filters.mainId,
                    taxMonth: this.state.filters.authMonth
                })
                .then(({data}) => {
                    this.toggleSearchTableLoading(false);
                    if (data.code === 200) {
                        message.success(`保存成功！`);
                        this.props.form.resetFields();
                        this.refreshTable();
                    } else {
                        message.error(`保存失败:${data.msg}`);
                    }
                }).catch(err => {
                    message.error(err.message);
                    this.toggleSearchTableLoading(false);
                });
            }
        });
    };

    handleConfirmChange = (value, record) => {
        // 是 -- -减免税金额显示为金额的值  :0 否 1是
        // 否  减免税金额显示为 金额加税额的合计
        const {getFieldValue, setFieldsValue} = this.props.form;

        let amount = new BigNumber(getFieldValue(`list[${record.id}].amount`));
        let taxAmount = new BigNumber(getFieldValue(`list[${record.id}].taxAmount`));
        let sum = amount.plus(taxAmount);
        let incomeTaxAuth = parseInt(value, 0);
        if (incomeTaxAuth === 1) {
            setFieldsValue({
                [`list[${record.id}].reduceTaxAmount`]: amount
            });
        }
        if (incomeTaxAuth === 0) {
            setFieldsValue({
                [`list[${record.id}].reduceTaxAmount`]: sum
            });
        }
    };

    render() {
        const {visible, action, opid, tableKey, searchTableLoading, statusParam, totalSource, filters} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {declare} = this.props;
        let disabled = !!declare;
        const self = this;

        return (
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields: searchFields(this, disabled, declare),
                    cardProps: {
                        style: {
                            borderTop: 0
                        }
                    },
                    onFieldsChange({mainId}){
                        mainId && self.requestLoadType(mainId);
                    }
                }}
                tableOption={{
                    key: tableKey,
                    pageSize: 100,
                    columns: getColumns(this, getFieldDecorator, (disabled && declare.decAction === 'edit')),
                    url: '/account/other/reduceTaxDetail/list',
                    onSuccess: (params) => {
                        this.props.form.resetFields();
                        this.setState({
                            filters: params
                        }, () => {
                            this.fetchResultStatus();
                        });
                    },
                    cardProps: {
                        title: '减免税明细台账'
                    },
                    scroll: {
                        y: window.screen.availHeight - 380,
                        x: 1000
                    },
                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== '{}' && composeBotton([{
                                type: 'fileExport',
                                url: 'account/other/reduceTaxDetail/export',
                                params: filters,
                                title: '导出',
                                userPermissions: ['1301007']
                            }], statusParam)
                        }
                        {
                            (disabled && declare.decAction === 'edit') && composeBotton([{
                                type: 'save',
                                text: '保存',
                                icon: 'save',
                                userPermission: ['1301003'],
                                onClick: () => this.save()
                            }, {
                                type: 'reset',
                                url: '/account/other/reduceTaxDetail/reset',
                                params: filters,
                                userPermissions: ['1301009'],
                                onSuccess: this.refreshTable
                            }, {
                                type: 'submit',
                                url: '/account/other/reduceTaxDetail/submit',
                                params: filters,
                                userPermissions: ['1301010'],
                                onSuccess: this.refreshTable
                            }, {
                                type: 'revoke',
                                url: '/account/other/reduceTaxDetail/revoke',
                                params: filters,
                                userPermissions: ['1301011'],
                                onSuccess: this.refreshTable
                            }], statusParam)
                        }
                        <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        });
                    },
                    onDataChange(data){
                        console.log('xxx', data)
                    }
                }}
            >
                <PopModal
                    visible={visible}
                    action={action}
                    hideModal={() => {
                        this.hideModal();
                    }}
                    id={opid}
                    update={this.update}
                />
            </SearchTable>
        );
    }
}

export default Form.create()(connect(state => ({
    declare: state.user.get('declare')
}))(TaxExemptionDetails));