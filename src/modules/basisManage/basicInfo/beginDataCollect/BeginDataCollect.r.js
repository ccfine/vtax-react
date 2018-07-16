/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from './popModal'
import {composeBotton} from 'utils';
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
        render:(text,record)=>composeBotton([{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:['1121004'],
            onSuccess:()=>context.showModal('modify',record.mainId)
        }]),
        fixed:'left',
        width:'50px',
        className:'text-center'
    },{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        render:(text,record)=>(<span title='查看详情' style={pointerStyle} onClick={()=>context.showModal('look',record.mainId)}>{text}</span>),
    }, {
        title: '统一社会信用代码或纳税人识别号',
        dataIndex: 'taxNum',
    },{
        title: '是否已采集',
        dataIndex: 'finish',
        render:text=>{
            //是否处理1:已采集 0:未采集 ,
            let t = '';
            switch (parseInt(text,0)){
                case 0:
                    t=<span style={{ color: '#44b973' }}>未采集</span>;
                    break;
                case 1:
                    t=<span style={{ color: '#1795f6' }}>已采集</span>;
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
        const {visible,modalConfig,tableKey} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/dataCollection/list', 
                    cardProps:{
                        title:'期初数据采集',
                    },
                }}
            >
                <PopModal visible={visible} refreshTable={this.refreshTable} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}