/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import { Modal, Form,Button, message, Spin, Row } from 'antd'
import { getFields, request } from 'utils'
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

class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        submited: false
    }
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request.get(`/contract/land/find/${props.id}`).then(({ data }) => {
                    if (data.code === 200) {
                        this.setState({ formLoading: false, record: data.data, submited: false });
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
        this.setState({ record: {}, submited: false });
    }
    handleOk() {
        if ((this.props.action !== 'modify' && this.props.action !== 'add') || this.state.formLoading) {
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                values.signingDate = values.signingDate.format('YYYY-MM-DD');

                let obj = Object.assign({}, this.state.record, values);
                let result,
                    sucessMsg,
                    isModify = (this.props.action === "modify" || (this.state.submited && this.props.action === "add"));

                if (isModify) {
                    result = request.put('/contract/land/update', obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    obj.mainId = this.props.mainId;
                    result = request.post('/contract/land/add', obj);
                    sucessMsg = '新增成功，点击【附件信息】进行文件上传';
                }

                this.setState({ loading: true });
                result && result.then(({ data }) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({ loading: false, record: data.data, submited: true });
                        this.props.refreshTable();
                        // 编辑成功关闭Modal，新增成功不关闭-提醒是否进行附件上传
                        if (isModify) {
                            this.hideModal();
                        }
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
        const NotModifyWhen = (this.props.action === 'modify');
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
                style={{top:'5%'}}
                bodyStyle={{ maxHeight: 450, overflow: "auto" }}
                onCancel={() => { this.hideModal() }}
                footer={[
                    record && record.id
                    &&
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
                                        type: 'input',
                                        fieldName: 'contractNum',
                                        label: '应税项目名称',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.contractNum,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `请输入合同编号`
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly || NotModifyWhen
                                        },
                                    }

                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                        span: '24',
                                        type: 'input',
                                        fieldName: 'parcelNum',
                                        label: '计税方法',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.parcelNum,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `请输入宗地编号`
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
                                        fieldName: 'landPrice',
                                        label: '金额',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.landPrice,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入金额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly
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