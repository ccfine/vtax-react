/**
 * Created by liurunbin on 2018/1/2.
 * 备案资料
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PopModal from './PopModal.r'
import {composeBotton} from 'utils'
const searchFields = [
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'mainId',
    }
]

const getColumns = context => [
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>{
            return composeBotton([{
                type:'action',
                title:'编辑',
                icon:'edit',
                userPermissions:[],
                onSuccess:()=>{
                    context.setState({
                        modalConfig:{
                            type:'edit',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }
            }])
        },
        fixed:'left',
        width:'50px',
        className:'text-center'
    },
    {
    title: '纳税主体',
    dataIndex: 'mainName',
    render:(text,record)=><a title='查看详情' onClick={()=>context.setState({
        modalConfig:{
            type:'view',
            id:record.id
        }
    },()=>{
        context.toggleModalVisible(true)
    })}>{text}</a>
}, {
    title: '备案资料类型',
    dataIndex: 'recordType',
},{
    title: '备案日期',
    dataIndex: 'recordDate',
},{
    title: '备案资料名称',
    dataIndex: 'recordName',
},{
    title: '涉及税费种',
    dataIndex: 'taxFeeCategory',
},{
    title: '是否有附件',
    dataIndex: 'isAttachment',
    render:text=>parseInt(text,0) === 1 ?'有':'无'
}
];

export default class FilingMaterial extends Component{
    state={
        visible:false,
        modalConfig:{
            type:''
        },
        tableKey:Date.now(),
        hasData:false,
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type
            }
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
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
                    columns:getColumns(this),
                    url:'/sys/recordInfo/list',
                    key:tableKey,
                    extra:(
                        <div>{
                                composeBotton([{
                                    type:'add',
                                    icon:'plus',
                                    userPermissions:[],
                                    onClick:()=>this.showModal('add') 
                                }])
                            }
                        </div>
                    ),
                    cardProps:{
                        title:'备案资料',
                    },
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}