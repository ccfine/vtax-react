/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Form,Button,Icon,Modal,message} from 'antd';
import {TreeTable} from 'compoments'
import PopModal from './popModal'
import {request} from '../../../../utils'

const buttonStyle={
    marginRight:5
}
const searchFields = [
    {
        label:'应税项目名称',
        fieldName:'name',
        type:'input',
        span:6,
    }
]

const columns =[
    {
        title: '应税项目编号',
        dataIndex: 'num',
    },{
        title: '应税项目名称',
        dataIndex: 'name',
    },{
        title: '一般计税税率',
        dataIndex: 'commonlyTaxRate',
    },{
        title: '简易计税税率',
        dataIndex: 'simpleTaxRate',
    },{
        title: '填报说明',
        dataIndex: 'description',
    }
];
class TaxableItems extends Component {
    state = {
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        updateTable:Date.now(),
        updateTree:Date.now(),
        id:undefined,
        selectedRows:[],
        visible:false, // 控制Modal是否显示
        searchTableLoading:false,
        searchFieldsValues:{},
        modalConfig:{
            type:''
        },

    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTree = ()=>{
        this.setState({
            updateTree:Date.now(),
        })
    }
    refreshTable = ()=>{
        this.setState({
            updateTable:Date.now(),
        })
    }
    refreshAll = ()=>{
        this.setState({
            updateTree:Date.now(),
            updateTable:Date.now(),
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.id
            }
        })
    }
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/taxable/project/delete/${this.state.id}`)
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshAll();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    this.toggleSearchTableLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    render() {
        const {updateTable,updateTree,searchTableLoading,visible,modalConfig,id,filters} = this.state;
        return (
            <TreeTable
                spinning={searchTableLoading}
                refreshTree={this.refreshTree}
                searchOption={{
                    fields:searchFields,
                    filters:filters,
                    getFieldsValues:values=>{
                        this.setState({
                            searchFieldsValues:values
                        })
                    },
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                cardTableOption={{
                    extra:<div>
                        <Button size="small" disabled={!id} style={buttonStyle} onClick={()=>this.showModal('add')} >
                            <Icon type="plus" />
                            新增
                        </Button>
                        <Button size="small" disabled={!id} style={buttonStyle} onClick={()=>this.showModal('edit')}>
                            <Icon type="edit" />
                            编辑
                        </Button>
                        <Button size="small" style={buttonStyle} disabled={!id} type='danger' onClick={this.deleteData}>
                            <Icon type="delete" />
                            删除
                        </Button>
                    </div>
                }}
                treeCardOption={{
                    cardProps:{
                        title:'应税项目树',
                    }
                }}
                treeOption={{
                    key:updateTree,
                    showLine:false,
                    url:"/taxable/project/tree",
                    onSuccess:(selectedKeys,selectedNodes)=>{
                        this.setState({
                            id:selectedNodes.id,
                            filters:{
                                id:selectedNodes.id
                            }
                        },()=>{
                            this.refreshTable()
                        })
                    }
                }}
                tableOption={{
                    key:updateTable,
                    pageSize:10,
                    columns:columns,
                    cardProps:{
                        title:'下级列表信息'
                    },
                    url:'/taxable/project/list',
                    clearSelectedRowAfterFetch:false,
                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                        this.setState({
                            id:selectedRowKeys[0],
                            selectedRows,
                        })
                    },
                    rowSelection:{
                        type:'radio',
                    },
                }}
            >
                <PopModal refreshAll={this.refreshAll} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </TreeTable>
        )
    }
}
export default Form.create()(TaxableItems)