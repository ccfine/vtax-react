/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Form,Modal,message} from 'antd';
import {TreeTable} from 'compoments'
import PopModal from './popModal'
import {request,composeBotton} from 'utils'

const searchFields = [
    {
        label:'组织机构代码',
        fieldName:'code',
        type:'input',
        span:8,
    },{
        label:'组织机构名称',
        fieldName:'name',
        type:'input',
        span:8,
    }
]

const columns =[
    {
        title: '机构代码',
        dataIndex: 'code',
        width:'20%',
    },{
        title: '机构名称',
        dataIndex: 'name',
    },{
        title: '本级序号',
        dataIndex: 'level',
        width:'10%',
    }, {
        title: '状态',
        dataIndex: 'status',
        render: text => {
            //1:可用2:禁用3:删除
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color:'#b7eb8f'}}>可用</span>;
                    break;
                case 2:
                    t=<span style={{color: '#f5222d'}}>禁用</span>;
                    break;
                case 3:
                    t=<span style={{color: "#f50"}}>删除</span>;
                    break;
                default:
                //no default
            }
            return t
        },
        width:'20%',
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
        // selectedRows:[],
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
            // id:undefined,
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
        if(parseInt(this.state.selectedNodes && this.state.selectedNodes.status, 0) !== 2){
            message.error('请禁用后，再删除');
            return;
        }
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/sysOrganization/delete/${this.state.id}`)
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshAll();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                        message.error(err.message)
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
        request.put(`/sysOrganization/enableOrDisable/${this.state.id}`)
            .then(({data})=>{
                if(data.code===200){
                    this.toggleSearchTableLoading(false)
                    message.success('启用/禁用成功!');
                    this.toggleModalVisible(false);
                    this.refreshTable()
                }else{
                    message.error(`启用/禁用失败:${data.msg}`)
                    this.toggleSearchTableLoading(false)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleSearchTableLoading(false)
            })
    }
    render() {
        const {updateTable,updateTree,searchTableLoading,visible,modalConfig,id,onlyAdd,selectedNodes,filters} = this.state;
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
                        rowCol:[8,16],
                        cardProps:{
                            title:'组织架构维护',
                        },
                        extra:<div>
                            {
                                id && composeBotton([{
                                    type: 'add',
                                    icon:'plus',
                                    onClick: () => {
                                        this.showModal('add')
                                    }
                                }])
                            }
                            {
                                id && !onlyAdd && composeBotton([{
                                    type:'edit',
                                    icon:'edit',
                                    text:'编辑',
                                    btnType:'default',
                                    onClick:()=>{
                                        this.showModal('edit')
                                    }
                                },{
                                    type:'delete',
                                    icon:'delete',
                                    text:'删除',
                                    btnType:'danger',
                                    onClick:()=>{
                                        this.deleteData()
                                    }
                                },{
                                    type:'retweet',
                                    icon:'retweet',
                                    text:'禁用/启用',
                                    btnType:'default',
                                    onClick:()=>{
                                        this.disabledData()
                                    }
                                }])
                            }
                        </div>
                    }}
                    treeCardOption={{
                        cardProps:{
                            title:'组织架构维护树',
                            bodyStyle:{overflow:'auto',height:window.screen.availHeight-310},
                        }
                    }}
                    treeOption={{
                        key:updateTree,
                        showLine:false,
                        isShowCode:true,
                        url:"/sysOrganization/tree",
                        onSuccess:(selectedKeys,selectedNodes)=>{
                            this.setState({
                                id:selectedNodes.id,
                                filters:{
                                    id:selectedNodes.id
                                },
                                selectedNodes:selectedNodes,
                                onlyAdd:true,
                            },()=>{
                                this.refreshTable()
                            })
                        },
                    }}
                    tableOption={{
                        key:updateTable,
                        pageSize:100,
                        columns:columns,
                        cardProps:{
                            title:'组织架构维护列表信息'
                        },
                        scroll:{x:600,y:window.screen.availHeight-390},
                        url:'/sysOrganization/list',
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                id:selectedRowKeys[0],
                                selectedNodes:selectedRows[0],
                                onlyAdd:false,
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