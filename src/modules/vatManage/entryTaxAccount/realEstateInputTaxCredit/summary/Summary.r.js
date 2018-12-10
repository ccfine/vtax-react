/*
 * @Author: zhouzhe 
 * @Date: 2018-10-26 15:15:16 
 * @Description: '不动产进项税额抵扣汇总-标签页' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 15:30:20
 */

import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus} from 'utils'

const columns = context =>[{
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },{
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'200px',
    },{
        title:'不动产编码',
        dataIndex:'assetNo',
        width:'200px',
    },{
        title:'不动产名称',
        dataIndex:'assetName',
        width:'200px',
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

export default class SelfBuiltToSelfUse extends Component{
    state={
        tableKey:Date.now(),
        filters: {},
        statusParam:{},
        totalSource:undefined,
    }
    toggleViewModalVisible=visibleView=>{
        this.mounted && this.setState({
            visibleView
        })
    }

    refreshTable = ()=>{
        this.mounted && this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('',this.state.filters,result=>{
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
        let disabled = !!declare,
            handle = declare && declare.decAction==='edit';
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
                        url:`/account/income/estate/collectList${handle ? '?handle=true' : ''}`,
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>不动产进项税额抵扣汇总</span>,
                        },
                        extra: (
                            <div>
                                {
                                    JSON.stringify(filters) !=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'account/income/estate/collectList/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1251007'],
                                    }])
                                }
                                {
                                    (disabled && declare.decAction==='edit') &&  composeBotton([{
                                        type: 'reset',
                                        url:'/account/income/estate/reset',
                                        params:filters,
                                        userPermissions:['1251009'],
                                        onSuccess:()=>{
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
                                                {title: '期末待抵扣进项税额', dataIndex: 'deductedTaxAmount'},
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
                            x:1250,
                            y:window.screen.availHeight-430,
                        },
                    }}
                />
        )
    }
}