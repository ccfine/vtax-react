import React, { Component } from 'react'
import { Modal, Form, Button, message, Spin, Row } from 'antd'
import { getFields, request } from 'utils'
import {ButtonWithFileUploadModal} from 'compoments'
import moment from 'moment'
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
        visible: false
    }
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request.get(`/other/file/find/${props.id}`).then(({ data }) => {
                    if (data.code === 200) {
                        this.setState({ formLoading: false, record: data.data });
                    }
                })
                .catch(err => {
                    this.setState({formLoading:false});
                    message.error(err.message)
                });
            } else {
                this.props.form.resetFields();
                this.setState({ formLoading: false, record: {}});
            }
        }
    }
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {}});
        this.props.hideModal();
    }
    showConfirm = ()=> {
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                this.deleteRecord();
                modalRef && modalRef.destroy();
            },
            onCancel() {
                modalRef.destroy()
            },
        });
      }
    deleteRecord = (record = this.state.record) =>{
        return request.delete(`/other/file/delete/${record.id}`).then(({ data }) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.hideSelfModal();
                this.props.update && this.props.update();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
            message.error(err.message);
        })
    }
    handleOk() {
        if ((this.props.action !== 'modify' && this.props.action !== 'add') || this.state.formLoading) {
            this.hideSelfModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                if(values.fileDate){
                    values.fileDate = values.fileDate.format('YYYY-MM-DD');
                }
                //处理下拉数据
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }

                let obj = Object.assign({}, this.state.record, values);

                let result,
                    sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put('/other/file/update', obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    result = request.post('/other/file/add', obj);
                    sucessMsg = '新增成功';
                }

                this.setState({ loading: true });
                result && result.then(({ data }) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({ loading: false });
                        this.props.update && this.props.update();
                        this.props.hideModal();
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
        let buttons = [];

        record && record.id
        && buttons.push(<ButtonWithFileUploadModal
            title="附件信息"
            style={{
                marginRight:10
            }}
            readOnly = {readonly}
            size='default'
            id={record.id}
            key="fileInfo"
            uploadUrl={`/other/file/file/upload/${record.id}`}
        />)

        this.props.action !== "look"
        && buttons.push(<Button
            key="submit"
            type="primary"
            loading={this.state.loading}
            onClick={() => { this.handleOk() }}>保存</Button>)
        this.props.action !== "look"
        && buttons.push(<Button
            key="back"
            onClick={this.hideSelfModal}>取消</Button>)
        this.props.action === "modify"
        && buttons.push(<Button
            type="danger"
            key="delete"
            onClick={this.showConfirm}>删除</Button>)
        this.props.action === "look"
        && buttons.push(<Button
            key="close"
            onClick={this.hideSelfModal}>关闭</Button>)

        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width='650px'
                bodyStyle={{ maxHeight: "400px", overflow: "auto" }}
                onCancel={this.hideSelfModal}
                footer={buttons}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {
                                getFields(form, [{
                                    span: '12',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.mainId ? { key: record.mainId, label: record.mainName } : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择纳税主体'
                                            }
                                        ]
                                    },
                                    label: '纳税主体',
                                    fieldName: 'main',
                                    type: 'taxMain',
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: readonly
                                    }
                                },{
                                    span: '12',
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.fileType,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入归档类型'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    },
                                    label: '归档类型',
                                    fieldName: 'fileType',
                                    type: 'input',
                                }
                                ])
                            }
                        </Row>

                        <Row>
                            {
                                getFields(form, [{
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: moment(record.fileDate),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择归档日期'
                                            }
                                        ]
                                    },
                                    label: '归档日期',
                                    fieldName: 'fileDate',
                                    type: 'datePicker',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    fieldDecoratorOptions: {
                                        initialValue: record.fileName
                                    },
                                    formItemStyle: {
                                        labelCol: {
                                            xs: { span: 6 },
                                            sm: { span: 4 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 18 },
                                            sm: { span: 16 },
                                        },
                                    },
                                    span: 24,
                                    label: '归档资料名称',
                                    fieldName: 'fileName',
                                    type: 'input',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                ])
                            }
                        </Row>
                        <Row>
                        {
                                getFields(form, [{
                                    fieldDecoratorOptions: {
                                        initialValue: record.fileContent
                                    },
                                    formItemStyle: {
                                        labelCol: {
                                            xs: { span: 6 },
                                            sm: { span: 4 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 18 },
                                            sm: { span: 16 },
                                        },
                                    },
                                    span: 24,
                                    label: '归档资料主要内容',
                                    fieldName: 'fileContent',
                                    type: 'textArea',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                }
                                ])
                            }
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
