/**
 * author       : liuliyuan
 * createTime   : 2018/04/16
 * description  :
 */
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Icon,Button,Switch,message,Modal} from 'antd'
import {SearchTable} from 'compoments'
import {RolePopModal,UserPopModal,PermissionPopModal} from './popModal'
import {request,} from 'utils'
const buttonStyle={
    marginRight:5
}
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    marginRight:10
}
const searchFields = context => [
    {
        label: "组织",
        fieldName: "orgId",
        type: "asyncSelect",
        span: 8,
        componentProps: {
            fieldTextName: "orgName",
            fieldValueName: "orgId",
            url: `/org/user_belong_organizations`
        },
        fieldDecoratorOptions: {
            initialValue: context.props.orgId || undefined,
            rules: [
                {
                    required: true,
                    message: "请选择组织"
                }
            ]
        }
    },{
        label: "角色名称",
        type: "input",
        span: 8,
        fieldName: "roleName"
    }
];
const columns = context => [
    {
        title: '操作',
        width:'10%',
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=>(
            <span>
                <Link title="详情" to={{
                    pathname:`/web/systemManage/userPermissions/roleManage/${record.id}`,
                    state:{
                        roleName:record.roleName,
                        isEnabled:record.isEnabled,
                        remark:record.remark
                    }
                }} style={{marginRight:10}}><Icon type="search" /></Link>
                <span title="编辑" onClick={()=>context.showModal('edit',record)} style={pointerStyle}>
                    <Icon type="edit" />
                </span>
                <Switch checkedChildren="启" unCheckedChildren="停" checked={ parseInt(record.isEnabled,0) === 1 } onChange={(checked)=>context.handleChange(checked,record.id)} />
            </span>

        )
    /*},{
        title: '状态',
        dataIndex:'isEnabled',
        className:'text-center',
        width:'10%',
        render:(text,record)=>{
            return (
                <Switch checkedChildren="启用" unCheckedChildren="停用" checked={ parseInt(text,0) === 1 } onChange={(checked)=>context.handleChange(checked,record.id)} />
            )
        }*/
    },{
        title: '角色名称',
        dataIndex:'roleName',
        width:'15%'
    },{
        title: '创建时间',
        dataIndex:'createdDate',
        width:'15%'
    },{
        title:'备注',
        dataIndex:'remark',
        width:'60%',
    }];


class RoleManage extends Component{
    state= {
        updateKey: Date.now(),
        selectedRowKeys: null,
        selectedRows: null,
        visible: false,
        userVisible: false,
        permissionVisible: false,
        modalConfig: {
            type: ''
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
    showModal=(type,record)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:record.id,
                record
            }
        })
    }
    toggleUserModalVisible=userVisible=>{
        this.setState({
            userVisible,
            selectedRowKeys:this.state.selectedRowKeys
        })
    }
    togglePermissionModalVisible=permissionVisible=>{
        this.setState({
            permissionVisible,
            selectedRowKeys:this.state.selectedRowKeys
        })
    }

    //选中多少条数据 - 禁用
    handleChange = (checked,id) => {
        /*const param = {
            isEnabled:checked === true ? '1' : '2',
        }*/
        const t = checked === true ? '启用' : '禁用'
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: `是否${t}？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`/sysRole/enableOrDisable/${id}`)
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success(`${t}成功！`, 4)
                            //新增成功，关闭当前窗口,刷新父级组件
                            this.refreshTable();
                        } else {
                            message.error(data.msg, 4)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }

    render(){
        const {updateKey,selectedRowKeys,visible,userVisible,permissionVisible,modalConfig} = this.state;
        return (
            <SearchTable
                searchOption={{
                    fields:this.props.orgId && searchFields(this)
                }}
                doNotFetchDidMount={false}
                tableOption={{
                    rowKey:'id',
                    key: updateKey,
                    pageSize: 10,
                    columns: columns(this),
                    url: '/sysRole/list',
                    cardProps: {
                        title: '角色列表',
                        extra:
                            <div>
                                <Button size="small" onClick={()=>this.showModal('add',{})} style={buttonStyle}>
                                    <Icon type="plus" />
                                    新增
                                </Button>
                                <Button size="small" disabled={!selectedRowKeys} onClick={()=>this.togglePermissionModalVisible(true)}  style={buttonStyle}>
                                    <Icon type="edit" />
                                    分配权限
                                </Button>
                                <Button size="small" disabled={!selectedRowKeys} onClick={()=>this.toggleUserModalVisible(true)} style={buttonStyle}>
                                    <Icon type="edit" />
                                    分配用户
                                </Button>
                            </div>,
                    },
                    rowSelection:{
                        type:'radio',
                    },
                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                        this.setState({
                            selectedRowKeys:selectedRowKeys[0],
                            selectedRows,
                        })
                    },
                    onSuccess:()=>{
                        this.setState({
                            selectedRowKeys:undefined,
                            selectedRows:[],
                        })
                    },
                }}
            >
                <RolePopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    id={modalConfig.id}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
                 <PermissionPopModal
                        visible={permissionVisible}
                        id={selectedRowKeys}
                        refreshTable={this.refreshTable}
                        togglePermissionModalVisible={this.togglePermissionModalVisible}
                    />
                 <UserPopModal
                        visible={userVisible}
                        id={selectedRowKeys}
                        refreshTable={this.refreshTable}
                        toggleUserModalVisible={this.toggleUserModalVisible}
                    />

            </SearchTable>

        )
    }
}
export default connect(state=>({
    orgId: state.user.get("orgId")
}))(RoleManage)


