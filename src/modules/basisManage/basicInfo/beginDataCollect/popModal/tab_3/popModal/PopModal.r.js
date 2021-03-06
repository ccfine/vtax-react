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
                request.get(`/taxReliefProjectCollection/${this.props.beginType === '2' ? 'pc/' : ''}find/${props.id}`).then(({ data }) => {
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
                //
                if(values.project){
                    values.name = values.project.label;
                    values.num = values.project.key;
                    delete values.project
                }
                let obj = Object.assign({}, this.state.record, {
                    ...this.props && this.props.filters,
                    ...values,
                });
                console.log(obj, this.props && this.props.filters)
                let result,
                    sucessMsg;

                if (this.props.action === "modify") {
                    result = request.put(`/taxReliefProjectCollection/${this.props.beginType === '2' ? 'pc/' : ''}update`, obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    //obj.mainId = this.props.mainId;
                    result = request.post(`/taxReliefProjectCollection/${this.props.beginType === '2' ? 'pc/' : ''}add`, obj);
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
                        {/*<Row>
                            {getFields(form, [{
                                label: "利润中心",
                                fieldName: "profitCenterId",
                                type: "asyncSelect",
                                span: 24,
                                formItemStyle: formItemLayout,
                                componentProps: {
                                    //disabled:readonly,
                                    selectOptions: {
                                        disabled:readonly,
                                        //labelInValue: true
                                    },
                                    fieldTextName: "profitName",
                                    fieldValueName: "id",
                                    fetchAble: filters && filters.mainId,
                                    url: `/taxsubject/profitCenterList/${filters && filters.mainId}`
                                },
                                fieldDecoratorOptions: {
                                    initialValue:(filters && filters.profitCenterId) || record.profitCenterId || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择利润中心'
                                        }
                                    ]
                                },
                            }
                            ])}
                        </Row>*/}
                        <Row>
                            {
                                getFields(form, [{
                                    label: "减免税项目",
                                    fieldName: "project",
                                    type: "asyncSelect",
                                    span:24,
                                    formItemStyle: formItemLayout,
                                    componentProps: {
                                        fieldTextName: "name",
                                        fieldValueName: "code",
                                        doNotFetchDidMount: false,
                                        url: `/sys/dict/listBaseInfo/JMS`,
                                        selectOptions:{
                                            disabled: readonly,
                                            labelInValue:true,
                                            onChange:(val,option,item)=>{
                                                this.props.form.setFieldsValue({description:item.description})
                                            }
                                        }
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: record.num && {key:record.num,label:record.name},
                                        rules: [
                                            {
                                                required: true,
                                                message: `请选择减免税项目`
                                            }
                                        ]
                                    }
                                }])
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
                        <Row>
                            {
                                getFields(form, [{
                                        span: '24',
                                        fieldName: 'description',
                                        label: '减免税描述',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.description,
                                        },
                                        componentProps: {
                                            disabled: true,
                                            rows:8,
                                        },
                                        type: 'textArea',
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