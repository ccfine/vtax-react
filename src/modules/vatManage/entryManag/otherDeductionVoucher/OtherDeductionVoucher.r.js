/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {requestResultStatus,fMoney,requestDict,listMainResultStatus,composeBotton,setFormat} from 'utils'
import {SearchTable} from 'compoments'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'

import moment from 'moment';
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(context,disabled,declare)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'main',
            span:8,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },

        }, {
            label:'凭证月份',
            type:'monthPicker',
            formItemStyle,
            span:8,
            fieldName:'authMonth',
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择凭证月份'
                    }
                ]
            }
        }, {
            label:'标记类型',
            fieldName:'sysDictId',
            span:8,
            formItemStyle,
            type:'select',
            options:context.state.sysDictIdList.concat({value:'0', text:'无'})
        },{
            label:'凭证摘要',
            type:'input',
            fieldName:'voucherAbstract',
            span:8,
            formItemStyle,

        }
    ]
}
const markFieldsData = context => [
    {
        label: '标记类型',
        fieldName: 'sysDictId',
        type: 'select',
        notShowAll: true,
        span: '22',
        options: context.state.sysDictIdList.concat({value:'0', text:'无'}),
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择标记类型'
                }
            ]
        }
    }
]
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'200px',
    },
    {
        title: '纳税主体代码',
        dataIndex: 'mainNum',
        width:'100px',
    },
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },
    {
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'100px',
    },
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: '记账日期',
        dataIndex: 'billingDate',
        width:'100px',
    },
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                    context.setState({
                        voucherInfo:{
                            voucherId:record.voucherId,
                        }
                    },()=>{
                        context.toggleViewModalVisible(true)
                    })
            }} style={pointerStyle}>
                {text}
            </span>
        ),
        sorter: true,
        width:'100px',
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:'500px',
    },
    /*{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'100px',
    },*/
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'300px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: '借方辅助核算名称',
        dataIndex: 'debitProjectName',
        width:'200px',
    },
    {
        title: '借方辅助核算代码',
        dataIndex: 'debitProjectNum',
        width:'200px',
    },
    {
        title: '标记',
        dataIndex: 'sysDictName',
        width:'100px',
    }
];
class SalesInvoiceCollection extends Component{
    state={

        tableKey:Date.now(),
        visible:false,
        voucherInfo:{},
        filters:{},
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
        //他可抵扣进项税明细标记: 取数据字典JXFPLX 无ID则无标记
        sysDictIdList:[],
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/income/financeDetails/controller/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    toggleViewModalVisible=visible=>{
        this.setState({
            visible
        })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now(),
            selectedRowKeys:[],
        })
    }

    componentDidMount(){
        //纳税申报
        requestDict('JXFPLX',result=>{
            this.setState({
                sysDictIdList : setFormat(result)
            })
        });
    }
    render(){
        const {visible,tableKey,filters,selectedRowKeys,voucherInfo,statusParam} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(this,disabled,declare),
                    cardProps:{
                        style:{borderTop:0}
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns(this),
                    url:'/income/financeDetails/controller/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                            selectedRowKeys:[],
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onRowSelect:(disabled && declare.decAction==='edit')?(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    }:undefined,
                    cardProps: {
                        title: "其他扣税凭证",
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'income/financeDetails/controller/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1521007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/income/financeDetails/controller/upFlag",
                                        fields: markFieldsData(this),
                                        onSuccess: this.refreshTable,
                                        userPermissions:['1525000'],
                                    }
                                },{
                                    type:'submit',
                                    url:'/income/financeDetails/controller/submit',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1521010'],
                                },{
                                    type:'revoke',
                                    url:'/income/financeDetails/controller/revoke',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1521011'],
                                }],statusParam)
                            }
                        </div>,
                    },
                    scroll:{
                     x:2400,
                     y:window.screen.availHeight-390-(disabled?50:0),
                     },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    {...voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
            </div>
        )
    }
}

export default SalesInvoiceCollection;