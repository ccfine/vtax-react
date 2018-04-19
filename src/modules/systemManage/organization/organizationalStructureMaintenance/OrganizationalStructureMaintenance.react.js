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
        label:'组织机构名称',
        fieldName:'name',
        type:'input',
        span:8,
    }
]

const columns =[
    {
        title: '机构代码',
        dataIndex: 'orgCode',
    },{
        title: '机构名称',
        dataIndex: 'orgName',
    },{
        title: '机构简称',
        dataIndex: 'orgShortName',
    },{
        title: '机构所在地',
        dataIndex: 'location',
    },{
        title: '经营地址',
        dataIndex: 'address',
    },{
        title: '本级序号',
        dataIndex: 'description1',
    }, {
        title: '状态',
        dataIndex: 'isEnabled',
        render: text => {
            //1:可用 2:禁用 3:删除,4:暂存 ,
            //0:删除;1:保存;2:提交; ,
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color:'#b7eb8f'}}>可用</span>;
                    break;
                case 2:
                    t=<span style={{color: "red"}}>禁用</span>;
                    break;
                case 3:
                    t=<span style={{color: "#f50"}}>删除</span>;
                    break;
                case 4:
                    t=<span style={{color: "#91d5ff"}}>暂存</span>;
                    break;
                default:
                //no default
            }
            return t
        }
    }
];

class OrganizationalStructureMaintenance extends Component {
    state = {
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        updateTable:Date.now(),
        updateTree:Date.now(),
        id:undefined,
        selectedRows:[],
        selectedNodes:undefined,
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
        if(type === 'add'){
            if(typeof (this.state.selectedNodes) === 'undefined'){
                return message.warning('请选择组织架构维护树');
            }
        }
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
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/org/delete/${this.state.id}`)
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
    disabledData=()=>{
        this.toggleSearchTableLoading(true)
        request.put(`/org/enableOrDisable/${this.state.id}`)
            .then(({data})=>{
                if(data.code===200){
                    this.toggleSearchTableLoading(false)
                    message.success('启用/禁用成功!');
                    this.toggleModalVisible(false);
                    this.refreshTable()
                }else{
                    message.error(`启用/禁用失败:${data.msg}`)
                }
            })
    }
    render() {
        const {updateTable,updateTree,searchTableLoading,visible,modalConfig,id,selectedNodes,filters} = this.state;
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
                        <Button size="small" style={buttonStyle} disabled={!id} type='danger' onClick={this.disabledData}>
                            <Icon type="delete" />
                            禁用/启用
                        </Button>
                    </div>
                }}
                treeCardOption={{
                    cardProps:{
                        title:'组织架构维护树',
                    }
                }}
                treeOption={{
                    key:updateTree,
                    showLine:false,
                    url:"/org/tree",
                    //isLoadDate:false,
                    onSuccess:(selectedKeys,selectedNodes)=>{
                        this.setState({
                            selectedNodes,
                            id:selectedKeys[0],
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
                        title:'组织架构维护列表信息'
                    },
                    url:'/org/list',
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
                <PopModal refreshAll={this.refreshAll} visible={visible} modalConfig={modalConfig} selectedNodes={selectedNodes} toggleModalVisible={this.toggleModalVisible} />
            </TreeTable>
        )
    }
}
export default Form.create()(OrganizationalStructureMaintenance)