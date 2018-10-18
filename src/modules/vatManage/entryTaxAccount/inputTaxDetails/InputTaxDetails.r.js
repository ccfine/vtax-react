/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React, {Component} from 'react';
import {Modal, message, Form} from 'antd';
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
const searchFields = (disabled, declare) => {
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
        }
    ];
};
const getColumns = (context, hasOperate) => {
    let operates = hasOperate ? [{
        title: '操作',
        render: (text, record) => (
            (parseInt(record.invoiceType, 0) === 9)
            && composeBotton([{
                type: 'action',
                title: '编辑',
                icon: 'edit',
                userPermissions: ['1381004'],
                onSuccess: () => context.setState({
                    addVisible: true,
                    action: 'edit',
                    record: record
                })
            }, {
                type: 'action',
                title: '删除',
                icon: 'delete',
                style: {color: '#f5222d'},
                userPermissions: ['1381008'],
                onSuccess: () => {
                    const modalRef = Modal.confirm({
                        title: '友情提醒',
                        content: '该删除后将不可恢复，是否删除？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk: () => {
                            context.deleteRecord(record);
                            modalRef && modalRef.destroy();
                        },
                        onCancel() {
                            modalRef.destroy();
                        }
                    });
                }
            }])
        ),
        fixed: 'left',
        width: '50px',
        dataIndex: 'action',
        className: 'text-center'
    }] : [];
    return [
        ...operates
        , {
            /*    title: '纳税主体',
                dataIndex: 'mainName',
            }, {*/
            title: '抵扣凭据类型',
            dataIndex: 'voucherType'
        }, {
            title: '凭据份数',
            dataIndex: 'num',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if (record.editable) {
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
                                    context.toggleModalVisible(true);
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

        }, {
            title: '金额',
            dataIndex: 'amount',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if (record.editable) {
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
        }, {
            title: '税额',
            dataIndex: 'taxAmount',
            render: (text, record) => {
                const {getFieldDecorator} = context.props.form;
                if (record.editable) {
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
};

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
        visible: false,
        voucherVisible: false,
        addVisible: false,
        params: {},
        saveLoading: false
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
    toggleModalVisible = visible => {
        this.setState({
            visible
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
        let disabled = !!declare,
            notSubmit = parseInt(statusParam.status, 10) === 1;
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
                    cardProps: {
                        title: "进项税额明细台账"
                    },
                    pagination: false,
                    columns: getColumns(this, disabled && declare.decAction === 'edit' && notSubmit),
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
                            }], statusParam)
                        }
                        {
                            (disabled && declare.decAction === 'edit') && composeBotton([{
                                type: 'add',
                                icon: 'plus',
                                userPermissions: ['1381003'],
                                onClick: () => {
                                    this.setState({
                                        addVisible: true,
                                        action: 'add',
                                        record: filters
                                    });
                                }
                            }, {
                                type: 'submit',
                                url: '/account/income/taxDetail/submit',
                                params: filters,
                                userPermissions: ['1381010'],
                                onSuccess: this.refreshTable
                            }, {
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
                    filters={{mainId: filters.mainId, authMonth: filters.authMonth}}
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
