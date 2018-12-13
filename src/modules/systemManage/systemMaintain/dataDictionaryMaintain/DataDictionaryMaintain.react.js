/**
 * author       : liuliyuan
 * createTime   : 2018/4/20
 * description  :
 */
import React, { Component } from 'react'
import { compose } from 'redux';
import {connect} from 'react-redux'
import {Form,Modal,message} from 'antd';
import {TreeTable} from 'compoments'
import PopModal from './popModal'
import {request,composeBotton} from 'utils'

const searchFields = [
    {
        label:'名称',
        fieldName:'name',
        type:'input',
        span:8,
    }
]

const columns =[
    {
        title: '编码',
        dataIndex: 'code',
        width:'12%',
    },{
        title: '名称',
        dataIndex: 'name',
        width:'18%',
    },{
        title: '类型',
        dataIndex: 'type',
        width:'12%',
    },{
        title: '排序',
        dataIndex: 'sortBy',
        width:'6%',
    },{
        title: '描述',
        dataIndex: 'description',
    }
];
class DataDictionaryMaintain extends Component {
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
            type:'',
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
            //id:undefined,
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
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/sys/dict/delete/${this.state.id}`)
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
                        cardProps:{
                            title:'数据字典维护',
                        },
                        extra:<div>
                            {
                                id && composeBotton([{
                                    type: 'add',
                                    icon:'plus',
                                    userPermissions: [],
                                    onClick: () => {
                                        this.showModal('add')
                                    }
                                },{
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
                                    btnType:'danger',
                                    text:'删除',
                                    onClick:()=>{
                                        this.deleteData()
                                    }
                                }])
                            }
                        </div>
                    }}
                    treeCardOption={{
                        cardProps:{
                            title:'字典信息树',
                            bodyStyle:{overflow:'auto',height:window.screen.availHeight-320},
                        }
                    }}
                    treeOption={{
                        key:updateTree,
                        showLine:false,
                        url:"/sys/dict/tree",
                        onSuccess:(selectedKeys,selectedNodes)=>{
                            this.setState({
                                id:selectedNodes.id,
                                filters:{
                                    id:selectedNodes.id
                                }
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
                            title:'下级列表信息'
                        },
                        scroll:{x:1000,y:window.screen.availHeight-490},
                        url:'/sys/dict/list',
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                id:selectedRowKeys[0],
                                selectedRows,
                            })
                        },
                        rowSelection:{
                            type:'radio',
                        }
                    }}
                >
                    <PopModal refreshAll={this.refreshAll} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
                </TreeTable>
        )
    }
}
const enhance = compose(
    Form.create(),
    connect( (state) => ({
        declare:state.user.get('declare')
    }))
);
export default enhance(DataDictionaryMaintain);
