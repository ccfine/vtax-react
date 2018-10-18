/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'
const columns = (context,isEdit) =>[{
        title: '利润中心',
        dataIndex: 'profitCenterName',
        //width:'200px',
    },{
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'200px',
    },{
        title:'固定资产名称',
        dataIndex:'assetName',
        width:'200px',
    },{
        title:'固定资产编号',
        dataIndex:'assetNo',
        width:'200px',
    },{
        title: "入账日期",
        dataIndex: "accountDate",
        width:'200px',
    },{
        title:'取得方式',
        dataIndex:'acquisitionMode',
        width:'200px',
        render: (text) => {
            // 0-外部获取
            // 1-单独新建
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
                    break;
                case 1:
                    res = "单独新建";
                    break;
                case 2:
                    res = "自建转自用";
                    break;
                default:
                    break;
            }
            return res;
        },
    },{
        title:'取得价值',
        dataIndex:'gainValue',
        width:'200px',
    },
    {
        title: "资产类别",
        dataIndex: "assetType",
        width:'200px',
    },
    {
        title: "资产状态",
        dataIndex: "assetsState",
        width:'200px',
    },
    {
        title: "占地面积",
        dataIndex: "areaCovered",
        width:'100px',
    },
    {
        title: "税率",
        dataIndex: "intaxRate",
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "inTax",
        render:(text)=>fMoney(text),
        className: "table-money",
        width:'150px',
    },{
        title: "期初待抵扣进项税额",
        dataIndex: "initialTaxAmount",
        width:'100px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "当期抵扣进项税额",
        dataIndex: "taxAmount",
        width:'150px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "期末待抵扣进项税额",
        dataIndex: "deductedTaxAmount",
        width:'100px',
        render:(text)=>fMoney(text),
        className: "table-money",
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod",
        width:'100px',
    },
];
export default class ExternalAccess extends Component{
    state={
        tableKey:Date.now(),
        filters: {},
        statusParam:{},
        dataSource:[],
        totalSource:undefined,
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/estate/listMain',this.state.filters,result=>{
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
        const {tableKey,statusParam,filters,totalSource} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
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
                        columns:columns(this,disabled && declare.decAction==='edit' && parseInt(statusParam.status,10)===1),
                        url:'/account/income/estate/externalList',
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>外部获取固定资产进项税额抵扣</span>,
                        },
                        // onSuccess: (params,dataSource) => {
                        //     this.setState({
                        //         filters: params,
                        //         dataSource
                        //     },()=>{
                        //         this.fetchResultStatus()
                        //     })
                        // },
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
                                        type:'submit',
                                        url:'/account/income/estate/submit',
                                        params:filters,
                                        userPermissions:['1251010'],
                                        onSuccess:()=>{
                                            //this.refreshTable();
                                            this.props.refreshTabs()
                                        },
                                    },{
                                        type: 'reset',
                                        url:'/account/income/estate/reset',
                                        params:filters,
                                        userPermissions:['1251009'],
                                        onSuccess:()=>{
                                            this.props.refreshTabs()
                                        },
                                    },{
                                        type:'revoke',
                                        url:'/account/income/estate/revoke',
                                        params:filters,
                                        userPermissions:['1251011'],
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
                                                {title: '当期抵扣的进项税额', dataIndex: 'taxAmount'},
                                                {title: '待抵扣的进项税额', dataIndex: 'deductedTaxAmount'},
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
                        onDataChange: (dataSource) => {
                            this.mounted && this.setState({
                                dataSource
                            })
                        },
                        scroll:{
                            x:2700,
                            y:window.screen.availHeight-430,
                        },
                    }}
                />
            </div>
        )
    }
}