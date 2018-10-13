/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'

const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'mainName',
        //width:'200px',
    }, {
        title: '项目分期名称',
        dataIndex: 'taxNum',
        width:'200px',
    },{
        title: '产品编码',
        dataIndex: 'finish1',
        width:'200px',
    },{
        title: '产品名称',
        dataIndex: 'finish2',
        width:'200px',
    },{
        title: '产品类型',
        dataIndex: 'finish3',
        width:'100px',
    },{
        title: '发票号码',
        dataIndex: 'finish4',
        width:'200px',
    },{
        title: '发票代码',
        dataIndex: 'finish5',
        width:'200px',
    },{
        title: '拆分前发票号码',
        dataIndex: 'finish6',
        width:'200px',
    },{
        title: '拆分前发票代码',
        dataIndex: 'finish7',
        width:'200px',
    },{
        title: '开票日期',
        dataIndex: 'finish8',
        width:'100px',
    },{
        title: '发票类型',
        dataIndex: 'finish9',
        width:'100px',
    },{
        title: '不含税金额',
        dataIndex: 'finish10',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'finish11',
        width:'100px',
    },{
        title: '进项税额',
        dataIndex: 'finish12',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'finish13',
        width:'100px',
    },{
        title: '拆分规则',
        dataIndex: 'finish14',
        width:'100px',
    },{
        title: '拆分比例',
        dataIndex: 'finish15',
        width:'100px',
    },{
        title: '已拆分金额',
        dataIndex: 'finish16',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '已拆分税额',
        dataIndex: 'finish17',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '认证状态',
        dataIndex: 'finish18',
        width:'100px',
    },{
        title: '认证日期',
        dataIndex: 'finish19',
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
        const {tableKey,filters,statusParam} = this.state;
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
                    url:'/dataCollection/list',
                    cardProps:{
                        title: <span><label className="tab-breadcrumb">固定资产进项发票台账 / </label>单独新建自持类进项发票</span>,
                    },
                    extra: (
                        <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/estate/fixed/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1251007'],
                                }],statusParam)
                            }
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
                        </div>
                    ),
                    scroll:{
                        x:3000,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}