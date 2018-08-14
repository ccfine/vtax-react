/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { Form, Row, Col, Card,message,Tag } from "antd";
import {getFields,request} from 'utils';
// import UpdateAccount from "./UpdateAccount.react";
import PermissionFeilds from "../../permissionDetail";

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
    },
};
const formItemLayout2 = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 22 },
    },
};
class UserDetail extends Component {
    state = {
        infoLoading:false,
        checkedPermission:[],
        userSecRoles:[],
    };
    fetchPermissionByUserId=(orgId,userId)=>{
        this.setState({infoLoading: true});
        request
            .get(`/sysUser/orgUserPermissions/${orgId}/${userId}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    this.mounted &&
                    this.setState({
                        checkedPermission:data.data.userPermissions,
                        userSecRoles:data.data.userSecRoles,
                        infoLoading: false
                    });
                } else {
                    message.error(data.msg);
                    this.setState({infoLoading: false});
                }
            })
            .catch(err => {
                message.error(err.message);
                this.setState({infoLoading: false});
            });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.orgId && nextProps.userInfo.id && (nextProps.orgId !== this.props.orgId || nextProps.userInfo.id !== this.props.userInfo.id)){
            this.fetchPermissionByUserId(nextProps.orgId,nextProps.userInfo.id)
        }
    }

    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }

    render() {
        const { checkedPermission,userSecRoles ,infoLoading} = this.state;
        let {
            allPermission,
            userInfo:userData,
            userLoading,
        } = this.props;
        return (
            <Card title="用户信息" style={{ ...this.props.style }} loading={userLoading}>
                <div style={{ padding: "10px 15px", color: "#999" }}>
                    <Row>
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
                    <Row>
                        <Col span={6}>
                            <FormItem label='微信' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                    {userData.wechat}
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
                        <Col span={6}>
                            <FormItem label='备注' {...formItemLayout}>
                                <span style={{ color: "#333" }}>
                                        {userData.remark}
                                    </span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {
                            getFields(this.props.form,[{
                                label:'组织',
                                fieldName:'orgId',
                                type:'asyncSelect',
                                span:24,
                                formItemStyle:{
                                    labelCol: {
                                        xs: { span: 12 },
                                        sm: { span: 2 },
                                    },
                                    wrapperCol: {
                                        xs: { span: 12 },
                                        sm: { span: 10 },
                                    },
                                },
                                componentProps:{
                                    fieldTextName:'name',
                                    fieldValueName:'id',
                                    doNotFetchDidMount:false,
                                    notShowAll:true,
                                    url:`/sysOrganization/getOrganizations`,
                                    selectOptions:{
                                        defaultActiveFirstOption:true,
                                        showSearch:true,
                                        optionFilterProp:'children',
                                    },
                                },
                                fieldDecoratorOptions: {
                                    initialValue: this.props.orgId,
                                    onChange:(orgId)=>{
                                        orgId && this.fetchPermissionByUserId(orgId,userData.id)
                                    },
                                }
                            }])
                        }
                    </Row>
                    <Row>
                        <Col span={24} className='fix-ie10-formItem-textArea'>
                            <FormItem label='角色' {...formItemLayout2}>
                                <div>{
                                    userSecRoles.map(({roleName,id  })=> <Tag key={id} color="#2db7f5">{roleName}</Tag>)
                                }</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form layout="inline">
                                <FormItem label='权限' {...formItemLayout2}>
                                    <span style={{ color: "#333" }}>
                                    <Row>
                                        <Col span={24}>
                                            <PermissionFeilds
                                                editAble={false}
                                                checkedPermission={
                                                    checkedPermission
                                                }
                                                form={this.props.form}
                                                allPermission={allPermission}
                                                permissionLoading={
                                                    infoLoading
                                                }
                                            />
                                        </Col>
                                    </Row>
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
