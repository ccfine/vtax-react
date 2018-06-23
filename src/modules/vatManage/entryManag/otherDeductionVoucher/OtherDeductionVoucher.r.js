/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
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
            fieldName:'mainId',
            span:8,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && declare['mainId']) || undefined,
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
        },
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
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">纳税主体名称</p>
            <p className="apply-form-list-p2">纳税主体代码</p>
        </div>,
        dataIndex: 'mainName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.mainNum}</p>
            </div>
        )

    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">项目分期名称</p>
            <p className="apply-form-list-p2">项目分期代码</p>
        </div>,
        dataIndex: 'stagesName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.stagesNum}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">凭证日期</p>
            <p className="apply-form-list-p2">记账日期</p>
        </div>,
        dataIndex: 'voucherDate',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.billingDate}</p>
            </div>
        )
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                    context.setState({
                        voucherInfo:{
                            voucherNum:text,
                            voucherDate:record.voucherDate,
                            mainId:record.mainId,
                        }
                    },()=>{
                        context.toggleViewModalVisible(true)
                    })
            }} style={pointerStyle}>
                {text}
            </span>
        )
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">借方科目名称</p>
            <p className="apply-form-list-p2">借方科目代码</p>
        </div>,
        dataIndex: 'debitSubjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.debitSubjectCode}</p>
            </div>
        )
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        width:'75px',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">借方辅助核算名称</p>
            <p className="apply-form-list-p2">借方辅助核算代码</p>
        </div>,
        dataIndex: 'debitProjectName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.debitProjectNum}</p>
            </div>
        )
    },{
        title: '标记',
        dataIndex: 'sysDictName',
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:400,
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
            tableKey:Date.now()
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
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(this,disabled,declare),
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
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
                     x:1800
                     },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    {...voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
  }))(SalesInvoiceCollection);