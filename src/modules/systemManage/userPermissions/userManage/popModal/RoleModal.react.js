/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-08 11:41:20 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-25 19:08:17
 */
import React from "react";
import { Form, Spin, message, Modal, Checkbox,Row} from "antd";
import { request,getFields } from "utils";
const FormItem = Form.Item;
class RoleModal extends React.Component {
    state = {
        charAllList: [],
        charLoading: false,
        checkAll: undefined,
        submitLoading: false,
        roles:[],
        roleLoading:false,
    };
    fetchCharList() {
        this.setState({charLoading: true});
        request
            .get("/sysRole/queryAllRole")
            .then(({ data }) => {
                if (data.code === 200) {
                    let charAllList = [...data.data];
                    this.mounted &&
                        this.setState({
                            charAllList,
                            charLoading: false
                        });
                } else {
                    message.error(data.msg);
                    this.setState({charLoaded: false});
                }
            })
            .catch(err => {
                message.error(err.message);
                this.setState({charLoading: false});
            });
    }
    fetchRoleByUserId=(orgId,userId)=>{
        this.setState({roleLoading: true});
        request
            .get(`/sysRole/queryRoleByUserId/${orgId}/${userId}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    let roles = [...data.data];
                    this.mounted &&
                        this.setState({
                            roles,
                            roleLoading: false
                        });
                    this.props.form.setFieldsValue({'roleIds':roles.map(item => item.roleId)})
                    this.setState({
                        checkAll: this.isAllCheck(
                            roles.map(item => item.roleId)
                        )
                    });
                } else {
                    message.error(data.msg);
                    this.setState({roleLoading: false});
                }
            })
            .catch(err => {
                message.error(err.message);
                this.setState({roleLoading: false});
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
                    userId: this.props.userId,
                    ...values
                };
                request
                    .post(`/sysUser/assignRole`, params)
                    .then(({ data }) => {
                        this.setState({
                            submitLoading: false
                        });
                        if (data.code === 200) {
                            message.success("角色分配成功", 4);

                            //新建成功，关闭当前窗口,刷新父级组件
                            this.handleCancel();
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
        this.props.form.setFieldsValue({'roleIds':[]})
        this.props.form.resetFields();
        this.setState({ checkAll: false,roles:[] });
        this.props.toggleModalVisible(false);
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
    }
    componentWillReceiveProps(nextProps) {
        // 存在数据比较下是否全选
        if (nextProps.updateKey !== this.props.updateKey) {
            if(nextProps.orgId){
                this.fetchRoleByUserId(nextProps.orgId,nextProps.userId)
            }else{
                this.setState({roles:[],checkAll: false,})
            }
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
            { charAllList ,roles:defaultFields=[],submitLoading,roleLoading,charLoading} = this.state,
            {userId,orgId} = this.props;
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
                confirmLoading={submitLoading}
                width="800px"
                style={{top:'5%'}}
                bodyStyle={{maxHeight:400,overflowY:'auto'}}
            >
                <Spin spinning={roleLoading || charLoading}>
                    <Form
                        onSubmit={this.handleSubmit}
                        style={{ padding: "0 16px" }}
                    >
                    <Row>
                    {
                        getFields(this.props.form, [{
                            label: "组织",
                            fieldName: "orgIds",
                            type: "asyncTreeSelect",
                            span: 24,
                            formItemStyle: {
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 20
                                }
                            },
                            componentProps: {
                                fieldTextName: "name",
                                fieldValueName: "id",
                                doNotFetchDidMount:!userId,
                                fetchAble:!!userId,
                                url: `/sysOrganization/queryOrgTreeByUserId/${userId}`,
                                maxTagCount:5,
                                dropdownStyle:{
                                    maxHeight:400,
                                },
                                labelInValue:false,
                                allowClear:true,
                                showSearch:true,
                                // filterTreeNode:true,
                            },
                            fieldDecoratorOptions: {
                                initialValue: orgId?[orgId]:undefined,
                                onChange:(orgIds)=>{
                                    if(orgIds){
                                        if(orgIds.length===1){
                                            this.fetchRoleByUserId(orgIds[0],userId)
                                        }else{
                                            this.props.form.setFieldsValue({'roleIds':[]})
                                            this.props.form.resetFields();
                                            this.setState({ checkAll: false,roles:[],defaultFields:[] });
                                        }
                                    }
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
                    <div className='fix-ie10-formItem-textArea'>
                    <FormItem
                        wrapperCol= {{span:22}}
                        labelCol= {{span:2}}
                        label="角色"
                        >
                        <Checkbox
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                {this.state.checkAll ? "取消" : "全选"}
                            </Checkbox>
                            {getFieldDecorator("roleIds", {
                            initialValue: defaultFields.map(
                                item => item.roleId
                            ),
                            onChange:(values)=>{
                                this.setState({checkAll:this.isAllCheck(values)})
                            }
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
                    </FormItem>   
                    </div>                     
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(RoleModal);
