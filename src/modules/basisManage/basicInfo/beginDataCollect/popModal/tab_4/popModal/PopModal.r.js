/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import { Modal, Form,Button, message, Spin, Row } from 'antd'
import { getFields, request } from 'utils'
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
    },
};

class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {}
    }
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request.get(`/account/otherTax/deducted/collection/${this.props.beginType === '2' ? 'pc/' : ''}find/${props.id}`).then(({ data }) => {
                    if (data.code === 200) {
                        this.setState({ formLoading: false, record: data.data});
                    }
                })
                    .catch(err => {
                        this.setState({ formLoading: false });
                        message.error(err.message)
                    });
            } else {
                this.setState({ formLoading: false, record: {} });
                this.props.form.resetFields();
            }
        }
    }
    hideModal() {
        this.props.toggleModalVisible(false);
        // 回归初始状态
        this.props.form.resetFields();
        this.setState({ record: {}});
    }
    handleOk() {
        if ((this.props.action !== 'modify' && this.props.action !== 'add') || this.state.formLoading) {
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                if(values.taxableProject){
                    values.taxableProjectId =values.taxableProject.key;
                    values.taxableProjectName = values.taxableProject.label;
                    values.taxableProject = undefined;
                }

                let obj = Object.assign({}, this.state.record, {
                    ...values,
                    ...this.props && this.props.filters
                });
                let result,
                    sucessMsg;

                if (this.props.action === "modify") {
                    result = request.put(`/account/otherTax/deducted/collection/${this.props.beginType === '2' ? 'pc/' : ''}update`, obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    //obj.mainId = this.props.mainId;
                    result = request.post(`/account/otherTax/deducted/collection/${this.props.beginType === '2' ? 'pc/' : ''}add`, obj);
                    sucessMsg = '新增成功';
                }

                this.setState({ loading: true });
                result && result.then(({ data }) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({ loading: false, record: data.data, submited: true });
                        this.props.refreshTable();
                        this.hideModal();
                    } else {
                        this.setState({ loading: false });
                        message.error(data.msg, 4);
                    }
                })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ loading: false });
                    })
            }
        });
    }
    render() {
        const readonly = (this.props.action === 'look');
        let { record = {} } = this.state;
        const form = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "新增";
        } else if (this.props.action === "modify") {
            title = "编辑"
        }
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width='500px'
                style={{top:'15%'}}
                bodyStyle={{ maxHeight: 450, overflow: "auto" }}
                onCancel={() => { this.hideModal() }}
                footer={readonly?null:[
                    <Button key="back" onClick={() => { this.hideModal() }}>取消</Button>,
                    <Button key="submit" type="primary" loading={this.state.loading} onClick={() => { this.handleOk() }}>
                        确认
                    </Button>,
                ]}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {
                                getFields(form, [{
                                        span: '24',
                                        type: "taxableProject",
                                        fieldName: 'taxableProject',
                                        label: '应税项目',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.taxableProjectId && {key:record.taxableProjectId,label:record.taxableProjectName},
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `请选择应税项目`
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly
                                        },
                                    }

                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                        span: '24',
                                        label:'计税方法',
                                        fieldName:'taxMethod',
                                        type:'select',
                                        options:[
                                            {
                                                text:'一般计税方法',
                                                value:'1'
                                            },
                                            {
                                                text:'简易计税方法',
                                                value:'2'
                                            }
                                        ],
                                        formItemStyle:formItemLayout,
                                        fieldDecoratorOptions:{
                                            initialValue:record.taxMethod,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择计税方法'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly
                                        },
                                    }]
                                )
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                        span: '24',
                                        fieldName: 'amount',
                                        label: '金额',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.amount,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入金额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly,
                                            allowNegative:true,
                                        },
                                        type: 'numeric',
                                    }]
                                )
                            }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);