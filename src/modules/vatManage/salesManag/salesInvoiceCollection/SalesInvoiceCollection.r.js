/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from "react";
import { SearchTable,TableTotal } from "compoments";
import {message,Modal} from 'antd';
import { fMoney,composeBotton,requestResultStatus,request } from "utils";
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
const markFieldsData = [
    {
        label:'发票状态',
        fieldName:'status',
        type:'select',
        notShowAll:true,
        span:'22',
        options:[
            {
                text:'标记作废',
                value:'-1'
            },{
                text:'取消作废',
                value:'1'
            }
        ],
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择发票状态'
                }
            ]
        }
    }
]
const fields = (disabled,declare) => [
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
        componentProps:{
            //labelInValue:true,
            disabled: (disabled && declare.mainId) ? true : false,
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && declare.mainId) || undefined,
            //initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
    {
        label: '开票月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps: {
            disabled: (disabled && moment(declare.authMonth, 'YYYY-MM')) ? true : false,
        },
        fieldDecoratorOptions: {
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            rules: [
                {
                    required: true,
                    message: '请选择开票月份'
                }
            ]
        },
    }
]

const status = [
    {
        text: "正常",
        value: "1"
    },
    {
        text: "作废",
        value: "-1"
    },
    {
        text: "红冲",
        value: "2"
    }
]

const searchFields = (disabled,declare) => getFieldValue => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            fieldName: "main",
            span: 6,
            componentProps: {
                labelInValue:true,
                disabled
            },
            formItemStyle,
            fieldDecoratorOptions: {
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
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
            label: "发票状态",
            fieldName: "status",
            span: 6,
            formItemStyle,
            type: "select",
            options: status
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
const getColumns = (context) => [
    {
        title:'利润中心',
        dataIndex:'profitCenterName',
        width:'200px',
    },
    {
        title: '发票类型',
        dataIndex: "invoiceType",
        width:'150px',
    },
    {
        title: '发票代码',
        dataIndex: "invoiceCode",
        width:'150px',
    },
    {
        title: '发票号码',
        dataIndex: "invoiceNum",
        width:'150px',
        render: (text, record) => (
            <a title='查看详情'
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
               }}>
                {text}
            </a>
        )
    },
    {
        title: '发票状态',
        dataIndex: "status",
        width:'150px',
        render:text=>{
            status.map(o=>{
                if( parseInt(o.value, 0) === parseInt(text, 0)){
                    text = o.text
                }
                return '';
            })
            return text;
        },
    },
    {
        title: '备注',
        dataIndex: 'remark',
        //width:'500px',
    },
    {
        title: '金额',
        dataIndex: "amount",
        className:'table-money',
        width:'100px',
        render: (text, record) => fMoney(text)
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        width:'100px',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width:'100px',
    },
    {
        title: '购货单位',
        dataIndex: "purchaseName",
        width:'200px',
    },
    {
        title: "数据来源",
        dataIndex: "sourceType",
        width:'100px',
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
]

export default class SalesInvoiceCollection extends Component {
    state = {
        visible: false,
        deleteLoading:false,
        modalConfig: {
            type: ""
        },
        tableKey: Date.now(),
        filters: {},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource: undefined,
        selectedRowKeys:[],
    };
    fetchResultStatus = () => {
        requestResultStatus('',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    };
    toggleDeleteLoading=(val)=>{
        this.mounted && this.setState({deleteLoading:val})
    }
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleDeleteLoading(true)
                request.post(`/output/invoice/collection/deleteByIds`,this.state.selectedRowKeys)
                    .then(({data})=>{
                        this.toggleDeleteLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                    this.toggleDeleteLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }

    toggleModalVisible = visible => {
        this.mounted && this.setState({
            visible
        });
    };
    showModal = type => {
        this.toggleModalVisible(true);
        this.mounted && this.setState({
            modalConfig: {
                type: type
            }
        });
    };
    refreshTable = () => {
        this.mounted && this.setState({
            tableKey: Date.now(),
            selectedRowKeys:[],
        });
    };
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render() {
        const { visible, modalConfig, tableKey, totalSource, statusParam={}, filters={}, selectedRowKeys,deleteLoading } = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            handle = declare && declare.decAction==='edit',
            isCheck = (disabled && handle && statusParam && parseInt(statusParam.status,10)===1);
        return (
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields: searchFields(disabled,declare),
                        cardProps: {
                            className: "",
                            style:{borderTop:0},
                        }
                    }}
                    backCondition={(filters) => {
                        this.setState({
                            filters,
                        },() => {
                            handle && this.fetchResultStatus();
                        });
                    }}
                    tableOption={{
                        key: tableKey,
                        pageSize: 100,
                        columns: getColumns(this),
                        url: `/output/invoice/collection/list${handle ? '?handle=true' : ''}`,
                        // rowSelection:{
                        //     type: 'checkbox',
                        // },
                        rowSelection:isCheck?{
                            getCheckboxProps: record => ({
                                disabled: parseInt(record.sourceType, 0)  === 2, // Column configuration not to be checked
                            }),
                        }:undefined,
                        onRowSelect:isCheck?(selectedRowKeys)=>{
                            this.mounted && this.setState({
                                selectedRowKeys
                            })
                        }:undefined,
                        cardProps: {
                            title: "销项发票采集",
                            extra: (
                                <div>
                                    {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'output/invoice/collection/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1061007'],
                                        }])
                                    }
                                    {
                                        (disabled && handle)  &&  composeBotton([{
                                            type:'fileExport',
                                            url:'output/invoice/collection/download',
                                            onSuccess:this.refreshTable,
                                            userPermissions:['1061005'],
                                        },{
                                            type:'fileImport',
                                            url:'/output/invoice/collection/upload',
                                            onSuccess:this.refreshTable,
                                            fields:fields(disabled,declare),
                                            userPermissions:['1061005'],
                                        },{
                                            type:'revokeImport',
                                            url:'/output/invoice/collection/revocation',
                                            params:filters,
                                            monthFieldName:"authMonth",
                                            onSuccess:this.refreshTable,
                                            userPermissions:['1065000'],
                                        },{
                                            type:'mark',
                                            buttonOptions:{
                                                text:'标记发票状态',
                                                icon:'pushpin-o'
                                            },
                                            modalOptions:{
                                                title:'标记发票状态'
                                            },
                                            formOptions:{
                                                filters: filters,
                                                selectedRowKeys: selectedRowKeys,
                                                url:"/output/invoice/collection/update/status",
                                                fields: markFieldsData,
                                                onSuccess:()=>{
                                                    this.refreshTable()
                                                },
                                                userPermissions:['1395000'],
                                            }
                                        },{
                                            type:'delete',
                                            icon:'delete',
                                            text:'删除',
                                            btnType:'danger',
                                            loading:deleteLoading,
                                            selectedRowKeys:selectedRowKeys,
                                            userPermissions:['1061008'],
                                            onClick:this.deleteData
                                        }],statusParam)
                                    }
                                    <TableTotal type={3} totalSource={totalSource} data={
                                        [
                                            {
                                                title:'合计',
                                                total:[
                                                    {title: '发票金额', dataIndex: 'allAmount'},
                                                    {title: '发票税额', dataIndex: 'allTaxAmount'},
                                                    {title: '价税合计', dataIndex: 'allTotalAmount'},
                                                ],
                                            }
                                        ]
                                    } />
                                </div>
                            )
                        },
                        scroll:{
                            x:1900,
                            y:window.screen.availHeight-450,
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
