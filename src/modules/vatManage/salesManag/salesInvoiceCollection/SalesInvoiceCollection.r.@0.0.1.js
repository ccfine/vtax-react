/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from "react";
import {connect} from 'react-redux'
import { SearchTable, TableTotal } from "compoments";
import { fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import PopModal from "./popModal";
import moment from "moment";

const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const fields = (disabled,declare)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && declare.mainId) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
]

const searchFields = (disabled,declare) => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            fieldName: "mainId",
            span: 6,
            componentProps: {
                disabled
            },
            formItemStyle,
            fieldDecoratorOptions: {
                initialValue: (disabled && declare.mainId) || undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择纳税主体"
                    }
                ]
            }
        },
        {
            label: "开票月份",
            type: "monthPicker",
            formItemStyle,
            span: 6,
            fieldName: "authMonth",
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                    (disabled && moment(declare.authMonth, "YYYY-MM")) ||
                    undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择开票月份"
                    }
                ]
            }
        },
        {
            label: "发票号码",
            type: "input",
            fieldName: "invoiceNum",
            span: 6,
            formItemStyle,
            fieldDecoratorOptions: {},
            componentProps: {}
        },
        {
            label: "税率",
            type: "numeric",
            span: 6,
            formItemStyle,
            fieldName: "taxRate",
            componentProps: {
                valueType: "int"
            },
            fieldDecoratorOptions: {}
        },
        {
            label: "发票类型",
            fieldName: "invoiceType",
            span: 6,
            formItemStyle,
            type: "select",
            options: [
                {
                    text: "专票",
                    value: "s"
                },
                {
                    text: "普票",
                    value: "c"
                }
            ]
        }
    ];
};
const getColumns = context => [
    {
        title: "纳税主体",
        dataIndex: "mainName",
        render: (text, record) => (
            <span
                title='查看'
                style={{
                    ...pointerStyle,
                    marginLeft: 5
                }}
                onClick={() => {
                    context.setState(
                        {
                            modalConfig: {
                                type: "view",
                                id: record.id
                            }
                        },
                        () => {
                            context.toggleModalVisible(true);
                        }
                    );
                }}
            >
                {text}
            </span>
        ),
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目名称</p>
                <p className="apply-form-list-p2">项目编码</p>
            </div>
        ),
        dataIndex: "projectNum",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.projecName}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票类型</p>
                <p className="apply-form-list-p2">发票代码</p>
            </div>
        ),
        dataIndex: "invoiceType",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票号码</p>
                <p className="apply-form-list-p2">发票明细号</p>
            </div>
        ),
        dataIndex: "invoiceNum",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceDetailNum}</p>
            </div>
        )
    },
    {
        title: '金额',
        dataIndex: "amount",
        className:'table-money',
        render: (text, record) => fMoney(text)
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">购货单位</p>
                <p className="apply-form-list-p2">购方税号</p>
            </div>
        ),
        dataIndex: "purchaseName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.purchaseTaxNum}</p>
            </div>
        )
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width: "75px"
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "数据来源",
        dataIndex: "sourceType",
        width: "60px",
        render: text => {
            text = parseInt(text, 0);
            if (text === 1) {
                return "手工采集";
            }
            if (text === 2) {
                return "外部导入";
            }
            return text;
        }
    }
];
class SalesInvoiceCollection extends Component {
    state = {
        visible: false,
        modalConfig: {
            type: ""
        },
        tableKey: Date.now(),
        filters: {},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource: undefined
    };
    fetchResultStatus = () => {
        requestResultStatus('/output/invoice/collection/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    };
    toggleModalVisible = visible => {
        this.setState({
            visible
        });
    };
    showModal = type => {
        this.toggleModalVisible(true);
        this.setState({
            modalConfig: {
                type: type
            }
        });
    };
    refreshTable = () => {
        this.setState({
            tableKey: Date.now()
        });
    };
    render() {
        const { visible, modalConfig, tableKey, totalSource, statusParam, filters={} } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return (
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields: searchFields(disabled,declare),
                    cardProps: {
                        className: ""
                    }
                }}
                tableOption={{
                    key: tableKey,
                    pageSize: 10,
                    columns: getColumns(this),
                    url: "/output/invoice/collection/list",
                    onSuccess: (params) => {
                        this.setState({
                            filters: params
                        },() => {
                            this.fetchResultStatus();
                        });
                    },
                    cardProps: {
                        title: "销项发票采集列表",
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    composeBotton([{
                                        type:'fileExport',
                                        url:'output/invoice/collection/download',
                                        onSuccess:this.refreshTable
                                    }])
                                }
                                {
                                    (disabled && declare.decAction==='edit') && composeBotton([{
                                        type:'fileImport',
                                        url:'/output/invoice/collection/upload/',
                                        onSuccess:this.refreshTable,
                                        fields:fields(disabled,declare),
                                    },{
                                        type:'submit',
                                        url:'/output/invoice/collection/submit',
                                        params:filters,
                                        onSuccess:this.refreshTable
                                    },{
                                        type:'revoke',
                                        url:'/output/invoice/collection/revoke',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                                }
                                <TableTotal totalSource={totalSource} />
                            </div>
                        )
                    },
                    /*scroll:{
                        x:'180%'
                    },*/
                    onTotalSource: totalSource => {
                        this.setState({
                            totalSource
                        });
                    }
                }}
            >
                <PopModal
                    refreshTable={this.refreshTable}
                    visible={visible}
                    modalConfig={modalConfig}
                    statusParam={statusParam}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </SearchTable>
        );
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(SalesInvoiceCollection)
