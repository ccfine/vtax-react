/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
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
    },/*{
        title: '项目分期',
        dataIndex: 'stagesName',
    },*/{
        title: '期初',
        children:[{
            title: '金额',
            dataIndex: 'initialAmount',
            render: text => fMoney(text),
            className: "table-money"
        },{
            title: '税额',
            dataIndex: 'initialTaxAmount',
            render: text => fMoney(text),
            className: "table-money"
        }]
    },{
        title: '本期',
        children:[{
            title: '金额',
            dataIndex: 'currentAmount',
            render: text => fMoney(text),
            className: "table-money",
        },{
            title: '税额',
            dataIndex: 'currentTaxAmount',
            render: text => fMoney(text),
            className: "table-money"
        }]
    },{
        title: '累计',
        children:[{
            title: '金额',
            dataIndex: 'countAmount',
            render: text => fMoney(text),
            className: "table-money"
        },{
            title: '税额',
            dataIndex: 'countTaxAmount',
            render: text => fMoney(text),
            className: "table-money"
        }]
    },{
        title: '综合税率',
        dataIndex: 'taxRate',
        render: text => text&&`${text}%`
    },{
        title: '进项税额',
        dataIndex: 'incomeTaxAmount',
        render: text => fMoney(text),
        className: "table-money"
    },{
        title: '进项税转出额',
        dataIndex: 'incomeOutAmount',
        render: text => fMoney(text),
        className: "table-money"
    }
];

export default class SelfBuiltTransferFixedAssetsInputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherNum:undefined,
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    toggleViewModalVisible=visibleView=>{
        this.mounted && this.setState({
            visibleView
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/estate/listMain',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            tableKey:Date.now()
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tableKey,visibleView,voucherNum,filters,statusParam} = this.state;
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
                backCondition={(filters)=>{
                    this.mounted && this.setState({
                        filters,
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns(this),
                    url:'/account/income/estate/buildList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>自建转自用固定资产进项税额明细</span>,
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/estate/build/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1251007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([{
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
                        </div>,
                    },
                    /*scroll:{
                     x:'180%'
                     },*/
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visibleView}
                    voucherNum={voucherNum}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}