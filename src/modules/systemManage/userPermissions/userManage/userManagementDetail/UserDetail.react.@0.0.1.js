/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { Form, Row, Col, Card } from "antd";
import {getFields} from 'utils';
// import UpdateAccount from "./UpdateAccount.react";
import PermissionFeilds from "../../permissionDetail";

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
    },
};
const formItemLayout2 = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 1 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
    },
};
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
            permissionLoading,
            userLoading
        } = this.props;
        const { getFieldValue } = this.props.form;
        return (
            <Card title="用户信息" style={{ ...this.props.style }} loading={userLoading}>
                <div style={{ padding: "10px 15px", color: "#999" }}>
                    <Row gutter={16}>

                        <Col span={6}>
                            <FormItem label='姓名' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.realname}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label='账号' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.username}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label='手机' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.phoneNumber}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label='邮箱' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.email}
                                </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <FormItem label='微信' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.webchat}
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label='状态' {...formItemLayout}>
                                <span
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
                            </FormItem>
                        </Col>
                        {/* <Col span={6}>
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
                        </Col> */}
                        <Col span={6}>
                            <FormItem label='备注' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                        {userData.remark}
                                    </span>
                            </FormItem>
                        </Col>
                    </Row>
                    {/*<Row gutter={16}>
                        <Col span={24}>
                            <p>
                                组织：<span style={{ color: "#333" }}>
                                    {userData.orgNames}
                                </span>
                            </p>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <p>
                                角色：<span style={{ color: "#333" }}>
                                    {userData.roleNames}
                                </span>
                            </p>
                        </Col>
                    </Row>*/}

                    <Row gutter={16}>
                        {
                            getFields(this.props.form,[{
                                label:'组织',
                                fieldName:'orgId',
                                type:'asyncSelect',
                                span:6,
                                formItemStyle:formItemLayout,
                                componentProps:{
                                    fieldTextName:'name',
                                    fieldValueName:'id',
                                    doNotFetchDidMount:false,
                                    notShowAll:true,
                                    url:`/sysOrganization/getOrganizations`,
                                    selectOptions:{
                                        onChange:this.handleAreaChange,
                                        defaultActiveFirstOption:true,
                                        showSearch:true,
                                        optionFilterProp:'children',
                                    },
                                },
                                fieldDecoratorOptions: {
                                    initialValue: this.props.areaId
                                }
                            }])
                        }
                    </Row>
                    <Row gutter={16}>
                        {
                            getFields(this.props.form,[{
                                    label:'角色名称',
                                    fieldName:'roleName',
                                    type:'asyncSelect',
                                    span:6,
                                    formItemStyle:formItemLayout,
                                    componentProps:{
                                        fieldTextName:'name',
                                        fieldValueName:'id',
                                        doNotFetchDidMount:!this.props.areaId,
                                        notShowAll:true,
                                        fetchAble:getFieldValue('orgId') || this.props.areaId || false,
                                        url:`/sysOrganization/queryLoginOrgs/${getFieldValue('orgId') || this.props.areaId}`,
                                        selectOptions:{
                                            onChange:this.handleChange,
                                            defaultActiveFirstOption:true,
                                            showSearch:true,
                                            optionFilterProp:'children',
                                        },
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: this.props.orgId
                                    }
                                }])
                        }
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form layout="inline">
                                <FormItem label='权限' {...formItemLayout2}>
                                    <span style={{ color: "#333" }}>
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
                                    </span>
                                </FormItem>
                            </Form>
                            {/*<div>
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
                            </div>*/}
                        </Col>
                    </Row>
                </div>
                {/* <UpdateAccount
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
                /> */}
            </Card>
        );
    }
}

export default Form.create()(UserDetail);
