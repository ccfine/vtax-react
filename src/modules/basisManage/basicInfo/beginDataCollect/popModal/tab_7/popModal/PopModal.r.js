/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-23 10:15:07 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-25 16:02:36
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
        sm: { span: 14 },
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
                request.get(`/interEstateBuildCollection/find/${props.id}`).then(({ data }) => {
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

                if(values.project){
                    values.projectId = values.project.key;
                    values.projectName = values.project.label;
                    values.project = undefined;
                }

                if(values.stage){
                    values.stageId = values.stage.key;
                    values.stageName = values.stage.label;
                    values.stage = undefined;
                }

                let obj = Object.assign({id:this.state.record.id,mainId:this.state.record.mainId}, values);
                let result,
                    sucessMsg;

                if (this.props.action === "modify") {
                    result = request.put('/interEstateBuildCollection/update', obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    obj.mainId = this.props.mainId;
                    result = request.post('/interEstateBuildCollection/add', obj);
                    sucessMsg = '新增成功';
                }

                this.setState({ loading: true });
                result && result.then(({ data }) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({ loading: false, submited: true });
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
        const readonly = (this.props.action === 'look'),isModify =  (this.props.action === "modify") ;
        let { record = {} } = this.state;
        const form = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "新增";
        } else if (isModify) {
            title = "编辑"
        }
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width='600px'
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
                            {getFields(form, [{
                                    label: "项目名称",
                                    fieldName: "project",
                                    type: "asyncSelect",
                                    span:24,
                                    formItemStyle:formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.projectId && {key:record.projectId,label:record.projectName},
                                        rules: [
                                            {
                                                required: true,
                                                message: `请选择项目`
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        selectOptions:{
                                            labelInValue:true,
                                            disabled: readonly,
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: false,
                                        url: `/project/list/${this.props.mainId}`
                                    }
                                }]
                                )
                            }
                        </Row>
                        <Row>
                            {getFields(form, [{
                                    label: "项目分期",
                                    fieldName: "stage",
                                    type: "asyncSelect",
                                    span:24,
                                    formItemStyle:formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.stageId && {key:record.stageId,label:record.stageName},
                                        rules: [
                                            {
                                                required: true,
                                                message: `请选择项目分期`
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        selectOptions:{
                                            labelInValue:true,
                                            disabled: readonly ,
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: !record.projectId,
                                        fetchAble: (form.getFieldValue("project") && form.getFieldValue("project").key) || record.projectId,
                                        url: `/project/stages/${(form.getFieldValue("project") && form.getFieldValue("project").key) || record.projectId}`
                                    }
                                }])
                            }
                        </Row>
                        <Row>
                            {getFields(form, [{
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
                        
                        <Row>
                            {getFields(form, [{
                                        span: '24',
                                        fieldName: 'taxAmount',
                                        label: '税额',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.taxAmount,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请输入税额"
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