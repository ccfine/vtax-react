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
                <span title='编辑' onClick={()=>context.showModal('modify',record.mainId)} style={pointerStyle}><Icon type="edit" /></span>
            </span>
        ),
        fixed:'left',
        width:'50px',
        className:'text-center'
    },{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        render:(text,record)=>(
            <span style={pointerStyle} onClick={()=>context.showModal('look',record.mainId)}>{text}</span>
        ),
    }, {
        title: '统一社会信用代码或纳税人识别号',
        dataIndex: 'itemNum',
    },{
        title: '是否已处理',
        dataIndex: 'finish',
        render:text=>{
            //是否处理1:处理，0:未处理 ,
            let t = '';
            switch (parseInt(text,0)){
                case 0:
                    t=<span style={{ color: '#44b973' }}>未处理</span>;
                    break;
                case 1:
                    t=<span style={{ color: '#1795f6' }}>处理</span>;
                    break;
                default:
                //no default
            }
            return t
        }
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
        const {visible,modalConfig} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/dataCollection/list',
                    scroll:{x:'100%'},
                }}
            >
                <PopModal visible={visible} refreshTable={this.refreshTable} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}