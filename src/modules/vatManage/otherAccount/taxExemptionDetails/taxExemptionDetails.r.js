/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-26 12:19:19
 *
 */
import React, {Component} from 'react';
import {Form,message,Divider,Modal} from 'antd';
import {fMoney, request, listMainResultStatus, composeBotton, requestResultStatus} from 'utils';
import {SearchTable, TableTotal} from 'compoments';
import PopModal from "./popModal";
import moment from 'moment';
import {NumericInputCell, SelectCell} from 'compoments/EditableCell';
import {BigNumber} from "bignumber.js";

const searchFields = (context, disabled, declare) => getFieldValue => ([
    {
        label: '纳税主体',
        fieldName: 'main',
        type: 'taxMain',
        span: 8,
        componentProps: {
            labelInValue: true,
            disabled
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && {key: declare.mainId, label: declare.mainName}) || undefined,
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
                    message: '请选择查询期间'
                }
            ]
        }
    },
    ...((context.state.showProfitCenter && context.state.isEnabled) ? [{
        label: '利润中心',
        fieldName: 'profitCenterId',
        type: 'asyncSelect',
        span: 8,
        rules: [
            {
                required: true,
                message: '请选择利润中心'
            }
        ],
        componentProps: {
            fieldTextName: 'profitName',
            fieldValueName: 'id',
            fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
            url: `/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`
        },
    }] : [])
]);

const getColumns = (context, getFieldDecorator, disabled) => {
    const {dataSource,showProfitCenter,isEnabled} = context.state;
    let profitCenterId = '';
    return [
        ...((showProfitCenter && isEnabled) ? [{
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width: '150px',
            render: (text, row, index) => {
                let rowSpan = 0;
                if(profitCenterId !== row.profitCenterId){
                    profitCenterId = row.profitCenterId;
                    rowSpan = dataSource.filter(ele=>ele.profitCenterId === profitCenterId).length;
                }
                if(index + 1 === dataSource.length){
                    profitCenterId = '';
                }
                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan,
                    },
                };
            }
        }] : []),
        {
        title: '减税性质代码',
        dataIndex: 'reduceNum',
        width: '150px'
    }, {
        title: '减税性质名称',
        dataIndex: 'reduceName',
        width: '300px'
    }, {
        title: '期初余额',
        dataIndex: 'initialBalance',
        render: text => fMoney(text),
        className: 'table-money',
        width: '100px'
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
                            initialValue={text === '0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            componentProps={{
                                onFocus: (e) => context.handleFocus(e, `list[${record.id}].amount`),
                                onBlur: (e) => context.handleBlur(e, `list[${record.id}].amount`)
                            }}
                        />;
                    } else {
                        return record.amount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '150px'
            },
            {
                title: '税额',
                dataIndex: 'taxAmount',
                className: 'table-money',
                render: (text, record) => {
                    if (disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) {
                        return <NumericInputCell
                            fieldName={`list[${record.id}].taxAmount`}
                            initialValue={text === '0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            componentProps={{
                                onFocus: (e) => context.handleFocus(e, `list[${record.id}].taxAmount`),
                                onBlur: (e) => context.handleBlur(e, `list[${record.id}].taxAmount`)
                            }}
                        />;
                    } else {
                        return record.taxAmount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '150px'
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
                            initialValue={text === '0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            componentProps={{
                                disabled: true
                            }}
                        />;
                    } else {
                        return record.reduceTaxAmount ? fMoney(parseFloat(text)) : text;
                    }
                },
                width: '150px'
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
        width: '100px'
    }, {
        title: '本期应抵减税额',
        dataIndex: 'currentDeductAmount',
        render: text => fMoney(text),
        className: 'table-money',
        width: '100px'
    }];
};
// 总计数据结构，用于传递至TableTotal中
const totalData = [
    {
        title: '合计',
        total: [
            {title: '金额', dataIndex: 'allAmount'},
            {title: '税额', dataIndex: 'allTaxAmount'},
            {title: '减免税金额', dataIndex: 'allReduceTaxAmount'}
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
        showProfitCenter: false,
        dataSource: [],
        isEnabled:false,
    };
    componentDidMount(){
        const {declare={}} = this.props;
        declare.mainId && this.requestLoadType(declare.mainId);
    }
    requestLoadType = (mainId) => {
        request.get('/dataCollection/loadType/' + mainId).then(({data})=>{
            this.setState({showProfitCenter: data.data === '2'});
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
                const data = nArr.map(item => {
                    return {
                        ...item,
                        amount: item.amount.replace(/\$\s?|(,*)/g, ''),
                        reduceTaxAmount: item.reduceTaxAmount.replace(/\$\s?|(,*)/g, ''),
                        taxAmount: item.taxAmount.replace(/\$\s?|(,*)/g, '')
                    };
                });
                request.post('/account/other/reduceTaxDetail/save', {
                    list: data,
                    mainId: this.state.filters.mainId,
                    taxMonth: this.state.filters.authMonth,
                    type: this.state.isEnabled === false ? '1' : '2',
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

    handleFocus = (e, fieldName) => {
        e && e.preventDefault();
        const {setFieldsValue, getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if (value === '0.00') {
            setFieldsValue({
                [fieldName]: ''
            });
        } else {
            setFieldsValue({
                [fieldName]: value.replace(/\$\s?|(,*)/g, '')
            });
        }
    };

    handleBlur = (e, fieldName) => {
        e && e.preventDefault();
        const {setFieldsValue, getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if (value !== '') {
            setFieldsValue({
                [fieldName]: fMoney(value)
            });
        } else {
            setFieldsValue({
                [fieldName]: '0.00'
            });
        }
    };
    handleConfirmChange = (value, record) => {
        // 是 -- -减免税金额显示为金额的值  :0 否 1是
        // 否  减免税金额显示为 金额加税额的合计
        const {getFieldValue, setFieldsValue} = this.props.form;

        let amount = new BigNumber(getFieldValue(`list[${record.id}].amount`).replace(/\$\s?|(,*)/g, ''));
        let taxAmount = new BigNumber(getFieldValue(`list[${record.id}].taxAmount`).replace(/\$\s?|(,*)/g, ''));
        let sum = amount.plus(taxAmount);
        let incomeTaxAuth = parseInt(value, 0);
        if (incomeTaxAuth === 1) {
            setFieldsValue({
                [`list[${record.id}].reduceTaxAmount`]: amount.toFormat(2)
            });
        }
        if (incomeTaxAuth === 0) {
            setFieldsValue({
                [`list[${record.id}].reduceTaxAmount`]: sum.toFormat(2)
            });
        }
    };
    //选中多少条数据 - 禁用
    handleChange = (checked) => {
        const t = checked === true ? '利润中心' : '纳税主体'
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: `是否切换到${t}维度查询？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.setState({
                    isEnabled:checked
                },()=>{
                    setTimeout(this.refreshTable, 100)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }

    render() {
        const {visible, action, opid, tableKey, searchTableLoading, statusParam, totalSource, filters, showProfitCenter,isEnabled} = this.state;
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
                    filters:{
                        ...filters,
                        profitCenterId:isEnabled === false ? undefined : filters.profitCenterId
                    },
                    onFieldsChange({main={}}){
                        main.key && self.requestLoadType(main.key);
                    }
                }}
                backCondition={(filters) => {
                    this.setState({
                        filters
                    }, () => {
                        this.fetchResultStatus();
                    });
                    this.props.form.resetFields();
                }}
                tableOption={{
                    key: tableKey,
                    pageSize: 100,
                    columns: getColumns(this, getFieldDecorator, (disabled && declare.decAction === 'edit')),
                    url: `/account/other/reduceTaxDetail/list?type=${isEnabled === false ? '1' : '2'}`,
                    cardProps: {
                        title: '减免税明细台账'
                    },
                    scroll: {
                        y: window.screen.availHeight - 400 - (disabled ? 50 : 0),
                        x: (showProfitCenter && isEnabled) ? 1250 : 1100
                    },
                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            (disabled && declare.decAction === 'edit') && showProfitCenter && composeBotton([{
                                type:'switch',
                                checked: isEnabled,
                                checkedChildren:'利润中心',
                                unCheckedChildren:'纳税主体',
                                size:'default',
                                style:{marginRight:0},
                                onSuccess:(checked)=>{
                                    this.handleChange(checked)
                                }
                            }],statusParam)
                        }
                        {
                            (disabled && declare.decAction === 'edit') && showProfitCenter && <Divider type="vertical" />
                        }
                        {
                            JSON.stringify(filters) !== '{}' && composeBotton([{
                                type: 'fileExport',
                                url: 'account/other/reduceTaxDetail/export',
                                params: {
                                    ...filters,
                                    type:isEnabled === false ? '1' : '2',
                                },
                                title: '导出',
                                userPermissions: ['1301007']
                            }])
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
                    onDataChange: (dataSource) => {
                        this.setState({
                            dataSource
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        });
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
                    declareData={declare}
                    profitCenter={showProfitCenter}
                    update={this.update}
                />
            </SearchTable>
        );
    }
}

export default Form.create()(TaxExemptionDetails);