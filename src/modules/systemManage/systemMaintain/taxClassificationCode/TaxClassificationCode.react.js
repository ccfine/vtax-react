/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {Icon,Modal,message,Tooltip } from 'antd'
import {SearchTable} from 'compoments';
import {request,composeBotton} from 'utils'
import PopModal from './popModal'
const confirm = Modal.confirm;

const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    marginRight:10
}
const searchFields = [
    {
        label:'税收分类编码',
        fieldName:'num',
        type:'input',
        span:8,
        componentProps:{
        },
        fieldDecoratorOptions:{
        },
    },{
        label:'商品名称',
        fieldName:'commodityName',
        type:'input',
        span:8,
        componentProps:{
        },
        fieldDecoratorOptions:{
        },
    },{
        label:'税率',
        fieldName:'taxRate',
        type:'input',
        span:8,
        componentProps:{
        },
        fieldDecoratorOptions:{
        },

    }
]
const getColumns =(context)=>[
    {
        title: '操作',
        width:'10%',
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=>(
            <span>
                <span title="编辑" onClick={()=>{
                    context.setState({
                        modalConfig:{
                            type:'edit',
                            id:record.id,
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }} style={pointerStyle}>
                    <Tooltip placement="top" title="编辑">
                           <Icon type="edit" />
                    </Tooltip>
                </span>
                <span title="删除" onClick={()=>{ context.deleteData(record.id) }} style={pointerStyle}>
                    a
                </span>
            </span>

        )
    },{
        title: '税收分类编码',
        dataIndex: 'num',
    }, {
        title: '商品名称',
        dataIndex: 'commodityName',
    },{
        title: '应税项目',
        dataIndex: 'taxableProjectName',
    },{
        title: '一般增值税税率',
        dataIndex: 'commonlyTaxRate',
    },{
        title: '简易增值税税率',
        dataIndex: 'simpleTaxRate',
    }
];

export default class TaxClassificationCode extends Component{
    state={
        updateKey:Date.now(),
        visible:false,
        modalConfig:{
            type:''
        },
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    deleteData = (id) => {
        confirm({
            title: '友情提醒',
            content: '删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                this.toggleModalVisible(false)
                request.delete(`/tax/classification/coding/delete/${id}`)
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success('删除成功!');
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }
    render(){
        const {updateKey,visible,modalConfig} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:10,
                    url:'/tax/classification/coding/list',
                    cardProps:{
                        title:'税收分类编码列表信息'
                    },
                    columns:getColumns(this),
                    extra:<div>
                        {
                            composeBotton([{
                                type:'add',
                                onClick:()=>{
                                    this.setState({
                                        modalConfig:{
                                            type:'add',
                                            id:undefined,
                                        }
                                    },()=>{
                                        this.toggleModalVisible(true)
                                    })
                                }
                            }])
                        }
                    </div>
                }}
            >
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </SearchTable>
        )
    }
}
