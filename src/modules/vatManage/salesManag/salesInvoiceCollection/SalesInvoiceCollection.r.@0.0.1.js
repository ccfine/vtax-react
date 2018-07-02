/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from "react";
import {connect} from 'react-redux'
import { SearchTable, TableTotal } from "compoments";
import {Modal,message} from 'antd';
import { fMoney, listMainResultStatus,composeBotton,requestResultStatus,request } from "utils";
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
            span: 8,
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
            span: 8,
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
            span: 8,
            formItemStyle,
            fieldDecoratorOptions: {},
            componentProps: {}
        },
        {
            label: "税率",
            type: "numeric",
            span: 8,
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
            span: 8,
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
const getColumns = (context,hasOperate) => {
    let operates = hasOperate?[{
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:['1061008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    }]:[];
    return [
        ...operates
    ,{
        title: "纳税主体",
        dataIndex: "mainName",
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目名称</p>
                <p className="apply-form-list-p2">项目编码</p>
            </div>
        ),
        width:'10%',
        dataIndex: "projectName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.projectNum}</p>
            </div>
        )
    },
    {
        title: '发票类型',
        dataIndex: "invoiceType",
        width:100,
    },
    {
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票号码</p>
            <p className="apply-form-list-p2">发票代码</p>
        </div>,
        dataIndex: "invoiceNum",
        width:80,
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1"><span title='查看详情'
                    style={{
                        ...pointerStyle
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
                }}>{text}</span></p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        )
    },
    {
        title: '金额',
        dataIndex: "amount",
        className:'table-money',
        width:'8%',
        render: (text, record) => fMoney(text)
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">购货单位</p>
                <p className="apply-form-list-p2">购方税号</p>
            </div>
        ),
        width:'12%',
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
        width: 75,
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className: "table-money",
        width: '8%',
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        width: 40,
        render: text => text?`${text}%`:text
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className: "table-money",
        width: '8%',
    },
    {
        title: "数据来源",
        dataIndex: "sourceType",
        width: 60,
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
    },{
        title: '备注',
        dataIndex: 'remark',
        width: '6%',
    }
];
}
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
    deleteRecord(record){
        request.delete(`/output/invoice/collection/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
                message.error(err.message);
            })
    }
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
        const { visible, modalConfig, tableKey, totalSource, statusParam={}, filters={} } = this.state;
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
                    columns: getColumns(this,(disabled && declare.decAction==='edit') && parseInt(statusParam.status,10)===1),
                    url: "/output/invoice/collection/list",
                    onSuccess: (params) => {
                        this.setState({
                            filters: params
                        },() => {
                            this.fetchResultStatus();
                        });
                    },
                    cardProps: {
                        title: "销项发票采集",
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'output/invoice/collection/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1061002'],
                                    }])
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
                                        userPermissions:['1061005'],
                                    },{
                                        type:'submit',
                                        url:'/output/invoice/collection/submit',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1061010'],
                                    },{
                                        type:'revoke',
                                        url:'/output/invoice/collection/revoke',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1061011'],
                                    }],statusParam)
                                }
                                <TableTotal totalSource={totalSource} />
                            </div>
                        )
                    },
                    scroll:{
                        y:window.screen.availHeight-490,
                        x:1100,
                    },
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
