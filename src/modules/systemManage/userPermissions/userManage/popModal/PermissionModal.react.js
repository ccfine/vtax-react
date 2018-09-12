/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-09 17:06:16 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-28 11:09:35
 */
import React, { Component } from "react";
import { Form, Modal, message, Spin,Alert,Row,Col } from "antd";
import { request,getFields } from "utils";
import PermissionFeilds from "../../permissionDetail";

class PermissionModal extends Component {
    state = {
        submitLoading: false,
        permissionLoading: true,
        allPermission: [],
        userPermissionLoading:false,
        permissions:{},
    };
    static defaultProps = {};
    handleCancel = e => {
        this.props.form.resetFields();
        this.setState({permissions:{}});
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
    fetchPermissionByUserId=(orgId,userId)=>{
        this.setState({userPermissionLoading: true});
        request
            .get(`/sysUser/queryUserPermissions/${orgId}/${userId}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    this.mounted &&
                        this.setState({
                            permissions:data.data,
                            userPermissionLoading: false
                        });
                } else {
                    message.error(data.msg);
                    this.setState({userPermissionLoading: false});
                }
            })
            .catch(err => {
                message.error(err.message);
                this.setState({userPermissionLoading: false});
            });
    }
    handleSubmit = (rolePermissions,userPermissions) => e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = [];
                for (let item in values) {
                    values[item] &&
                        item.indexOf("allCode") === -1 && item.indexOf("orgId") === -1 && 
                        params.push(item);
                }

                // 筛选剔除角色权限，但如果原本用户权限就存在就不剔除
                params = params.filter(ele => {
                    return rolePermissions.indexOf(ele) === -1 || userPermissions.indexOf(ele)>-1;
                });

                this.setState({ submitLoading: true });
                request
                    .post(`/sysUser/assignPermission`, {
                        options: params,
                        id: this.props.userId,
                        orgId:values.orgId,
                    })
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success("权限配置成功");
                            this.handleCancel();
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
    componentWillReceiveProps(nextProps){
        if(this.props.updateKey!==nextProps.updateKey){
            if(nextProps.orgId){
                this.fetchPermissionByUserId(nextProps.orgId,nextProps.userId)
            }else{                
                    this.setState({permissions:{}});
            }
        }
    }
    componentDidMount() {
        this.fetchAllPermission();
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        let { rolePermissions = [], userPermissions = [] } = this.state.permissions,
            checkedPermission = [...userPermissions, ...rolePermissions],
            { permissionLoading, allPermission,userPermissionLoading } = this.state,
            { orgId,userId } = this.props;

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                visible={this.props.visible}
                onOk={this.handleSubmit(rolePermissions,userPermissions)}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={this.state.submitLoading}
                width={900}
                style={{
                    top:'5%'
                }}
                bodyStyle={{
                    maxHeight: 450,
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
                <Spin spinning={userPermissionLoading}>
                    <Form layout="inline">
                        <Row>
                        {
                            getFields(this.props.form, [{
                                label: "组织",
                                fieldName: "orgId",
                                type: "asyncSelect",
                                span: 24,
                                formItemStyle: {
                                    labelCol: {
                                        span: 2
                                    },
                                    wrapperCol: {
                                        span: 12
                                    },
                                    style:{display:'block'}
                                },
                                componentProps: {
                                    fieldTextName: "name",
                                    fieldOtherName:'code',
                                    fieldValueName: "id",
                                    doNotFetchDidMount:!userId,
                                    fetchAble:userId,
                                    url: `/sysOrganization/queryOrgsByUserId/${userId}`,
                                    selectOptions:{
                                        defaultActiveFirstOption:true,
                                        showSearch:true,
                                        optionFilterProp:'children',
                                    },
                                },
                                fieldDecoratorOptions: {
                                    initialValue: orgId,
                                    onChange:(orgId)=>{
                                        this.props.form.resetFields();
                                        orgId && this.fetchPermissionByUserId(orgId,userId)
                                    },
                                    rules: [
                                        {
                                            required: true,
                                            message: "请选择组织"
                                        }
                                    ]
                                }
                            }])
                        }
                        </Row>
                        
                        <Row>
                            <Col span={2} style={{textAlign:'right',color:'rgba(0, 0, 0, 0.85)'}}>
                                <label>权限：</label>
                            </Col>
                            <Col span={20}>
                                <PermissionFeilds
                                    form={this.props.form}
                                    editAble={true}
                                    checkedPermission={checkedPermission}
                                    disabledPermission={rolePermissions}
                                    allPermission={allPermission}
                                    permissionLoading={permissionLoading}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PermissionModal);
