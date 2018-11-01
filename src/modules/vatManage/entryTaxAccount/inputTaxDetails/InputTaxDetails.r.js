/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React, {Component} from 'react';
import {message, Form} from 'antd';
import {SearchTable, TableTotal} from 'compoments';
import {request, requestResultStatus, fMoney, listMainResultStatus, composeBotton} from 'utils';
import PopInvoiceInformationModal from './popModal';
import VoucherPopModal from './voucherPopModal';
import AddPopModal from './addPopModal';
import moment from 'moment';
import {NumericInputCell} from 'compoments/EditableCell';

const pointerStyle = {
    cursor: 'pointer',
    color: '#1890ff'
};
const searchFields = (disabled, declare) => getFieldValue => {
    return [
        {
            label: '纳税主体',
            fieldName: 'main',
            type: 'taxMain',
            span: 8,
            formItemStyle: {
                labelCol: {
                    span: 8
                },
                wrapperCol: {
                    span: 16
                }
            },
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
        },
        {
            label: '认证月份',
            fieldName: 'authMonth',
            type: 'monthPicker',
            span: 8,
            formItemStyle: {
                labelCol: {
                    span: 8
                },
                wrapperCol: {
                    span: 16
                }
            },
            componentProps: {
                format: 'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择认证月份'
                    }
                ]
            }
        },
        {
            label: "利润中心",
            fieldName: "profitCenterId",
            type: "asyncSelect",
            span: 8,
            formItemStyle: {
                labelCol: {
                    span: 8
                },
                wrapperCol: {
                    span: 16
                }
            },
            componentProps: {
                fieldTextName: "profitName",
                fieldValueName: "id",
                doNotFetchDidMount: false,
                fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
                url: `/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`
            }
        }
    ];
};
const getColumns = (context, isEdit) => {
    let lastStegesId = '';
    const {dataSource} = context.state;
    return [
        {
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width: '200px',
            render: (text, row, index) => {
                let rowSpan = 0;
                if (lastStegesId !== row.profitCenterId) {
                    lastStegesId = row.profitCenterId;
                    rowSpan = dataSource.filter(ele => ele.profitCenterId === row.profitCenterId).length;
                }
                if((index + 1) === dataSource.length){
                    lastStegesId = '';
                }
                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan
                    }
                };
            }
        },
        {
            title: '抵扣凭据类型',
            dataIndex: 'voucherType'
        },
        {
            title: '凭据份数',
            dataIndex: 'num',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if ( isEdit && record.editable) {
                    return <NumericInputCell
                        fieldName={`list[${record.id}].num`}
                        initialValue={text === '0' ? '0' : text}
                        getFieldDecorator={getFieldDecorator}/>;
                }
                if (parseInt(record.invoiceType, 0) !== 1 || parseInt(text, 0) === 0) {
                    return text;
                }
                if (parseInt(record.invoiceType, 0) === 1) {
                    return (
                        <span>
                    {
                        record.invoiceType
                            ?
                            <span title="查看发票信息详情" onClick={() => {
                                context.toggleModalVisible(true, record);
                            }} style={pointerStyle}>
                                {text}
                            </span>
                            :
                            <span title="查看凭证信息详情" onClick={() => {
                                const params = {
                                    sysDictId: record.sysDictId
                                };
                                context.setState({
                                    params: params
                                }, () => {
                                    context.toggleModalVoucherVisible(true);
                                });
                            }} style={pointerStyle}>
                                {text}
                            </span>
                    }
                </span>
                    );
                } else {
                    return text;
                }
            }

        },
        {
            title: '金额',
            dataIndex: 'amount',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if (isEdit && record.editable) {
                    return <NumericInputCell
                        fieldName={`list[${record.id}].amount`}
                        initialValue={text === '0' ? '0.00' : fMoney(text)}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            onFocus: (e) => context.handleFocus(e, `list[${record.id}].amount`),
                            onBlur: (e) => context.handleBlur(e, `list[${record.id}].amount`)
                        }}/>;
                } else {
                    return fMoney(text);
                }
            },
            className: "table-money"
        },
        {
            title: '税额',
            dataIndex: 'taxAmount',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if (isEdit && record.editable) {
                    return <NumericInputCell
                        fieldName={`list[${record.id}].taxAmount`}
                        initialValue={text === '0' ? '0.00' : fMoney(text)}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            onFocus: (e) => context.handleFocus(e, `list[${record.id}].taxAmount`),
                            onBlur: (e) => context.handleBlur(e, `list[${record.id}].taxAmount`)
                        }}/>;
                } else {
                    return fMoney(text);
                }
            },
            className: "table-money"
        }
    ];
}

class InputTaxDetails extends Component {
    state = {
        tableKey: Date.now(),
        searchTableLoading: false,
        filters: {},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource: undefined,
        dataSource: undefined,
        visible: false,
        voucherVisible: false,
        addVisible: false,
        params: {},
        saveLoading: false,
        currentProfitId: ''
    };
    toggoleSaveLoading = (saveLoading) => {
        this.setState({saveLoading});
    };
    refreshTable = () => {
        this.setState({
            tableKey: Date.now()
        });
    };
    toggleModalAddVisible = addVisible => {
        this.setState({
            addVisible
        });
    };
    toggleModalVisible = (visible, record={}) => {
        this.setState({
            visible,
            currentProfitId: record.profitCenterId
        });
    };
    toggleModalVoucherVisible = voucherVisible => {
        this.setState({
            voucherVisible
        });
    };
    fetchResultStatus = () => {
        requestResultStatus('/account/income/taxDetail/listMain', this.state.filters, result => {
            this.setState({
                statusParam: result
            });
        });
    };

    deleteRecord(record) {
        request.delete(`/account/income/taxDetail/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
            message.error(err.message);
        });
    }

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

    save = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (!err) {
                let list = [];

                if (values.list) {
                    for (let i in values.list) {
                        for (let x in values.list[i]) {
                            values.list[i][x] = values.list[i][x].replace(/\$\s?|(,*)/g, '');
                        }
                        list.push({id: i, ...values.list[i]});
                    }
                }

                this.toggoleSaveLoading(true);

                request.post('/account/income/taxDetail/update/amount', list)
                .then(({data}) => {
                    this.toggoleSaveLoading(false);
                    if (data.code === 200) {
                        message.success(`保存成功！`);
                        this.refreshTable();
                    } else {
                        message.error(`保存失败:${data.msg}`);
                    }
                }).catch(err => {
                    this.toggoleSaveLoading(false);
                    message.error(`保存失败:${err.message}`);
                });
            }
        });
    };

    render() {
        const {searchTableLoading, tableKey, visible, voucherVisible, addVisible, params, statusParam = {}, filters, totalSource, record, action, saveLoading} = this.state;
        const {declare} = this.props;
        let disabled = !!declare;

        const noSubmit = statusParam && parseInt(statusParam.status, 0) !== 2;
        return (
            <SearchTable
                searchOption={{
                    fields: searchFields(disabled, declare),
                    cardProps: {
                        className: '',
                        style: {
                            borderTop: 0
                        }
                    }
                }}
                doNotFetchDidMount={!disabled}
                spinning={searchTableLoading}
                backCondition={(filters) => {
                    this.setState({
                        filters
                    }, () => {
                        this.fetchResultStatus();
                    });
                }}
                tableOption={{
                    key: tableKey,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        });
                    },
                    onDataChange: (dataSource) => {
                        this.setState({
                            dataSource
                        });
                    },
                    cardProps: {
                        title: "进项税额明细台账"
                    },
                    pagination: false,
                    columns: getColumns(this, noSubmit && disabled && declare.decAction==='edit'),
                    url: '/account/income/taxDetail/taxDetailList',
                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== '{}' && composeBotton([{
                                type: 'fileExport',
                                url: 'account/income/taxDetail/export',
                                params: filters,
                                title: '导出',
                                userPermissions: ['1381007']
                            }])
                        }
                        {
                            (disabled && declare.decAction === 'edit') && composeBotton([{
                            //     type: 'add',
                            //     icon: 'plus',
                            //     userPermissions: ['1381003'],
                            //     onClick: () => {
                            //         this.setState({
                            //             addVisible: true,
                            //             action: 'add',
                            //             record: filters
                            //         });
                            //     }
                            // }, {
                                type: 'save',
                                text: '保存',
                                icon: 'save',
                                userPermissions: ['1381024'],
                                onClick: this.save,
                                loading: saveLoading
                            }, {
                                type: 'reset',
                                url: '/account/income/taxDetail/reset',
                                params: filters,
                                userPermissions: ['1381014'],
                                onSuccess: this.refreshTable
                            }, {
                                type: 'submit',
                                url: '/account/income/taxDetail/submit',
                                params: filters,
                                userPermissions: ['1381010'],
                                onSuccess: this.refreshTable
                            }, {
                                type: 'revoke',
                                url: '/account/income/taxDetail/revoke',
                                params: filters,
                                userPermissions: ['1381011'],
                                onSuccess: this.refreshTable
                            }], statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title: '合计',
                                    total: [
                                        {title: '金额', dataIndex: 'allAmount'},
                                        {title: '税额', dataIndex: 'allTaxAmount'}
                                    ]
                                }
                            ]
                        }/>
                    </div>
                }}
            >

                <AddPopModal
                    title="新增"
                    visible={addVisible}
                    record={record}
                    action={action}
                    refreshTable={this.refreshTable}
                    toggleModalAddVisible={this.toggleModalAddVisible}
                />
                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    filters={{mainId: filters.mainId, profitCenterId: this.state.currentProfitId, authMonth: filters.authMonth}}
                    toggleModalVisible={this.toggleModalVisible}
                />
                <VoucherPopModal
                    title="凭证信息"
                    visible={voucherVisible}
                    params={params}
                    filters={{mainId: filters.mainId, authMonth: filters.authMonth}}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                />
            </SearchTable>
        );
    }
}

export default Form.create()(InputTaxDetails);
// export default InputTaxDetails;
