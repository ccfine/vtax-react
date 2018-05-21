/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {Icon} from 'antd'
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
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <span>
                <span title='编辑' onClick={()=>context.showModal('modify',record.id)} style={pointerStyle}><Icon type="edit" /></span>
            </span>
        ),
        fixed:'left',
        width:'50px',
        className:'text-center'
    },{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        render:(text,record)=>(
            <span style={pointerStyle} onClick={()=>context.showModal('look',record.id)}>{text}</span>
        ),
    }, {
        title: '统一社会信用代码或纳税人识别号',
        dataIndex: 'itemNum',
    },{
        title: '是否已处理',
        dataIndex: 'itemName',
    }
];

export default class BeginDataCollect extends Component{
    state={
        visible:false,
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
    showModal=(type,param)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type,
                mainId:param
            }
        })
    }
    render(){
        const {visible,modalConfig} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/card/certificate/list',
                    scroll:{x:'100%'},
                }}
            >
                <PopModal visible={visible} refreshTable={this.refreshTable} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}