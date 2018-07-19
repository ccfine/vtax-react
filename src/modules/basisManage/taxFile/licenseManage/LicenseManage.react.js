/** 证照管理*/
/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from './popModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    margin:'0px 5px'
}

const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    }
]
const getColumns = context =>[
    {
        title: '纳税主体',
        dataIndex: 'mainName',
        render:(text,record)=>(<span title='查看详情' style={pointerStyle} onClick={()=>{
                context.setState({
                    projectId:record.id,
                },()=>{
                    context.toggleModalVisible(true)
                })
            }}>{text}</span>),
    }, {
        title: '项目代码',
        dataIndex: 'itemNum',
    },{
        title: '项目名称',
        dataIndex: 'itemName',
    }
];

export default class LicenseManage extends Component{
    state={
        visible:false,
        projectId:undefined
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    render(){
        const {visible,projectId} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/card/certificate/list',
                    cardProps:{
                        title:'证照管理',
                    },
                }}
            >
                <PopModal visible={visible} projectId={projectId} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}