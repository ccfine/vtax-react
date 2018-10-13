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
        title: '进项税额',
        dataIndex: 'finish3',
        width:'200px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '不含税金额',
        dataIndex: 'finish4',
        width:'200px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '综合税率',
        dataIndex: 'finish5',
        width:'200px',
    }
];

export default class Tab3 extends Component{
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
                        title: <span><label className="tab-breadcrumb">固定资产进项发票台账 / </label>自建转自用综合税率</span>,
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
                        x:1700,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}