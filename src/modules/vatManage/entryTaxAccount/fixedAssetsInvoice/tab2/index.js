/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,composeBotton} from 'utils';

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
        title: '固定资产名称',
        dataIndex: 'finish1',
        width:'200px',
    },{
        title: '固定资产编号',
        dataIndex: 'finish2',
        width:'200px',
    },{
        title: '入账日期',
        dataIndex: 'finish3',
        width:'100px',
    },{
        title: '取得方式',
        dataIndex: 'finish4',
        width:'100px',
    },{
        title: '取得价值',
        dataIndex: 'finish5',
        width:'100px',
    },{
        title: '资产类别',
        dataIndex: 'finish6',
        width:'100px',
    },{
        title: '资产状态',
        dataIndex: 'finish7',
        width:'100px',
    },{
        title: '建筑面积',
        dataIndex: 'finish8',
        width:'100px',
    },{
        title: '税率',
        dataIndex: 'finish9',
        width:'100px',
    },{
        title: '税额',
        dataIndex: 'finish10',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '发票号码/发票代码',
        dataIndex: 'finish11',
        width:'200px',
    },{
        title: '开票日期',
        dataIndex: 'finish12',
        width:'100px',
    },{
        title: '发票类型',
        dataIndex: 'finish13',
        width:'100px',
    },{
        title: '不含税金额',
        dataIndex: 'finish14',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'finish15',
        width:'100px',
    },{
        title: '进项税额',
        dataIndex: 'finish16',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    }
];

export default class Tab2 extends Component{
    state={
        visible:false,
        filters: {},
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
    render(){
        const {tableKey,filters} = this.state;
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
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/dataCollection/list',
                    cardProps:{
                        title: <span><label className="tab-breadcrumb">固定资产进项发票台账 / </label>自建转自用自持类进项发票</span>,
                    },
                    extra: (
                        <div>
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type: 'reset',
                                    url:'/account/income/estate/reset',
                                    params:filters,
                                    userPermissions:['1251009'],
                                    onSuccess:()=>{
                                        this.props.refreshTabs()
                                    },
                                }])
                            }
                        </div>
                    ),
                    scroll:{
                        x:2500,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}