/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-16 14:07:17 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-10 17:38:04
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Divider, Tooltip, Modal, message, Switch } from "antd";
import { request } from "utils";
import { SearchTable } from "compoments";
import PopModal, { RoleModal, PermissionModal } from "./popModal";
import { connect } from "react-redux";
const getSearchFields = context => [
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
            return (
                <span className="table-operate">
                    <Link
                        to={{
                            pathname: `/web/systemManage/userPermissions/userManage/${
                                context.props.orgId
                            }-${record.id}`
                        }}
                    >
                        <Tooltip placement="top" title="详情">
                            <Icon type="search" />
                        </Tooltip>
                    </Link>
                    <a
                        onClick={() => {
                            context
                                .fetchUser(`/sysUser/find/${record.id}`)
                                .then(data => {
                                    data &&
                                        context.setState({
                                            createUserVisible: true,
                                            createModalType: "edit",
                                            createUserDefault: data,
                                            createUserKey: Date.now()
                                        });
                                });
                        }}
                    >
                        <Tooltip placement="top" title="编辑">
                            <Icon type="edit" />
                        </Tooltip>
                    </a>
                    <a
                        onClick={() => {
                            context.handleDelete(record.id,record.isEnabled);
                        }}
                    >
                        <Tooltip placement="top" title="删除">
                            <Icon type="delete" />
                        </Tooltip>
                    </a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => {
                            context
                                .fetchUser(
                                    `/sysRole/queryRoleByUserId/${
                                        context.state.searchValues["orgId"]
                                    }/${record.id}`
                                )
                                .then(data => {
                                    data &&
                                        context.setState({
                                            roleAssignUserId: record.id,
                                            roleModalKey: Date.now(),
                                            roleModalVisible: true,
                                            roleModalDefault: data
                                        });
                                });
                        }}
                    >
                        <Tooltip placement="top" title="角色分配">
                            <Icon type="team" />
                        </Tooltip>
                    </a>
                    <a
                        onClick={() => {
                            context
                                .fetchUser(
                                    `/sysUser/queryUserPermissions/${
                                        context.state.searchValues["orgId"]
                                    }/${record.id}`
                                )
                                .then(data => {
                                    data &&
                                        context.setState({
                                            permissionKey: Date.now(),
                                            permissionVisible: true,
                                            permissionDefault: data,
                                            permissionUserId: record.id
                                        });
                                });
                        }}
                    >
                        <Tooltip placement="top" title="权限配置">
                            <Icon type="setting" />
                        </Tooltip>
                    </a>
                    <Divider type="vertical" />
                    <Switch
                        checkedChildren="启"
                        unCheckedChildren="停"
                        size="small"
                        onChange={context.handleState(record.id)}
                        checked={
                            parseInt(record.isEnabled, 0) === 1 ? true : false
                        }
                    />
                </span>
            );
        },
        width: 240
    },
    {
        title: "用户名",
        dataIndex: "username"
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
        /*render: (text, record) => (
            <div>
                {record.roles.map((item, i) => (
                    <span key={i} style={{ color: "#108ee9" }}>
                        {item.roleName}
                    </span>
                ))}
            </div>
        )*/
    }
    // {
    //     title: "状态",
    //     dataIndex: "isEnabled",
    //     className: "text-center",
    //     render: (text, record) => {
    //         return (
    //             <Switch
    //                 checkedChildren="启"
    //                 unCheckedChildren="停"
    //                 size="small"
    //                 onChange={context.handleState(record.id)}
    //                 checked={parseInt(text, 0) === 1 ? true : false}
    //             />
    //         );
    //         //1:启用;2:停用;3:删除; ,
    //         // let t = "";
    //         // switch (parseInt(text, 0)) {
    //         //     case 1:
    //         //         t = <span style={{ color: "#008000" }}>启用</span>;
    //         //         break;
    //         //     case 2:
    //         //         t = <span style={{ color: "#FF0000" }}>停用</span>;
    //         //         break;
    //         //     case 3:
    //         //         t = <span style={{ color: "#f5222d" }}>删除</span>;
    //         //         break;
    //         //     default:
    //         //no default
    //         // }
    //         // return t;
    //     }
    // }
];

class UserManage extends Component {
    state = {
        updateKey: Date.now(),

        createUserKey: Date.now() + 1,
        createUserVisible: false,
        createModalType: "create",
        createUserDefault: undefined,

        roleModalVisible: false,
        roleModalKey: Date.now() + 2,
        roleModalDefault: undefined,
        roleAssignUserId: undefined,

        permissionVisible: false,
        permissionKey: Date.now() + 3,
        permissionDefault: undefined,
        permissionId: undefined,

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
    handleState = id => checked => {
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
    };
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
                        title: "用户列表",
                        extra: (
                            <div>
                                <Button
                                    size="small"
                                    style={{ marginRight: 5 }}
                                    onClick={() => {
                                        this.setState({
                                            createUserVisible: true,
                                            createModalType: "create",
                                            createUserDefault: undefined
                                        });
                                    }}
                                >
                                    <Icon type="plus" />新增
                                </Button>
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
                />
            </SearchTable>
        );
    }
}

export default connect(state => ({
    orgId: state.user.get("orgId")
}))(UserManage);
