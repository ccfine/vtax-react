/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'

const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        //width:'200px',
    }, {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },{
        title: '产品编码',
        dataIndex: 'productNum',
        width:'200px',
    },{
        title: '产品名称',
        dataIndex: 'productName',
        width:'200px',
    },{
        title: '产品类型',
        dataIndex: 'productType',
        width:'100px',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'200px',
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'200px',
    },{
        title: '拆分前发票号码',
        dataIndex: 'splitInvoiceNum',
        width:'200px',
    },{
        title: '拆分前发票代码',
        dataIndex: 'splitInvoiceCode',
        width:'200px',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'100px',
    },{
        title: '发票类型',
        dataIndex: 'invoiceType',
        width:'100px',
        render: (text) => {
            // s-专票
            // c-普票
            let res = "";
            switch (text) {
                case "s":
                    res = "专票";
                    break;
                case "c":
                    res = "普票";
                    break;
                default:
                    break;
            }
            return res
        }
    },{
        title: '不含税金额',
        dataIndex: 'withoutTax',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'taxRate',
        width:'100px',
    },{
        title: '进项税额',
        dataIndex: 'inTaxAmount',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        width:'100px',
    },{
        title: '拆分规则',
        dataIndex: 'splitRule',
        width:'100px',
    },{
        title: '拆分比例',
        dataIndex: 'splitProportion',
        width:'100px',
    },{
        title: '已拆分金额',
        dataIndex: 'splitAmount',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '已拆分税额',
        dataIndex: 'splitTaxAmount',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '认证状态',
        dataIndex: 'authStatus',
        width:'100px',
        render: text => {
            // 0-无需认证
            // 1-认证成功
            // 2-认证失败
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "无需认证";
                    break;
                case 1:
                    res = "认证成功";
                    break;
                case 2:
                    res = "认证失败";
                    break;
                default:
                    break;
            }
            return res
        }
    },{
        title: '认证所属期',
        dataIndex: 'authMonth',
        width:'100px',
    }
];

export default class Tab1 extends Component{
    state={
        visible:false,
        filters: {},
        statusParam:{},
        modalConfig:{
            type:''
        },
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=(type,mainId)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                mainId
            }
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/fixedAssets/listMain',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tableKey,filters,statusParam,totalSource} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                style={{
                    marginTop:-16
                }}
                searchOption={{
                    fields:searchFields
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
                    columns:getColumns(this),
                    url:'/account/income/fixedAssets/incomeSeparateList',
                    cardProps:{
                        title: <span><label className="tab-breadcrumb">不动产进项发票台账 / </label>单独新建自持类进项发票</span>,
                    },
                    extra: (
                        <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {/* {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/estate/fixed/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1251007'],
                                }],statusParam)
                            } */}
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type: 'reset',
                                    url:'/account/income/fixedAssets/reset',
                                    params:filters,
                                    userPermissions:['1241009'],
                                    onSuccess:()=>{
                                        this.props.refreshTabs()
                                    },
                                },{
                                    type:'submit',
                                    url:'/account/income/fixedAssets/submit',
                                    params:filters,
                                    userPermissions:['1241010'],
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                },{
                                    type:'revoke',
                                    url:'/account/income/fixedAssets/revoke',
                                    params:filters,
                                    userPermissions:['1241011'],
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '已拆分税额', dataIndex: 'splitTaxAmount'},
                                            {title: '已拆分金额', dataIndex: 'splitAmount'},
                                            {title: '不含税金额', dataIndex: 'withoutTax'},
                                            {title: '进项税额', dataIndex: 'inTaxAmount'},
                                            {title: '价税合计', dataIndex: 'totalAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>
                    ),
                    onTotalSource: (totalSource) => {
                        this.mounted && this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:3000,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}