import React, { Component } from 'react'
import { Modal, Form, Input, Col, Button, message, Spin, Row } from 'antd'
import { getFields, request } from '../../../../../../../utils'
import { ButtonWithFileUploadModal } from '../../../../../../../compoments'
import moment from 'moment';
const { TextArea } = Input;
const FormItem = Form.Item;
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
                });
            } else {
                this.setState({ formLoading: false, record: {} });
                this.props.form.resetFields();
            }
        }
    }
    hideModal() {
        this.props.hideModal();
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
                    obj.projectId = this.props.projectid;
                    result = request.post('/contract/land/add', obj);
                    sucessMsg = '新增成功，点击【附件信息】进行文件上传';
                }

                this.setState({ loading: true });
                result && result.then(({ data }) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({ loading: false, record: data.data, submited: true });
                        this.props.update();
                        // 修改成功关闭Modal，新增成功不关闭-提醒是否进行附件上传
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
        const form = this.props.form,
            { getFieldDecorator } = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "添加";
        } else if (this.props.action === "modify") {
            title = "修改"
        }
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width='700px'
                bodyStyle={{ maxHeight: "500px", overflow: "auto" }}
                onCancel={() => { this.hideModal() }}
                footer={[
                    record && record.id
                        && <ButtonWithFileUploadModal
                            title="附件信息"
                            style={{
                                marginRight:10
                            }}
                            readOnly = {readonly}
                            size='default'
                            id={record.id}
                            uploadUrl={`/contract/land/file/upload/${record.id}`}
                        />,
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
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'contractNum',
                                    label: '合同编号',
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
                                },
                                {
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'parcelNum',
                                    label: '宗地编号',
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
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'transferor',
                                    label: '出让人',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.transferor,
                                        rules: [
                                            {
                                                required: true,
                                                message: `请输入出让人`
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                },
                                {
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'assignee',
                                    label: '受让人',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.assignee,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入受让人'
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
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'acquireWay',
                                    label: '取得方式',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.acquireWay,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入取得方式'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                },
                                {
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'projectType',
                                    label: '项目类型',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.projectType,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入项目类型'
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
                                    span: '12',
                                    type: 'input',
                                    fieldName: 'position',
                                    label: '宗地位置',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.position,
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                },
                                {
                                    span: '12',
                                    fieldName: 'landAgeLimit',
                                    label: '土地年限',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.landAgeLimit,
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'numeric'
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    span: '12',
                                    fieldName: 'landPrice',
                                    label: '土地价款',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.landPrice,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入土地价款'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'numeric',
                                },
                                {
                                    span: '12',
                                    fieldName: 'landArea',
                                    label: '土地面积（㎡）',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.landArea,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入土地面积（㎡）'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'numeric',
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    span: '12',
                                    fieldName: 'coveredArea',
                                    label: '建筑面积（㎡）',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.coveredArea,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入建筑面积（㎡）'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'numeric',
                                },
                                {
                                    span: '12',
                                    fieldName: 'plotRatio',
                                    label: '容积率',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.plotRatio,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入容积率'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'numeric',
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    span: '12',
                                    fieldName: 'signingDate',
                                    label: '合同签订日期',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: moment(record.signingDate),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择合同签订日期'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    type: 'datePicker',
                                }])
                            }
                        </Row>
                        <Row>
                            <Col span={16}>
                                <FormItem label="备注" labelCol={{
                                    xs: { span: 12 },
                                    sm: { span: 6 },
                                }}
                                    wrapperCol={{
                                        xs: { span: 12 },
                                        sm: { span: 18 },
                                    }}>
                                    {getFieldDecorator('remark', { initialValue: record.remark })(<TextArea disabled={readonly} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);