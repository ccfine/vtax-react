/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, {Component} from 'react';
import {requestResultStatus, fMoney, requestDict, listMainResultStatus, composeBotton, setFormat,parseJsonToParams} from 'utils';
import {SearchTable, TableTotal} from 'compoments';
import VoucherModal from 'compoments/voucherModal'

import moment from 'moment';

const pointerStyle = {
    cursor: 'pointer',
    color: '#1890ff'
};
const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const searchFields = (context, disabled, declare) => (getFieldValue) => {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'main',
            span: 8,
            componentProps: {
                labelInValue: true,
                disabled
            },
            formItemStyle,
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
            label: '凭证月份',
            type: 'monthPicker',
            formItemStyle,
            span: 8,
            fieldName: 'authMonth',
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择凭证月份'
                    }
                ]
            }
        }, {
            label: '利润中心',
            fieldName: 'profitCenterId',
            type: 'asyncSelect',
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: 'profitName',
                fieldValueName: 'id',
                doNotFetchDidMount: false,
                fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
                url: `/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`
            }
        }
    ];
};

const columns = context => {
    let lastStegesId = '';
    const {dataSource} = context.state;
    return [
        {
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width: '300px',
            render: (text, row, index) => {
                let rowSpan = 0;
                if (lastStegesId !== row.profitCenterId) {
                    lastStegesId = row.profitCenterId;
                    rowSpan = dataSource.filter(ele => ele.profitCenterId === row.profitCenterId).length;
                }
                if ((index + 1) === dataSource.length) {
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
            title: '其他扣税凭证',
            dataIndex: 'voucherType'
        },
        {
            title: '凭据数量',
            className: 'text-center',
            dataIndex: 'voucherCount',
            width: '200px',
            render: (text, record, index) => {
                if (record.voucherType === '代扣代缴税收缴款凭证') {
                    //凭证
                    return <span title="查看凭证信息详情" onClick={() => {
                        context.setState({
                            voucherParams: {
                                profitCenterId: record.profitCenterId,
                                voucherType: record.voucherType,
                            }
                        }, () => {
                            context.toggleModalVoucherVisible(true);
                        });
                    }} style={pointerStyle}>{text}</span>;
                } else if (record.voucherType) {
                    //发票
                    return <span title="查看发票信息详情" onClick={() => {
                        context.setState({
                            voucherParams: {
                                profitCenterId: record.profitCenterId,
                                voucherType: record.voucherType,
                            }
                        }, () => {
                            context.toggleModalVisible(true);
                        });
                    }} style={pointerStyle}>{text}</span>;
                } else {
                    return text;
                }
            }

        },
        {
            title: '金额',
            dataIndex: 'amount',
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: '税额',
            dataIndex: 'taxAmount',
            width: '200px',
            className: 'table-money',
            render: text => fMoney(text)
        }
    ];
};

const voucherSearchFields = [
    {
        label:'SAP凭证号',
        fieldName:'voucherNumSap',
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
    dataIndex: 'excelBillingDate',
    width:150,
}, {
    title: 'SAP凭证号',
    dataIndex: 'voucherNumSap',
    width: 150
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
    dataIndex: 'withholdingType',
    width: 100
}];


const invoiceSearchFields =[
    {
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
]


const invoiceColumns = [
    {
        title: '抵扣凭据类型',
        dataIndex: 'zesfdkxm',
        width:'100px',
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
        width: '100px',
        render(text){
            return moment(text).format('YYYY-MM-DD');
        }
    }, {
        title: '认证所属期',
        dataIndex: 'zerzshq',
        width: '100px'
    }, {
        title: '认证时间',
        dataIndex: 'zerzsj',
        width: '100px',
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


export default class OtherDeductionVoucher extends Component {
    state = {

        tableKey: Date.now(),
        visible: false,
        voucherVisible: false,
        voucherInfo: {},
        filters: {},
        dataSource: [],
        selectedRowKeys: [],
        voucherParams: {},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        //他可抵扣进项税明细标记: 取数据字典JXFPLX 无ID则无标记
        sysDictIdList: []
    };
    fetchResultStatus = () => {
        requestResultStatus('/other/tax/deduction/vouchers/listMain', this.state.filters, result => {
            this.setState({
                statusParam: result
            });
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

    refreshTable = () => {
        this.setState({
            tableKey: Date.now(),
            selectedRowKeys: []
        });
    };

    componentDidMount() {
        //纳税申报
        requestDict('JXFPLX', result => {
            this.setState({
                sysDictIdList: setFormat(result)
            });
        });
    }

    render() {
        const {visible, tableKey, filters, voucherVisible, statusParam, totalSource, voucherParams} = this.state;
        const {declare} = this.props;
        let disabled = !!declare;
        return (
            <div className='oneLine'>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields: searchFields(this, disabled, declare),
                        cardProps: {
                            style: {borderTop: 0}
                        }
                    }}
                    backCondition={(filters) => {
                        this.setState({
                            filters,
                            selectedRowKeys: []
                        }, () => {
                            this.fetchResultStatus();
                        });
                    }}
                    tableOption={{
                        key: tableKey,
                        pageSize: 100,
                        columns: columns(this),
                        url: '/other/tax/deduction/vouchers/list',
                        onDataChange: (dataSource) => {
                            this.setState({
                                dataSource
                            });
                        },
                        cardProps: {
                            title: "其他扣税凭证",
                            extra: <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters) !== '{}' && composeBotton([{
                                        type: 'fileExport',
                                        url: '/other/tax/deduction/vouchers/export',
                                        params: filters,
                                        title: '导出',
                                        userPermissions: ['1521007']
                                    }])
                                }
                                {
                                    (disabled && declare.decAction === 'edit') && composeBotton([{

                                        type: 'reset',
                                        url: '/other/tax/deduction/vouchers/reset',
                                        params: filters,
                                        userPermissions: ['1525000'],
                                        onSuccess: this.refreshTable

                                    }, {
                                        type: 'submit',
                                        url: '/other/tax/deduction/vouchers/submit',
                                        params: filters,
                                        onSuccess: this.refreshTable,
                                        userPermissions: ['1521010']
                                    }, {
                                        type: 'revoke',
                                        url: '/other/tax/deduction/vouchers/revoke',
                                        params: filters,
                                        onSuccess: this.refreshTable,
                                        userPermissions: ['1521011']
                                    }], statusParam)
                                }

                                <TableTotal type={3} totalSource={totalSource} data={
                                    [
                                        {
                                            title: '合计',
                                            total: [
                                                {title: '金额', dataIndex: 'amount'},
                                                {title: '税额', dataIndex: 'taxAmount'}
                                            ]
                                        }
                                    ]
                                }/>
                            </div>
                        },
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            });
                        },
                        scroll: {
                            // x:2400,
                            y: window.screen.availHeight - 390 - (disabled ? 50 : 0)
                        }
                    }}
                >
                    <VoucherModal
                        title="发票信息"
                        visible={visible}
                        fields={invoiceSearchFields}
                        toggleModalVoucherVisible={this.toggleModalVisible}
                        tableOption={{
                            columns:invoiceColumns,
                            url: `/other/tax/deduction/vouchers/list/pools?${parseJsonToParams({...filters, ...voucherParams})}`,
                            scroll:{ x: '200%', y: 200 },
                            extra: <div>
                                {
                                    composeBotton([{
                                        type: 'fileExport',
                                        url: '/other/tax/deduction/vouchers/export/pools',
                                        params: {...filters, ...voucherParams},
                                        title: '导出',
                                        userPermissions: ['1521007']
                                    }])
                                }
                            </div>
                        }}
                    />
                    <VoucherModal
                        title="凭证信息"
                        visible={voucherVisible}
                        fields={voucherSearchFields}
                        toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                        tableOption={{
                            columns:voucherColumns,
                            url:`/other/tax/deduction/vouchers/list/voucher?${parseJsonToParams({...filters, ...voucherParams})}`,
                            scroll:{ x: '200%',y:'200px' },
                            extra: <div>
                                {
                                    composeBotton([{
                                        type: 'fileExport',
                                        url: '/other/tax/deduction/vouchers/export/voucher',
                                        params: {...filters, ...voucherParams},
                                        title: '导出',
                                        userPermissions: ['1521007']
                                    }])
                                }
                            </div>
                        }}
                    />
                </SearchTable>
            </div>
        );
    }
}