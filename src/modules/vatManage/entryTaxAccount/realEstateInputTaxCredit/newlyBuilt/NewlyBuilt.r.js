/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {requestResultStatus,fMoney,listMainResultStatus,composeBotton} from 'utils'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'

const columns = context =>[{
        title: '利润中心',
        dataIndex: 'profitCenterName',
        //width:'200px',
    },{
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'200px',
    },{
        title:'产品编码',
        dataIndex:'productNum',
        width:'200px',
    },{
        title:'产品名称',
        dataIndex:'productName',
        width:'200px',
    },{
        title: "产品类型",
        dataIndex: "productType",
        width:'200px',
    },{
        title:'发票号码',
        dataIndex:'invoiceNum',
        width:'200px',
    },{
        title:'认证所属期',
        dataIndex:'authDate',
        width:'200px',
    }, {
        title: "不含税金额",
        dataIndex: "withoutTax",
        width:'200px',
    }, {
        title: "税率",
        dataIndex: "taxRate",
        width:'200px',
    }, {
        title: "进项税额",
        dataIndex: "inTaxAmount",
        width:'100px',
    }, {
        title: "价税合计",
        dataIndex: "totalAmount",
        width:'100px',
    }, {
        title: "拆分规则",
        dataIndex: "splitRule",
        width:'150px',
    },{
        title: "拆分比例",
        dataIndex: "splitProportion",
        width:'100px',
    },{
        title: "已拆分金额",
        dataIndex: "splitAmount",
        width:'100px',
    },{
        title: "已拆分税额",
        dataIndex: "splitTaxAmount",
        width:'100px',
    },{
        title: "期初待抵扣进项税额",
        dataIndex: "initialTaxAmount",
        width:'200px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "当期抵扣进项税额",
        dataIndex: "taxAmount",
        width:'200px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "期末待抵扣进项税额",
        dataIndex: "deductedTaxAmount",
        width:'200px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod",
        width:'100px',
    },
];

export default class NewlyBuilt extends Component{
    state={
        tableKey:Date.now(),
        visibleView:false,
        voucherNum:undefined,
        filters:{},
        totalSource:undefined,
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
        const {tableKey,visibleView,voucherNum,filters,statusParam,totalSource} = this.state;
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
                    url:'/account/income/estate/aloneBuildList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>单独新建固定资产进项税额抵扣</span>,
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {/* {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/estate/build/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1251007'],
                                }],statusParam)
                            } */}
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
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '当期抵扣的进项税额', dataIndex: 'taxAmount'},
                                            {title: '期末待抵扣进项税额', dataIndex: 'deductedTaxAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>,
                    },
                    onTotalSource: (totalSource) => {
                        this.mounted && this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:3100,
                        y:window.screen.availHeight-430,
                    },
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