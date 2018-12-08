/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus} from 'utils'

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
        title: '不动产名称',
        dataIndex: 'assetName',
        width:'200px',
    },{
        title: '不动产编号',
        dataIndex: 'assetNo',
        width:'200px',
    },{
        title: '进项税额',
        dataIndex: 'incomeTaxAmount',
        width:'200px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '不含税金额',
        dataIndex: 'withoutTax',
        width:'200px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '综合税率',
        dataIndex: 'taxRate',
        width:'200px',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    }
];

export default class Tab3 extends Component{
    state={
        visible:false,
        filters: {},
        statusParam: {},
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
        const {tableKey,filters, statusParam,totalSource} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare,
            handle = declare.decAction==='edit';
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
                    url:`/account/income/fixedAssets/buildRateList${handle ? '?handle=true' : ''}`,
                    cardProps:{
                        title: <span><label className="tab-breadcrumb">不动产进项发票台账 / </label>自建转自用综合税率</span>,
                    },
                    extra: (
                        <div>
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/fixedAssets/buildRateList/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1241007'],
                                }])
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type: 'reset',
                                    url:'/account/income/fixedAssets/reset',
                                    params:filters,
                                    userPermissions:['1241009'],
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
                                            {title: '进项税额', dataIndex: 'inTaxAmount'},
                                            {title: '不含税金额', dataIndex: 'withoutTax'},
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
                        x:1700,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}