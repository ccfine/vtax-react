/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { Form, Row, Col, Card } from "antd";
import UpdateAccount from "./UpdateAccount.react";
import PermissionFeilds from "../../permissionDetail";

class UserDetail extends Component {
    state = {
        updateAccountModalKey: Date.now() + "2",
        updateAccountVisible: false,
        updateAccountKey: Date.now() + "2",

        userData: {
            ...this.props.userInfo,
            char: []
        }
    };
    showModal = modalName => e => {
        this.mounted &&
            this.setState({
                [`${modalName}Visible`]: true
            });
    };
    componentWillReceiveProps(nextProps) {
        //更新了用户信息之后，也要更新已分配角色列表
        this.setState(prevState => ({
            userData: {
                ...prevState.userData,
                ...nextProps.userInfo
            }
        }));
    }

    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }

    render() {
        const { userData } = this.state;
        let {
            allPermission,
            checkedPermission,
            permissionLoading
        } = this.props;
        return (
            <Card title="用户信息" style={{ ...this.props.style }}>
                <div style={{ padding: "30px", color: "#999" }}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <p>
                                账号：<span style={{ color: "#333" }}>
                                    {userData.username}
                                </span>
                            </p>
                        </Col>
                        <Col span={6}>
                            <p>
                                手机：<span style={{ color: "#333" }}>
                                    {userData.phoneNumber}
                                </span>
                            </p>
                        </Col>
                        <Col span={8}>
                            <p>
                                邮箱：<span style={{ color: "#333" }}>
                                    {userData.email}
                                </span>
                            </p>
                        </Col>
                        <Col span={4}>
                            <p>
                                微信：<span style={{ color: "#333" }}>
                                    {userData.webchat}
                                </span>
                            </p>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <p>
                                状态：<span
                                    style={{
                                        color:
                                            parseInt(userData.isEnabled, 0) ===
                                            1
                                                ? "#009E4A"
                                                : "#FF0000"
                                    }}
                                >
                                    {parseInt(userData.isEnabled, 0) === 1
                                        ? "启用"
                                        : "停用"}
                                </span>
                            </p>
                        </Col>
                        <Col span={6}>
                            <p>
                                密码：
                                <span
                                    style={{
                                        color: "#0F83E6",
                                        cursor: "pointer",
                                        marginLeft: "20px"
                                    }}
                                    onClick={this.showModal("updateAccount")}
                                >
                                    修改密码
                                </span>
                            </p>
                        </Col>
                        <Col />
                    </Row>
                    <Row gutter={16}>
                        <Col>
                            <Col span={24}>
                                <p>
                                    组织：<span style={{ color: "#333" }}>
                                        {userData.orgNames}
                                    </span>
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col>
                            <Col span={24}>
                                <p>
                                    角色：<span style={{ color: "#333" }}>
                                        {userData.roleNames}
                                    </span>
                                </p>
                            </Col>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col>
                            <Col span={24}>
                                <div>
                                    权限：
                                    <span style={{ color: "#333" }}>
                                        <Form layout="inline">
                                            <PermissionFeilds
                                                editAble={false}
                                                checkedPermission={
                                                    checkedPermission
                                                }
                                                form={this.props.form}
                                                allPermission={allPermission}
                                                permissionLoading={
                                                    permissionLoading
                                                }
                                            />
                                        </Form>
                                    </span>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col>
                            <Col span={24}>
                                <p>
                                    备注：<span style={{ color: "#333" }}>
                                        {userData.remark}
                                    </span>
                                </p>
                            </Col>
                        </Col>
                    </Row>
                </div>
                <UpdateAccount
                    key={this.state.updateAccountKey}
                    refreshCurdTable={this.refreshCurdTable}
                    changeVisable={status => {
                        this.setState({
                            updateAccountVisible: status,
                            updateAccountKey: Date.now()
                        });
                    }}
                    userId={userData.userId}
                    visible={this.state.updateAccountVisible}
                />
            </Card>
        );
    }
}

export default Form.create()(UserDetail);
