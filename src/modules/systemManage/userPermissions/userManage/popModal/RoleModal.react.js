/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-08 11:41:20 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-10 12:31:55
 */
import React from "react";
import { Form, Spin, message, Modal, Checkbox } from "antd";
import { request } from "utils";
class RoleModal extends React.Component {
    state = {
        charAllList: [],
        charLoaded: false,
        checkAll: undefined,
        submitLoading: false
    };
    fetchCharList() {
        request
            .get("/sysRole/queryAllRole")
            .then(({ data }) => {
                if (data.code === 200) {
                    let charAllList = [...data.data];
                    this.mounted &&
                        this.setState({
                            charAllList,
                            charLoaded: true
                        });
                } else {
                    message.error(data.msg);
                }
            })
            .catch(err => {
                message.error(err);
            });
    }
    isAllCheck = roleIds => {
        let { charAllList = [] } = this.state;
        return (
            charAllList.length > 0 &&
            charAllList.every(item => {
                return roleIds.indexOf(item.roleId) > -1;
            })
        );
    };
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    submitLoading: true
                });
                let params = {
                    orgId: this.props.orgId,
                    userId: this.props.userId,
                    ...values
                };
                request
                    .post(`/sysUser/assignRole/${this.props.orgId}`, params)
                    .then(({ data }) => {
                        this.setState({
                            submitLoading: false
                        });
                        if (data.code === 200) {
                            message.success("权限分配成功", 4);

                            //新建成功，关闭当前窗口,刷新父级组件
                            this.props.toggleModalVisible(false);
                            this.props.refreshTable &&
                                this.props.refreshTable();
                        } else {
                            message.error(data.msg, 4);
                        }
                    })
                    .catch(err => {
                        message.error(err.message);
                        this.mounted &&
                            this.setState({
                                submitLoading: false
                            });
                    });
            }
        });
    };
    handleCancel = () => {
        this.props.toggleModalVisible(false);
        this.setState({ checkAll: false });
    };
    onCheckAllChange = e => {
        this.setState({
            checkAll: e.target.checked
        });
        this.props.form.setFieldsValue({
            roleIds: e.target.checked
                ? this.state.charAllList.map(item => item.roleId)
                : []
        });
    };
    componentWillReceiveProps(nextProps) {
        // 存在数据比较下是否全选
        if (
            nextProps.updateKey !== this.props.updateKey &&
            nextProps.defaultFields &&
            nextProps.defaultFields.length > 0
        ) {
            this.setState({
                checkAll: this.isAllCheck(
                    nextProps.defaultFields.map(item => item.roleId)
                )
            });
        }
    }
    componentDidMount() {
        this.fetchCharList();
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        const { getFieldDecorator } = this.props.form,
            { charAllList } = this.state,
            { defaultFields = [] } = this.props;
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title="角色分配"
                key={this.props.key || "RoleModal"}
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={
                    this.state.charLoaded && this.state.submitLoading
                }
                width="700px"
            >
                <Spin spinning={!this.state.charLoaded}>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ padding: "0 16px" }}
                    >
                        <div
                            style={{
                                borderBottom: "1px solid #E9E9E9",
                                padding: "5px 0"
                            }}
                        >
                            <Checkbox
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                {this.state.checkAll ? "取消" : "全选"}
                            </Checkbox>
                        </div>
                        <br />
                        {getFieldDecorator("roleIds", {
                            initialValue: defaultFields.map(
                                item => item.roleId
                            ),
                            rules: [
                                {
                                    required: true,
                                    message: "请选择角色"
                                }
                            ]
                        })(
                            <Checkbox.Group style={{ width: "100%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    {charAllList.map((item, index) => {
                                        return (
                                            <span
                                                key={item.roleId}
                                                style={{
                                                    flex: "0 0 auto",
                                                    height: 48,
                                                    paddingRight: 8
                                                }}
                                            >
                                                <Checkbox value={item.roleId}>
                                                    {item.roleName}
                                                </Checkbox>
                                            </span>
                                        );
                                    })}
                                </div>
                            </Checkbox.Group>
                        )}
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(RoleModal);
