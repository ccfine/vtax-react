/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'
// import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
/*
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}

const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherNum:text,
                },()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        )
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money"
    }
];*/

const columns = context =>[
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    },{
        title: '项目分期',
        dataIndex: 'stageName',
    },{
        title: '固定资产取得价值',
        dataIndex: 'gainValue',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: '当期凭证待抵扣进项税额',
        dataIndex: 'deductedVoucherTaxAmount',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: '当期固定资产待抵扣进项税额',
        dataIndex: 'deductedFixedTaxAmount',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: '差异金额',
        dataIndex: 'difAmount',
        render: text => fMoney(text),
        className: "table-money"
    }
];

export default class DeductibleInputTaxAmount extends Component{
    state={
        tableKey:Date.now(),
		filters: {},
		statusParam:{}
    }
    toggleViewModalVisible=visibleView=>{
        this.setState({
            visibleView
        })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/estate/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableKey,statusParam,filters} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
                <SearchTable
                    style={{
                        marginTop:-16
                    }}
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    tableOption={{
                        key:tableKey,
                        pageSize:10,
                        columns:columns(this),
                        url:'/account/income/estate/stayDedList',
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>待抵扣进项税额</span>,
                        },
                        onSuccess: (params) => {
                            this.setState({
                                filters: params
                            },()=>{
                                this.fetchResultStatus()
                            })
                        },
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    (disabled && declare.decAction==='edit') && composeBotton([
                                        {
                                            type: 'reset',
                                            url:'/account/income/estate/reset',
                                            params:filters,
                                            userPermissions:['1251009'],
                                            onSuccess:()=>{
                                                this.props.refreshTabs()
                                            },
                                        }
                                    ],statusParam)
                                }
                            </div>
                        ),
                        /*scroll:{
                         x:'180%'
                         },*/
                    }}
                >
                    {/* <ViewDocumentDetails
                        title="查看凭证详情"
                        visible={visibleView}
                        voucherNum={voucherNum}
                        toggleViewModalVisible={this.toggleViewModalVisible} /> */}
                </SearchTable>
        )
    }
}