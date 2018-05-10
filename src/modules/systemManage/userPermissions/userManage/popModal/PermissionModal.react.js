/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-09 17:06:16 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-10 17:42:52
 */
import React, { Component } from "react";
import { Form, Modal, message } from "antd";
import { request } from "utils";
import PermissionFeilds from "../../permissionDetail";

class PermissionModal extends Component {
    state = {
        submitLoading: false,
        permissionLoading: true,
        allPermission: []
    };
    static defaultProps = {};
    handleCancel = e => {
        this.props.toggleModalVisible(false);
    };
    fetchAllPermission() {
        this.setState({ permissionLoading: true });
        request
            .get("/permissions")
            .then(({ data }) => {
                if (data.code === 200) {
                    this.setState({
                        allPermission: data.data,
                        permissionLoading: false
                    });
                } else {
                    message.error(data.msg, 4);
                    this.setState({ permissionLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message, 4);
                this.setState({ permissionLoading: false });
            });
    }
    handleSubmit = rolePermissions => e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = [];
                for (let item in values) {
                    (values[item] && item.indexOf('allCode')===-1) && params.push(item);
                }

                // 筛选剔除角色权限
                params = params.filter(ele => {
                    if (rolePermissions.indexOf(ele) === -1) {
                        return true;
                    } else {
                        return false;
                    }
                });

                this.setState({ submitLoading: true });
                request
                    .post(`/sysUser/assignPermission/${this.props.orgId}`, {
                        options: params,
                        id: this.props.userId
                    })
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success("权限配置成功");
                            this.props.toggleModalVisible(false);
                        } else {
                            message.error(data.msg);
                        }
                        this.setState({ submitLoading: false });
                    })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ submitLoading: false });
                    });
            }
        });
    };
    componentDidMount() {
        this.fetchAllPermission();
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        let { rolePermissions = [], userPermissions = [] } = this.props
                .defaultFields
                ? this.props.defaultFields
                : {},
            checkedPermission = [...userPermissions, ...rolePermissions],
            { permissionLoading, allPermission } = this.state;

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="权限配置"
                visible={this.props.visible}
                onOk={this.handleSubmit(rolePermissions)}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={this.state.submitLoading}
                width="900px"
                bodyStyle={{
                    maxHeight:400,
                    overflowY:'auto'
                }}
            >
                <Form layout="inline">
                    <PermissionFeilds
                        form={this.props.form}
                        editAble={true}
                        checkedPermission={checkedPermission}
                        disabledPermission={rolePermissions}
                        allPermission={allPermission}
                        permissionLoading={permissionLoading}
                    />
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PermissionModal);
