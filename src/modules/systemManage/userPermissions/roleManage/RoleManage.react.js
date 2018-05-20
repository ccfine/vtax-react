/**
 * author       : liuliyuan
 * createTime   : 2018/04/16
 * description  :
 */
import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Modal,Icon,Switch,message,Tooltip,Divider} from 'antd'
import {SearchTable} from 'compoments'
import {RolePopModal,UserPopModal,PermissionPopModal} from './popModal'
import {request,composeBotton} from 'utils'

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

                <span title="编辑" onClick={()=>context.showModal('edit',record)} style={pointerStyle}>
                    <Tooltip placement="top" title="编辑">
                           <Icon type="edit" />
                    </Tooltip>
                </span>
                <Divider type="vertical" />
                <span title="分配权限" onClick={()=>{
                    context.setState({
                        permissionId:record.id,
                        userId:undefined,
                    },()=>{
                        context.togglePermissionModalVisible(true)
                    })
                }} style={pointerStyle}>
                    <Tooltip placement="top" title="分配权限">
                        <Icon type="team" />
                    </Tooltip>
                </span>
                <span title="分配用户" onClick={()=>{
                    context.setState({
                        userId:record.id,
                    },()=>{
                        context.toggleUserModalVisible(true)
                    })
                }} style={pointerStyle}>
                    <Tooltip placement="top" title="分配用户">
                        <Icon type="setting" />
                    </Tooltip>
                </span>
                <Divider type="vertical" />
                <Switch size="small" checkedChildren="启" unCheckedChildren="停" checked={ parseInt(record.isEnabled,0) === 1 } onChange={(checked)=>context.handleChange(checked,record.id)} />
            </span>

        )
    },{
        title: '角色名称',
        dataIndex:'roleName',
        width:'15%',
        render:(text,record)=>(
            <Link title="详情" to={{
                pathname:`/web/systemManage/userPermissions/roleManage/${record.id}`,
                state:{
                    roleName:record.roleName,
                    isEnabled:record.isEnabled,
                    remark:record.remark
                }
            }} style={{marginRight:10}}>{text}</Link>
        )
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
        permissionId:undefined,
        userId:undefined,
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
        })
    }
    togglePermissionModalVisible=permissionVisible=>{
        this.setState({
            permissionVisible,
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
        const {updateKey,visible,userVisible,permissionVisible,modalConfig,permissionId,userId} = this.state;
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
                                {
                                    composeBotton([{
                                        type:'add',
                                        onClick:()=>this.showModal('add',{})
                                    }])
                                }
                            </div>,
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
                        id={permissionId}
                        refreshTable={this.refreshTable}
                        togglePermissionModalVisible={this.togglePermissionModalVisible}
                    />
                 <UserPopModal
                        visible={userVisible}
                        id={userId}
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


