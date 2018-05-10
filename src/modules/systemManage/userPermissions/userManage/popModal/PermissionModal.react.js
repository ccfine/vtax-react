/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-09 17:06:16 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-09 20:29:56
 */
import React, { Component } from "react";
import { Form, Modal, message } from "antd";
import { request } from "utils";
import PermissionFeilds from "../../permissionDetail";

class PermissionModal extends Component {
    state = {
        submitLoading: false
    };
    static defaultProps = {};
    handleCancel = e => {
        this.props.toggleModalVisible(false);
    };
    handleSubmit = rolePermissions=>e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = [];
                for (let item in values) {
                    values[item] && params.push(item);
                }

                // 筛选剔除角色权限
                params = params.filter(ele=>{
                    if(rolePermissions.indexOf(ele)===-1){
                        return true;
                    }else{
                        return false;
                    }
                })
                
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
                        message.error(err);
                        this.setState({ submitLoading: false });
                    });
            }
        });
    };
    componentDidMount() {}
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        let { rolePermissions = [], userPermissions = [] } = this.props
                .defaultFields
                ? this.props.defaultFields
                : {},
            checkedPermission = [...userPermissions, ...rolePermissions];
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="权限配置"
                key={this.props.key || "PermissionModal"}
                visible={this.props.visible}
                onOk={this.handleSubmit(rolePermissions)}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={this.state.submitLoading}
                width="700px"
            >
                <Form layout="inline">
                    <PermissionFeilds
                        form={this.props.form}
                        editAble={true}
                        checkedPermission={checkedPermission}
                        disabledPermission={rolePermissions}
                    />
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PermissionModal);
