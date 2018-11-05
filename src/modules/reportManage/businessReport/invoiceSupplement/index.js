import React, {Component} from 'react';
import {SearchTable, TableTotal, VoucherModal} from 'compoments';
import {composeBotton, fMoney, parseJsonToParams} from 'utils';

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};

const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};

const searchFields = (disabled, declare) => (getFieldValue) => {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'mainId',
            span: 8,
            formItemStyle
        },
        {
            label: "用户名",
            type: 'rangePicker',
            fieldName: "username",
            span: 8,
            formItemStyle,
            componentProps: {
                format: "YYYY-MM-DD"
            }
        },
        {
            label: "房间编码",
            fieldName: "rootCode",
            type: "input",
            span: 8,
            formItemStyle
        },
        {
            label: '利润中心',
            fieldName: 'profitCenterId',
            type: 'asyncSelect',
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: 'profitName',
                fieldValueName: 'id',
                doNotFetchDidMount: true,
                fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
                url: `/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`
            }
        },
        {
            label: "项目分期",
            fieldName: "select",
            type: "select",
            span: 8,
            formItemStyle,
            options: [{text: 'xxx', value: 'eee'}]
        }
    ];
};

const getColumns = (context) => {
    return [
        {
            title: "纳税主体",
            dataIndex: "id",
            width: "200px"
        },
        {
            title: "利润中心",
            dataIndex: "profitCenterName",
            width: "300px"
        },
        {
            title: "项目分期",
            dataIndex: "stagesName",
            width: "200px"
        },
        {
            title: "房间编码",
            dataIndex: "roomCode",
            width: "300px",
            render:(text,record)=>(
                <span title="查看房间编码" onClick={()=>{
                    context.setState({
                        filters:{
                            voucherId:record.id,
                            mainId:record.id,
                        }
                    },()=>{
                        context.toggleModalVoucherVisible(true)
                    })
                }} style={pointerStyle}>
                {text}
            </span>
            ),
        },
        {
            title: "路址",
            dataIndex: "htRoomName",
            width: "200px"
        },
        {
            title: "增值税确认收入金额",
            dataIndex: "confirmedPrice",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: "期初累计开票金额",
            dataIndex: "beginSumInvoiceAmount",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: "未开具发票销售额",
            dataIndex: "noInvoiceSales",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: "未开具发票申报所属期",
            dataIndex: "month",
            width: "200px"
        },
        {
            title: "本期补开票金额",
            dataIndex: "balanceOfInvoice",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: "发票号码",
            dataIndex: "invoiceNum"
        },
        {
            title: "开票所属期",
            dataIndex: "authMonth",
            width: "200px"
        },
        {
            title: "期末累计开票金额",
            dataIndex: "endSumInvoiceAmount",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        },
        {
            title: "期末未开票金额",
            dataIndex: "endUnInvoiceAmount",
            className: 'table-money',
            width: '200px',
            render: text => fMoney(text)
        }
    ];
};


const modelColumns = [
    {
        title: "发票号码",
        dataIndex: "mainId",
        width: "150px"
    },
    {
        title: "发票代码",
        dataIndex: "profitCenterName",
        width: "150px"
    },
    {
        title: "发票类型",
        dataIndex: "username",
        width: "150px"
    },
    {
        title: "购货单位名称",
        dataIndex: "profitCenterName",
        width: "150px"
    },
    {
        title: "备注",
        dataIndex: "username"
    },
    {
        title: "货物或应税劳务名称",
        dataIndex: "profitCenterName",
        width: "200px"
    },
    {
        title: "规格型号",
        dataIndex: "username",
        width: "200px"
    },
    {
        title: "单位",
        dataIndex: "profitCenterName",
        width: "200px"
    },
    {
        title: "数量",
        dataIndex: "username",
        width: "200px"
    },
    {
        title: "单价",
        dataIndex: "username",
        width: "200px"
    },
    {
        title: "金额",
        dataIndex: "profitCenterName",
        width: "200px"
    },
    {
        title: "税率",
        dataIndex: "username",
        width: "200px"
    },
    {
        title: "税额",
        dataIndex: "profitCenterName",
        width: "200px"
    },
    {
        title: "开票日期",
        dataIndex: "username",
        width: "200px"
    }
];

const voucherSearchFields = [
    {
        label: '发票号码',
        fieldName: 'voucherNo',
        type: 'input',
        span: 8,
        componentProps: {}
    }
];

export default class NewPage extends Component {
    state = {
        updateKey: '',
        filters: {},
        voucherVisible: false
    };

    toggleModalVoucherVisible = voucherVisible => {
        this.setState({voucherVisible});
    };

    render() {
        let {filters = {}, totalSource = [], voucherVisible} = this.state;
        return <div className="oneline">
            <SearchTable
                doNotFetchDidMount={false}
                searchOption={{
                    fields: searchFields()
                }}
                tableOption={{
                    key: this.state.updateKey,
                    pageSize: 100,
                    columns: getColumns(this),
                    url: "/test/list",
                    scroll: {
                        x: 3000,
                        y: window.screen.availHeight - 350
                    },
                    cardProps: {
                        title: "未开票销售补开发票报表"
                    },
                    extra: <div>
                        {
                            !(JSON.stringify(filters) !== '{}') && composeBotton([{
                                type: 'fileExport',
                                url: 'account/taxCalculation/pc/export',
                                params: filters,
                                title: '导出',
                                userPermissions: ['1911007']
                            }])
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title: '合计',
                                    total: [
                                        {title: '金额', dataIndex: 'pageAmount'},
                                        {title: '税额', dataIndex: 'pageTaxAmount'},
                                        {title: '价税合计', dataIndex: 'pageTotalAmount'}
                                    ]
                                }
                            ]
                        }/>
                    </div>
                }}
            />
            <VoucherModal
                title="发票信息"
                tableOption={{
                    title: true,
                    columns: modelColumns,
                    url: `/advanceRentPayments/unRealty/list?${parseJsonToParams(filters)}`,
                    scroll: {x: '2800px', y: '250px'}
                }}
                visible={voucherVisible}
                fields={voucherSearchFields}
                toggleModalVoucherVisible={this.toggleModalVoucherVisible}
            />
        </div>;
    }
}