/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from "react";
import { SearchTable,TableTotal } from "compoments";
import {message,Modal} from 'antd';
import { fMoney, listMainResultStatus,composeBotton,requestResultStatus,request,requestTaxSubjectConfig } from "utils";
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
        componentProps:{
            //labelInValue:true,
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
        componentProps: {},
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

const searchFields = (disabled,declare) => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            fieldName: "main",
            span: 8,
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
const getColumns = (context) => [{
    title: "纳税主体",
    dataIndex: "mainName",
    width:'200px',
},
    {
        title: '发票类型',
        dataIndex: "invoiceType",
        width:'100px',
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
        render: text => text?`${text}%`:text
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
    },
    /*,
     {
     title: '购方税号',
     dataIndex: "purchaseTaxNum",
     width:'150px',
     },
     {
     title: '项目名称',
     dataIndex: "projectName",
     width:'150px',
     },
     {
     title: '项目编码',
     dataIndex: "projectNum",
     width:'150px',
     },
     */

]

class SalesInvoiceCollection extends Component {
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
        isShowImport:null,
    };
    fetchResultStatus = () => {
        requestResultStatus('/output/invoice/collection/listMain',this.state.filters,result=>{
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
    fetchTaxSubjectConfig = () =>{
        //根据纳税主体那边的参数设置来判断是否展示导入；并且删除的时候需要加上如果是从接口来的数据不能删除
        requestTaxSubjectConfig(this.state.filters && this.state.filters.mainId, result=>{
            this.mounted && this.setState({
                isShowImport: typeof result === 'undefined' ? 0 : result.unusedInvoicePlatform
            })
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render() {
        const { visible, modalConfig, tableKey, totalSource, statusParam={}, filters={}, selectedRowKeys,deleteLoading,isShowImport } = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            isCheck = (disabled && declare.decAction==='edit' && statusParam && parseInt(statusParam.status,10)===1);
        return (
            <div className='oneLine'>
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
                            this.fetchResultStatus();
                            this.fetchTaxSubjectConfig()
                        });
                    }}
                    tableOption={{
                        key: tableKey,
                        pageSize: 100,
                        columns: getColumns(this),
                        url: "/output/invoice/collection/list",
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
                                        listMainResultStatus(statusParam)
                                    }
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
                                        composeBotton([{
                                            type:'fileExport',
                                            url:'output/invoice/collection/download',
                                            onSuccess:this.refreshTable
                                        }])
                                    }
                                    {
                                        (disabled && declare.decAction==='edit') && parseInt(isShowImport, 0) === 1 &&  composeBotton([{
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
                                        }],statusParam)
                                    }
                                    {
                                        (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'delete',
                                            icon:'delete',
                                            text:'删除',
                                            btnType:'danger',
                                            loading:deleteLoading,
                                            selectedRowKeys:selectedRowKeys,
                                            userPermissions:['1061008'],
                                            onClick:this.deleteData
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
                            y:window.screen.availHeight-400,
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
            </div>
        );
    }
}
export default SalesInvoiceCollection
