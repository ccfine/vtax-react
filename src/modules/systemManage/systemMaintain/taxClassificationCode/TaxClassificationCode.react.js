/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:27
 * description  :
 */
import React, { Component } from 'react';
import {Button,Icon,Modal,message } from 'antd'
import {SearchTable} from '../../../../compoments';
import {request} from '../../../../utils'
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
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

        selectedRowKeys:null,
        selectedRows:null,
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
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }
    deleteData = () => {
        confirm({
            title: '友情提醒',
            content: '删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                request.delete(`/tax/classification/coding/delete/${this.state.selectedRowKeys}`)
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success('删除成功!');
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                this.toggleModalVisible(false)
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }
    render(){
        const {updateKey,selectedRowKeys,visible,modalConfig} = this.state;
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
                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                        this.setState({
                            selectedRowKeys:selectedRowKeys[0],
                            selectedRows,
                        })
                    },
                    rowSelection:{
                        type:'radio',
                    },
                    extra:<div>
                        <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                            <Icon type="plus" />
                            新增
                        </Button>
                        <Button size="small" onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                            <Icon type="edit" />
                            编辑
                        </Button>
                        <Button size="small" style={buttonStyle} onClick={this.deleteData} disabled={!selectedRowKeys} type='danger'>
                            <Icon type="delete" />
                            删除
                        </Button>
                    </div>
                }}
            >
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </SearchTable>
        )
    }
}