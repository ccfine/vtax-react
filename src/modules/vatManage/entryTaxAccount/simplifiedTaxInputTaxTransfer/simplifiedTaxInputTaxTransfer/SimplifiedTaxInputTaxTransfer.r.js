/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'12%',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'12%',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'12%',
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:75,
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'6%',
    },{
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
        width:'6%',
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'6%',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'16%',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'6%',
    }
];
class SimplifiedTaxInputTaxTransfer extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherInfo:{},
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/incomeSimpleOut/controller/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    render(){
        const {tableKey,visibleView,voucherInfo,filters,statusParam} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:this.props.searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns(this),
                    url:'/account/incomeSimpleOut/controller/allSimpleTaxList',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">简易计税进项税额转出台账 / </label>简易计税进项税额转出列表</span>,
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/incomeSimpleOut/controller/allSimple/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1391007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([{
                                    type:'submit',
                                    url:'/account/incomeSimpleOut/controller/submit',
                                    params:filters,
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                    userPermissions:['1391010'],
                                },{
                                    type:'revoke',
                                    url:'/account/incomeSimpleOut/controller/revoke',
                                    params:filters,
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                    userPermissions:['1391011'],
                                }],statusParam)
                            }
                        </div>,
                    },
                    scroll:{
                        x:1600,
                        y:window.screen.availHeight-400-(disabled?50:0),
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visibleView}
                    {...voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}
export default SimplifiedTaxInputTaxTransfer;