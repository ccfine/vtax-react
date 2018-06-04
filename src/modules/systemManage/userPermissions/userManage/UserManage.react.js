/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-16 14:07:17 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-04 11:05:30
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Divider, Modal, message } from "antd";
import { request,composeBotton } from "utils";
import { SearchTable } from "compoments";
import PopModal, { RoleModal, PermissionModal } from "./popModal";
const pointerStyleDelete = {
    cursor:'pointer',
    color:'red',
    marginRight:10
}
const getSearchFields = context => [
    {
        label: "组织",
        fieldName: "orgId",
        type: "asyncSelect",
        span: 8,
        componentProps: {
            fieldTextName: "orgName",
            fieldValueName: "orgId",
            url: `/org/getOrganizations`,
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
    },
    {
        label: "用户名",
        type: "input",
        span: 8,
        fieldName: "username"
    },
    {
        label: "姓名",
        type: "input",
        span: 8,
        fieldName: "realname"
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
                                context.setState({roleLoading:true,roleModalVisible:true})
                                context.fetchUser(
                                        `/sysRole/queryRoleByUserId/${
                                            context.state.searchValues["orgId"]
                                            }/${record.id}`
                                    ).then(data => {
                                        data &&
                                        context.setState({
                                            roleAssignUserId: record.id,
                                            roleModalKey: Date.now(),
                                            roleModalVisible: true,
                                            roleModalDefault: data
                                        });

                                        context.setState({roleLoading:false})
                                    });
                            }
                        },{
                            type: 'action',
                            icon: 'setting',
                            title: '权限配置',
                            onSuccess: () => {
                                context.setState({permissionLoading:true,permissionVisible:true})
                                context.fetchUser(
                                        `/sysUser/queryUserPermissions/${
                                            context.state.searchValues["orgId"]
                                            }/${record.id}`
                                    ).then(data => {
                                        data &&
                                        context.setState({
                                            permissionKey: Date.now(),
                                            permissionVisible: true,
                                            permissionDefault: data,
                                            permissionUserId: record.id
                                        });

                                        context.setState({permissionLoading:false})
                                    });
                            }
                        }])
                    }
                    {notAdmin && <Divider type="vertical" />}
                    {
                        notAdmin && composeBotton([{
                            type:'switch',
                            checked: parseInt(record.isEnabled, 0) === 1,
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
                        pathname: `/web/systemManage/userPermissions/userManage/${
                            context.props.orgId
                            }-${record.id}`
                    }}
                >
                    {text}
                </Link>
            )
        }
    },
    {
        title: "姓名",
        dataIndex: "realname"
    },
    {
        title: "手机",
        dataIndex: "phoneNumber"
    },
    {
        title: "邮箱",
        dataIndex: "email"
    },
    {
        title: "角色",
        dataIndex: "roleNames",
        width: "40%"
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
        roleModalDefault: undefined,
        roleAssignUserId: undefined,
        roleLoading:false,

        permissionVisible: false,
        permissionKey: Date.now() + 3,
        permissionDefault: undefined,
        permissionId: undefined,
        permissionLoading:false,

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
                            message.success("操作成功");
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
                        message.error(e, 4);
                    });
            },
            onCancel() {
                modalRef.destroy();
            }
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
                    pageSize: 10,
                    columns: getColumns(this),
                    url: "/sysUser/list",
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
                    defaultFields={this.state.roleModalDefault}
                    toggleModalVisible={visible => {
                        this.setState({
                            roleModalVisible: visible,
                            roleModalKey: Date.now()
                        });
                    }}
                    refreshTable={this.refreshTable}
                    visible={this.state.roleModalVisible}
                    updateKey={this.state.roleModalKey}
                    loading={this.state.roleLoading}
                />
                <PermissionModal
                    userId={this.state.permissionUserId}
                    orgId={
                        this.state.searchValues &&
                        this.state.searchValues["orgId"]
                    }
                    defaultFields={this.state.permissionDefault}
                    toggleModalVisible={visible => {
                        this.setState({
                            permissionVisible: visible,
                            permissionKey: Date.now()
                        });
                    }}
                    visible={this.state.permissionVisible}
                    editAble={true}
                    loading={this.state.permissionLoading}
                />
            </SearchTable>
        );
    }
}

export default connect(state => ({
    orgId: state.user.get("orgId")
}))(UserManage);
