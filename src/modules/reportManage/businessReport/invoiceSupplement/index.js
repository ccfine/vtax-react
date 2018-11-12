import React, {Component} from 'react';
import {SearchTable, TableTotal, PopDetailsModal} from 'compoments';
import {composeBotton, fMoney, parseJsonToParams} from 'utils';
import moment from 'moment';

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
            fieldName: 'main',
            span: 8,
            componentProps: {
                labelInValue: true,
                disabled
            },
            formItemStyle,
            fieldDecoratorOptions: {
                initialValue: declare ? {key:declare.mainId,label:declare.mainName} : undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税主体'
                    }
                ]
            }
        },
        {
            label: "开票所属期",
            type: 'monthPicker',
            fieldName: "authMonth",
            span: 8,
            formItemStyle,
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择开票所属期'
                    }
                ]
            }
        },
        {
            label: "房间编码",
            fieldName: "roomCode",
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
            label:'项目分期',
            fieldName:'stageId',
            type:'asyncSelect',
            span: 8,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}`,
            }

            // label: "项目分期",
            // fieldName: "stageId",
            // type: "select",
            // span: 8,
            // formItemStyle,
            // options: [{text: 'xxx', value: 'eee'}]
        }
    ];
};

const getColumns = (context) => {
    return [
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
            width: "300px"
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
            dataIndex: "invoiceNum",
            render:(text,record)=>(
                <span title="查看房间编码" onClick={()=>{
                    context.setState({
                        detailFilters:{
                            mainId:record.mainId,
                            authMonth:record.authMonth,
                            roomCode:record.roomCode,
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
        dataIndex: "invoiceNum",
        width: "150px"
    },
    {
        title: "发票代码",
        dataIndex: "invoiceCode",
        width: "150px"
    },
    {
        title: "发票类型",
        dataIndex: "invoiceType",
        width: "150px",
        render(text){
            let value = '';
            if(text === 's'){
                value = '专票'
            }else if(text === 'c'){
                value = '普票';
            }
            return value;
        }
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width: "200px"
    },
    {
        title: "金额",
        dataIndex: "amount",
        width: "200px",
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        width: "200px",
        render:text=>text? `${text}%`: text,
        className: "table-money",
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        width: "200px",
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        width: "200px",
        render: text => fMoney(text),
        className: "table-money",
    },
    {
        title: "购货单位名称",
        dataIndex: "purchaseName",
        width: "150px"
    },
    {
        title: "备注",
        dataIndex: "remark"
    }
];

const voucherSearchFields = [
    {
        label: '发票号码',
        fieldName: 'invoiceNum',
        type: 'input',
        span: 8,
        componentProps: {}
    }
];

export default class NewPage extends Component {
    state = {
        updateKey: '',
        filters: {},
        detailFilters: {},
        voucherVisible: false,
        totalSource: {}
    };

    toggleModalVoucherVisible = voucherVisible => {
        this.setState({voucherVisible});
    };

    render() {
        let {filters = {}, detailFilters={}, totalSource = [], voucherVisible} = this.state;
        return <div className="oneline">
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields: searchFields()
                }}
                backCondition={(filters) => {
                    this.setState({
                        filters,
                    });
                }}
                tableOption={{
                    key: this.state.updateKey,
                    pageSize: 100,
                    columns: getColumns(this),
                    url: "/invoice/for/unbilled/sales/report/list",
                    scroll: {
                        x: 3000,
                        y: window.screen.availHeight - 350
                    },
                    cardProps: {
                        title: "未开票销售补开发票报表"
                    },
                    extra: <div>
                        {
                            JSON.stringify(filters) !== '{}' && composeBotton([{
                                type: 'fileExport',
                                url: '/invoice/for/unbilled/sales/report/export',
                                params: filters,
                                title: '导出',
                                userPermissions: ['2191007']
                            }])
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title: '合计',
                                    total: [
                                        {title: '本期补开票金额', dataIndex: 'totalAmount'},
                                    ]
                                }
                            ]
                        }/>
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        });
                    }
                }}
            />
            <PopDetailsModal
                title="发票信息"
                tableOption={{
                    title: true,
                    columns: modelColumns,
                    url: `/invoice/for/unbilled/sales/report/invoice/list?${parseJsonToParams(detailFilters)}`,
                    scroll: {x: '2000px', y: '250px'}
                }}
                visible={voucherVisible}
                fields={voucherSearchFields}
                toggleModalVoucherVisible={this.toggleModalVoucherVisible}
            />
        </div>;
    }
}