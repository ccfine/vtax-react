/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  : 进项税额明细台账
 */
import React, {Component} from 'react';
import {message, Form} from 'antd';
import {SearchTable, TableTotal} from 'compoments';
import {request, requestResultStatus, fMoney, listMainResultStatus, composeBotton, parseJsonToParams} from 'utils';
import AddPopModal from './addPopModal';
import moment from 'moment';
import {NumericInputCell} from 'compoments/EditableCell';
import VoucherModal from 'compoments/voucherModal';

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
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
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
            dataIndex: 'voucherType',
            render: (text, record) => {
                if (record.voucherType === '代扣代缴税收缴款凭证') {
                    return (<span title="查看凭证信息详情" onClick={() => {
                        context.setState({
                            voucherParams: {
                                profitCenterId: record.profitCenterId,
                                voucherType: record.voucherType,
                            }
                        }, () => {
                            context.toggleModalVoucherVisible(true);
                        });
                    }} style={pointerStyle}>{text}</span>);
                    
                } else if (record.voucherType === '农产品收购发票或者销售发票' || record.voucherType === '海关进口增值税专用缴款书' || record.voucherType === '其他允许抵扣证明') {
                    return (<span title="查看发票信息详情" onClick={() => {
                        context.setState({
                            voucherParams: {
                                profitCenterId: record.profitCenterId,
                                voucherType: record.voucherType,
                            }
                        }, () => {
                            context.toggleModalVisible_3(true);
                        });
                    }} style={pointerStyle}>
                        {text}
                    </span>);
                } else if (record.voucherType === '增值税专用发票') {
                    return (<span title="查看发票信息详情" onClick={() => {
                        context.toggleModalVisible(true);
                    }} style={pointerStyle}>
                        {text}
                    </span>);
                } else {
                    return text;
                }
            }
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
                return text;
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

const voucherSearchFields = [
    {
        label:'SAP凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
]

const voucherColumns = [{
    title: '利润中心',
    dataIndex: 'profitCenterName',
    width: 200
}, {
    title: '项目分期',
    dataIndex: 'stagesNum',
    width: 200
}, {
    title: '过账日期',
    dataIndex: 'billingDate',
    width:200,
}, {
    title: 'SAP凭证号',
    dataIndex: 'voucherNumSap',
    width: 200
}, {
    title: '凭证摘要',
    dataIndex: 'voucherAbstract',
    width: 100
}, {
    title: '借方科目名称',
    dataIndex: 'debitSubjectName',
    width: 100
}, {
    title: '借方科目代码',
    dataIndex: 'debitSubjectCode',
    width: 100
}, {
    title: '借方金额',
    dataIndex: 'debitAmount',
    width:100,
}, {
    title: '代扣代缴类型',
    dataIndex: 'withholding_type',
    width: 100
}];

const invoiceSearchFields = [
    {
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
];

const invoiceColumns_1 = [
    {
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'5%',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return ''
        },
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
        width:'15%',
    }, {
        title: '发票类型',
        dataIndex: 'invoiceType',
        width:'5%',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'5%',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'10%',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'5%',
    },{
        title: '认证月份',
        dataIndex: 'authMonth',
        width:'5%',
    },{
        title: '认证时间',
        dataIndex: 'authDate',
        width:'5%',
    },{
        title: '销售单位名称',
        dataIndex: 'sellerName',
        width:'15%',
    },{
        title: '纳税人识别号',
        dataIndex: 'sellerTaxNum',
        width:'10%',
    },{
        title: '金额',
        dataIndex: 'amount',
        className: "table-money",
        width:'5%',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        className: "table-money",
        width:'8%',
        render:text=>fMoney(text),

    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        className: "table-money",
        width:'8%',
        render:text=>fMoney(text),
    }
];

const invoiceColumns_3 = [
    {
        title: '抵扣凭据类型',
        dataIndex: 'sourceType',
        width:'80px',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return ''
        },
    }, {
        title: '发票类型',
        dataIndex: 'zefplx',
        width: '80px',
        render: text => {
            if (text === 's') {
                return '专票';
            }
            if (text === 'c') {
                return '普票';
            }
            return text;
        }
    }, {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width: '100px'
    }, {
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width: '100px'
    }, {
        title: '开票日期',
        dataIndex: 'zekprq',
        width: '200px',
        render(text){
            return moment(text).format('YYYY-MM-DD');
        }
    }, {
        title: '认证所属期',
        dataIndex: 'zerzshq',
        width: '200px'
    }, {
        title: '认证时间',
        dataIndex: 'zerzsj',
        width: '200px',
        render(text){
            return moment(text).format('YYYY-MM-DD');
        }
    }, {
        title: '金额',
        dataIndex: 'zebhsje',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)
    }, {
        title: '税额',
        dataIndex: 'zese',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)

    }, {
        title: '含税金额',
        dataIndex: 'zehsje',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)
    }
];



class InputTaxDetails extends Component {
    state = {
        tableKey: Date.now(),
        searchTableLoading: false,
        filters: {},
        voucherParams: {},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource: undefined,
        dataSource: undefined,
        visible: false,
        visible_3: false,
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
    toggleModalVisible = (visible) => {
        this.setState({
            visible
        });
    };
    toggleModalVisible_3 = visible_3 => {
        this.setState({
            visible_3
        });
    }
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
        const {searchTableLoading, tableKey, visible, visible_3, voucherVisible, addVisible, statusParam = {}, filters, voucherParams, totalSource, record, action, saveLoading} = this.state;
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
                <VoucherModal
                    title="发票信息"
                    visible={visible}
                    fields={invoiceSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVisible}
                    tableOption={{
                        columns:invoiceColumns_1,
                        url:`/income/invoice/collection/detailList?${parseJsonToParams(filters)}`,
                        scroll:{ x: '1800px',y:'250px' },
                    }}
                />
                <VoucherModal
                    title="凭证信息"
                    visible={voucherVisible}
                    fields={voucherSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                    tableOption={{
                        columns:voucherColumns,
                        // url:`/other/tax/deduction/vouchers/list/pools/${this.state.paramsId}`,
                        url:`/other/tax/deduction/vouchers/list/voucher?${parseJsonToParams({...filters, ...voucherParams})}`,
                        scroll:{ x: '1800px',y:'250px' },
                    }}
                />
                <VoucherModal
                    title="发票信息"
                    visible={visible_3}
                    fields={invoiceSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVisible_3}
                    tableOption={{
                        columns:invoiceColumns_3,
                        // url:`/other/tax/deduction/vouchers/list/pools/${this.state.paramsId}`,
                        url: `/other/tax/deduction/vouchers/list/pools?${parseJsonToParams({...filters, ...voucherParams})}`,
                        scroll:{ x: '1800px',y:'250px' },
                    }}
                />
            </SearchTable>
        );
    }
}

export default Form.create()(InputTaxDetails);
// export default InputTaxDetails;
