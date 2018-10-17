/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { Form, Modal, message, Row, Col, Spin } from "antd";
import { request, getFields, regRules } from "utils";
import { connect } from "react-redux";

class PopModal extends Component {
    state = {
        submitLoading: false
    };
    static defaultProps = {
        modalType: "create"
    };
    handleCancel = e => {
        this.props.toggleModalVisible(false);
    };
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    submitLoading: true
                });

                //新建
                if (this.props.modalType === "create") {
                    request
                        .post(`/sysUser/add`, values)
                        .then(({ data }) => {
                            this.setState({
                                submitLoading: false
                            });
                            if (data.code === 200) {
                                message.success("用户新建成功", 4);

                                //新建成功，关闭当前窗口,刷新父级组件
                                this.props.toggleModalVisible(false);
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

                //编辑
                if (this.props.modalType === "edit") {
                    const { defaultFields, toggleModalVisible } = this.props;
                    request
                        .put(`/sysUser/update`, { ...defaultFields, ...values })
                        .then(({ data }) => {
                            this.setState({
                                submitLoading: false
                            });
                            if (data.code === 200) {
                                message.success("用户修改成功", 4);
                                toggleModalVisible(false);
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
            }
        });
    };
    componentDidMount() {}
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {
        const { modalType, loading } = this.props;
        const defaultFields = { ...this.props.defaultFields };
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title={modalType === "create" ? "新增用户" : "编辑用户"}
                key={this.props.key || "userModal"}
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                cancelText="取消"
                confirmLoading={this.state.submitLoading}
                width={900}
                style={{top:'5%'}}
                bodyStyle={{
                    height:420, //modalType === "create"?460:420
                    overflowY:'auto',
                }}
            >
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row gutter={25}>
                            <Col span={8}>
                            {getFields(this.props.form, [
                                {
                                    label: "姓名",
                                    fieldName: "realname",
                                    type: "input",
                                    span: 24,
                                    fieldDecoratorOptions: {
                                        initialValue:
                                            defaultFields.realname || "",
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入姓名"
                                            },
                                            {
                                                max: 20,
                                                message: "请输入20位以内的姓名"
                                            }
                                        ]
                                    }
                                },
                                {
                                    label: "帐号",
                                    fieldName: "username",
                                    type: "input",
                                    span: 24,
                                    componentProps: {
                                        disabled: modalType !== "create"
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:
                                            defaultFields.username || "",
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入帐号"
                                            },
                                            {
                                                pattern: /^(\d|\w){4,20}$/g,
                                                message:
                                                    "请输入4-20位字母或数字"
                                            }
                                        ]
                                    }
                                },
                                {
                                    label: "手机",
                                    fieldName: "phoneNumber",
                                    type: "input",
                                    span: 24,
                                    fieldDecoratorOptions: {
                                        initialValue:
                                            defaultFields.phoneNumber || "",
                                        rules: [
                                            // {
                                            //     required: true,
                                            //     message: "请输入手机号码"
                                            // },
                                            {
                                                pattern: /^1(\d){10}$/,
                                                message: "请输入正确的手机号码"
                                            }
                                        ]
                                    }
                                },
                                {
                                    label: "邮箱",
                                    fieldName: "email",
                                    type: "input",
                                    span: 24,
                                    componentProps: {
                                        type: "email"
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: defaultFields.email || "",
                                        rules: [
                                            {
                                                type: "email",
                                                message: "请输入正确的邮箱"
                                            },
                                            // {
                                            //     required: true,
                                            //     message: "请输入邮箱"
                                            // }
                                        ]
                                    }
                                },{
                                    label: "微信号",
                                    fieldName: "wechat",
                                    type: "input",
                                    span: 24,
                                    fieldDecoratorOptions: {
                                        initialValue: defaultFields.wechat || ""
                                    }
                                },
                                {
                                    label: "备注",
                                    fieldName: "remark",
                                    type: "textArea",
                                    span: 24,
                                    fieldDecoratorOptions: {
                                        initialValue: defaultFields.remark,
                                        rules: [
                                            {
                                                max:
                                                    regRules
                                                        .textarea_length_2000
                                                        .max,
                                                message:
                                                    regRules
                                                        .textarea_length_2000
                                                        .message
                                            }
                                        ]
                                    }
                                }
                            ])}
                            </Col>
                            <Col span={16}>
                            {
                                getFields(this.props.form, [{
                                    className:'fix-ie10-formItem-textArea',
                                    label: "组织",
                                    fieldName: "orgIds",
                                    type: "asyncTree",
                                    span: 24,
                                    formItemStyle: {
                                        labelCol: {
                                            span: 2
                                        },
                                        wrapperCol: {
                                            span: 22
                                        }
                                    },
                                    componentProps: {
                                        autoExpandParent:true,
                                        treeWrapperStyle:{height:340,overflowY:'auto'},
                                        initialValue: defaultFields.orgIds,
                                        style:{
                                            maxHeight:50,
                                        },
                                        fieldTextName: "name",
                                        fieldValueName: "id",
                                        url: `/sysOrganization/tree/all`,
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: defaultFields.orgIds,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择组织"
                                            }
                                        ]
                                    }
                                }])
                            }
                            </Col>
                            {/*{modalType === "create" ? (
                                <Col span={24}>
                                    <Alert
                                        message="新添加的帐号的初始密码
                                为：888888"
                                        type="info"
                                        showIcon
                                    />
                                </Col>
                            ) : null}*/}
                        </Row>
                            
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default connect(state => ({
    orgId: state.user.get("org").orgId
}))(Form.create()(PopModal));
