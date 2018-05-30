/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-09 17:06:16 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-26 15:24:09
 */
import React, { Component } from "react";
import { Form, Modal, message, Spin,Alert,Row,Col } from "antd";
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
    handleSubmit = (rolePermissions,userPermissions) => e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = [];
                for (let item in values) {
                    values[item] &&
                        item.indexOf("allCode") === -1 &&
                        params.push(item);
                }

                // 筛选剔除角色权限，但如果原本用户权限就存在就不剔除
                params = params.filter(ele => {
                    return rolePermissions.indexOf(ele) === -1 || userPermissions.indexOf(ele)>-1;
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
            { permissionLoading, allPermission } = this.state,
            { loading: wrapperLoading } = this.props;

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                visible={this.props.visible}
                onOk={this.handleSubmit(rolePermissions,userPermissions)}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={this.state.submitLoading}
                width="900px"
                style={{
                    top:'5%'
                }}
                bodyStyle={{
                    maxHeight: 420,
                    overflowY: "auto"
                }}
                title={
                    <Row>
                        <Col span={4} style={{padding:'8px 0'}}>
                            权限配置
                        </Col>
                        <Col span={16}>
                            <Alert style={{color: 'red'}} message="每个模块权限必须分配查看权限才能访问，否则页面不能访问！" type="warning" showIcon />
                        </Col>
                    </Row>
                }
            >
                <Spin spinning={wrapperLoading}>
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
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PermissionModal);
