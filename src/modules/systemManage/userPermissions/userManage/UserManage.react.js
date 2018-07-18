/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-16 14:07:17 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-10 16:12:27
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import { Divider, Modal, message } from "antd";
import { request,composeBotton,getUrlParam } from "utils";
import { SearchTable } from "compoments";
import PopModal, { RoleModal, PermissionModal,SimplePermissionModal } from "./popModal";
const pointerStyleDelete = {
    cursor:'pointer',
    color:'red',
    marginRight:10
}
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        if(typeof data[key] !== 'undefined'){
            str += `${key}=${data[key]}&`
        }
    }
    return str;
}
const getSearchFields = context => [
    {
        label: "组织",
        fieldName: "orgId",
        type: "asyncSelect",
        span: 8,
        componentProps: {
            fieldTextName: "name",
            fieldValueName: "id",
            url: `/sysOrganization/getOrganizations`,
            selectOptions:{
                showSearch:true,
                // filterOption:false,
                optionFilterProp:'children',
            },
        },
        fieldDecoratorOptions: {
            initialValue:  getUrlParam('orgId')==='' ? '' : getUrlParam('orgId') || context.props.orgId
        }
    },
    {
        label: "用户名",
        type: "input",
        span: 8,
        fieldName: "username",
        fieldDecoratorOptions: {
            initialValue: getUrlParam('username') || undefined,
        }
    },
    {
        label: "姓名",
        type: "input",
        span: 8,
        fieldName: "realname",
        fieldDecoratorOptions: {
            initialValue: getUrlParam('realname') || undefined,
        }
    }
];
const getColumns = context => [
    {
        title: "操作",
        dataIndex: "action",
        className: "text-center",
        render: (text, record) => {
            let notAdmin = parseInt(record.type,10) !== 8192;
            return (
                <span>
                    {
                        composeBotton([{
                            type: 'action',
                            icon: 'edit',
                            title: '编辑',
                            onSuccess: () => {
                                context.setState({createUserLoading:true,createUserVisible:true})
                                context.fetchUser(`/sysUser/find/${record.id}`).then(data => {
                                    data &&
                                    context.setState({
                                        createUserVisible: true,
                                        createModalType: "edit",
                                        createUserDefault: data,
                                        createUserKey: Date.now()
                                    });

                                    context.setState({createUserLoading:false})
                                });
                            }
                        }])
                    }
                    {
                        notAdmin && composeBotton([{
                            type:'action',
                            icon:'delete',
                            title:'删除',
                            style:pointerStyleDelete,
                            onSuccess:()=>{ context.handleDelete(record.id,record.isEnabled) }
                        }])
                    }
                    {notAdmin && <Divider type="vertical" />}
                    {
                        notAdmin && composeBotton([{
                            type: 'action',
                            icon: 'team',
                            title: '角色分配',
                            onSuccess: () => {
                                context.setState({roleModalKey: Date.now(),roleModalVisible:true,roleAssignUserId:record.id})
                            }
                        },{
                            type: 'action',
                            icon: 'setting',
                            title: '权限配置',
                            onSuccess: () => {
                                context.setState({simplePermissionVisible:true,simplePermissionKey: Date.now(),permissionUserId: record.id})
                            }
                        }])
                    }
                    {
                        parseInt(record.locked, 10)===1 && composeBotton([{
                            type: 'action',
                            icon: 'lock',
                            title: '解锁',
                            onSuccess: () => {
                                context.handleUnlock(record.id)
                            }
                        }])
                    }
                    {
                        notAdmin ? composeBotton([{
                            type: 'action',
                            icon: 'user-add',
                            title: '添加为管理员',
                            onSuccess: () => {
                                context.handleAdmin(record.id,false)
                            }
                        }]): composeBotton([{
                            type: 'action',
                            icon: 'user-delete',
                            title: '从管理员中移除',
                            onSuccess: () => {
                                context.handleAdmin(record.id,true)
                            }
                        }])
                    }
                    {notAdmin && <Divider type="vertical" />}
                    {
                        notAdmin && composeBotton([{
                            type:'switch',
                            checked: parseInt(record.isEnabled, 10) === 1,
                            onSuccess:(checked)=>{
                                context.handleChange(checked,record.id)
                            }
                        }])
                    }
                </span>
            );
        },
        width: 220
    },
    {
        title: "用户名",
        dataIndex: "username",
        render:(text,record)=>{
            return (
                <Link
                    title="查看详情"
                    to={{
                        pathname: `/web/systemManage/userPermissions/userManage/${record.id}`,
                        search:parseJsonToParams(context.state.searchValues),
                    }}
                >
                    {text}
                </Link>
            )
        },
        width:'10%',
    },
    {
        title: "姓名",
        dataIndex: "realname",
        width:'8%',
    },
    {
        title: "手机",
        dataIndex: "phoneNumber",
        width:'10%',
    },
    {
        title: "邮箱",
        dataIndex: "email",
        width:'14%',
    },
    {
        title: "角色",
        dataIndex: "roleNames",
    }
];

class UserManage extends Component {
    state = {
        updateKey: Date.now(),

        createUserKey: Date.now() + 1,
        createUserVisible: false,
        createModalType: "create",
        createUserDefault: undefined,
        createUserLoading:false,

        roleModalVisible: false,
        roleModalKey: Date.now() + 2,
        //roleModalDefault: undefined,
        roleAssignUserId: undefined,
        //roleLoading:false,

        permissionVisible: false,
        permissionKey: Date.now() + 3,
        permissionId: undefined,
        
        simplePermissionVisible: false,
        simplePermissionKey: Date.now() + 4,
        simplePermissionId: undefined,

        searchValues: undefined
    };
    async fetchUser(url) {
        return await request
            .get(url)
            .then(({ data }) => {
                if (data.code === 200) {
                    return Promise.resolve(data.data);
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message, 4);
            });
    }
    hideModal = () => {
        this.setState({ createUserVisible: false });
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    //选中多少条数据 - 禁用
    handleChange = (checked,id) => {
        /*const param = {
         isEnabled:checked === true ? '1' : '2',
         }*/
        const t = checked === true ? "启用" : "禁用";
        const modalRef = Modal.confirm({
            title: "友情提醒",
            content: `是否${t}？`,
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
                modalRef && modalRef.destroy();
                request
                    .put(`/sysUser/enableOrDisable/${id}`)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success(`${t}成功`);
                            this.refreshTable();
                        } else {
                            message.error(data.msg, 4);
                        }
                    })
                    .catch(err => {
                        message.error(err.message, 4);
                    });
            },
            onCancel() {
                modalRef.destroy();
            }
        });

    }

    handleDelete = (id,isEnabled) => {
        if(parseInt(isEnabled, 0) === 1){
            message.error('请禁用后，再删除');
            return;
        }
        const modalRef = Modal.confirm({
            title: "友情提醒",
            content: "该删除后将不可恢复，是否删除？",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
                request
                    .delete(`/sysUser/delete/${id}`)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success("删除成功!");
                            this.refreshTable();
                        } else {
                            message.error(data.msg, 4);
                        }
                    })
                    .catch(e => {
                        message.error(e.message, 4);
                    });
            },
            onCancel() {
                modalRef.destroy();
            }
        });
    };
    handleUnlock = (id) => {
        request
        .put(`/sysUser/unlock`,{id:id})
        .then(({ data }) => {
            if (data.code === 200) {
                message.success("解锁成功!");
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(e => {
            message.error(e.message, 4);
        });
    };
    handleAdmin = (id,isAdmin) => {
        request
        .put(isAdmin?`/sysUser/update/unAdmin`:`/sysUser/update/admin`,{id:id})
        .then(({ data }) => {
            if (data.code === 200) {
                message.success(isAdmin?"移除成功!":'添加成功!');
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(e => {
            message.error(e.message, 4);
        });
    };
    render() {
        return (
            <SearchTable
                searchOption={{
                    fields: getSearchFields(this)
                }}
                doNotFetchDidMount={false}
                backCondition={values => {
                    this.setState({
                        searchValues: values
                    });
                }}
                tableOption={{
                    key: this.state.updateKey,
                    pageSize: 100,
                    columns: getColumns(this),
                    url: "/sysUser/list",
                    scroll:{x:1000,y:window.screen.availHeight-370},
                    cardProps: {
                        title: "用户管理",
                        extra: (
                            <div>
                                {
                                    composeBotton([{
                                        type:'add',
                                        icon:'plus',
                                        onClick:()=>{
                                            this.setState({
                                                createUserVisible: true,
                                                createModalType: "create",
                                                createUserDefault: undefined
                                            });
                                        }
                                    }])
                                }
                            </div>
                        )
                    }
                }}
            >
                <PopModal
                    defaultFields={this.state.createUserDefault}
                    toggleModalVisible={visible => {
                        this.setState({
                            createUserVisible: visible,
                            createUserKey: Date.now()
                        });
                    }}
                    modalType={this.state.createModalType}
                    refreshTable={this.refreshTable}
                    visible={this.state.createUserVisible}
                    loading={this.state.createUserLoading}
                />
                <RoleModal
                    userId={this.state.roleAssignUserId}
                    orgId={
                        this.state.searchValues &&
                        this.state.searchValues["orgId"]
                    }
                    // defaultFields={this.state.roleModalDefault}
                    toggleModalVisible={visible => {
                        this.setState({
                            roleModalVisible: visible,
                            roleModalKey: Date.now()
                        });
                    }}
                    refreshTable={this.refreshTable}
                    visible={this.state.roleModalVisible}
                    updateKey={this.state.roleModalKey}
                    // loading={this.state.roleLoading}
                />
                <SimplePermissionModal
                    userId={this.state.permissionUserId}
                    orgId={
                        this.state.searchValues &&
                        this.state.searchValues["orgId"]
                    }
                    updateKey={this.state.simplePermissionKey}
                    visible={this.state.simplePermissionVisible}
                    toggleModalVisible={visible => {
                        this.setState({
                            simplePermissionVisible: visible,
                            simplePermissionKey: Date.now()
                        });
                    }}
                    togglePermissionModalVisible={visible => {
                        this.setState({
                            permissionVisible: visible,
                            permissionKey: Date.now()
                        });
                    }}
                    />
                <PermissionModal
                    userId={this.state.permissionUserId}
                    orgId={
                        this.state.searchValues &&
                        this.state.searchValues["orgId"]
                    }
                    toggleModalVisible={visible => {
                        this.setState({
                            permissionVisible: visible,
                            permissionKey: Date.now(),
                            simplePermissionKey:Date.now(),
                        });
                    }}
                    updateKey={this.state.permissionKey}
                    visible={this.state.permissionVisible}
                    editAble={true}
                />
            </SearchTable>
        );
    }
}

export default withRouter(connect(state => ({
    orgId: state.user.get("orgId")
}))(UserManage));
