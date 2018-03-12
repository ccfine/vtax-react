import React, { Component } from 'react'
import { Modal, Form, Button, message, Spin, Row, Divider } from 'antd'
import { getFields, request } from '../../../../../utils'
import moment from 'moment'
const confirm = Modal.confirm;
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
                request.get(`/report/get/${props.id}`).then(({ data }) => {
                    if (data.code === 200) {
                        this.setState({ formLoading: false, record: data.data });
                    }
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
        let _self = this;
        confirm({
          title: '是否确定删除该项?',
          content: '点击确定删除',
          onOk() {
            return _self.deleteRecord()
          },
          onCancel() {},
        });
      }
    deleteRecord = (record = this.state.record) =>{
        return request.delete(`/report/delete/${record.id}`).then(({ data }) => {
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
                values.checkImplementStart = values.checkImplementDate[0].format('YYYY-MM-DD');
                values.checkImplementEnd = values.checkImplementDate[1].format('YYYY-MM-DD');
                values.checkImplementDate = undefined;

                values.checkStart = values.checkDate[0].format('YYYY-MM-DD');
                values.checkEnd = values.checkDate[1].format('YYYY-MM-DD');
                values.checkDate = undefined;

                if(values.closingTime){
                    values.closingTime = values.closingTime.format('YYYY-MM-DD');
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
                    result = request.put('/report/update', obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    result = request.post('/report/save', obj);
                    sucessMsg = '添加成功';
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
            title = "添加";
        } else if (this.props.action === "modify") {
            title = "修改"
        }
        let buttons = [];
        buttons.push(<Button key="submit" type="primary" loading={this.state.loading} onClick={() => { this.handleOk() }}>保存</Button>)
        this.props.action === "modify" 
        && buttons.push(<Button type="danger" key="delete" onClick={this.showConfirm}>删除</Button>)
        buttons.push(<Button key="back" onClick={this.hideSelfModal}>取消</Button>)
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width='750px'
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
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        span: '12',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.checkSets,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入检查组'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: readonly
                                        },
                                        label: '检查组',
                                        fieldName: 'checkSets',
                                        type: 'input',
                                    },
                                    {
                                        label: '检查类型',
                                        fieldName: 'checkType',
                                        type: 'asyncSelect',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.checkType,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择检查类型'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            selectOptions:{
                                                // labelInValue:true,
                                                disabled:readonly,
                                            },
                                            fieldTextName:'name',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:false,
                                            fetchAble:!readonly,
                                            url:`/sys/dict/listBaseInfo/JCXX_JCLX`,
                                        }
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
                                        initialValue: [moment(record.checkStart),moment(record.checkEnd)],
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择检查时间起止'
                                            }
                                        ]
                                    },
                                    label: '检查时间起止',
                                    fieldName: 'checkDate',
                                    type: 'rangePicker',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: [moment(record.checkImplementStart),moment(record.checkImplementEnd)],
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择检查实施时间起止'
                                            }
                                        ]
                                    },
                                    label: '检查实施时间起止',
                                    fieldName: 'checkImplementDate',
                                    type: 'rangePicker',
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
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.documentNum,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入文档编号'
                                            }
                                        ]
                                    },
                                    label: '文档编号',
                                    fieldName: 'documentNum',
                                    type: 'input',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                }
                                ])
                            }
                        </Row>
                        <Row> 
                            <Divider dashed style={{fontSize: 12,color: 'grey',marginBottom:30}}>未结案项目</Divider>
                        </Row>
                        <Row>
                            {
                                getFields(form, [{
                                    fieldDecoratorOptions: {
                                        initialValue: record.issue
                                    },
                                    formItemStyle: {
                                        labelCol: {
                                            xs: { span: 6 },
                                            sm: { span: 4 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 18 },
                                            sm: { span: 12 },
                                        },
                                    },
                                    span: 24,
                                    label: '主要争议点',
                                    fieldName: 'issue',
                                    type: 'textArea',
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
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.closingTime?moment(record.closingTime):undefined
                                    },
                                    label: '预计结案时间',
                                    fieldName: 'closingTime',
                                    type: 'datePicker',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                }
                                ])
                            }
                        </Row>
                        <Row>
                            <Divider dashed style={{fontSize: 12,color: 'grey',marginBottom:30}}>已结案项目（金额单位：元）</Divider>
                        </Row>
                        <Row>
                        {
                                getFields(form, [{
                                    fieldDecoratorOptions: {
                                        initialValue: record.checkItems
                                    },
                                    formItemStyle: {
                                        labelCol: {
                                            xs: { span: 6 },
                                            sm: { span: 4 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 18 },
                                            sm: { span: 12 },
                                        },
                                    },
                                    span: 24,
                                    label: '查补事项',
                                    fieldName: 'checkItems',
                                    type: 'textArea',
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
                                        initialValue: record.taxPayment
                                    },
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    label: '补缴税款',
                                    fieldName: 'taxPayment',
                                    type: 'numeric',
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    fieldDecoratorOptions: {
                                        initialValue: record.lateFee
                                    },
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    label: '滞纳金',
                                    fieldName: 'lateFee',
                                    type: 'numeric',
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
                                        initialValue: record.fine
                                    },
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    label: '罚款',
                                    fieldName: 'fine',
                                    type: 'numeric',
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
                                        initialValue: record.remark
                                    },
                                    formItemStyle: {
                                        labelCol: {
                                            xs: { span: 6 },
                                            sm: { span: 4 },
                                        },
                                        wrapperCol: {
                                            xs: { span: 18 },
                                            sm: { span: 12 },
                                        },
                                    },
                                    span: 24,
                                    label: '备注',
                                    fieldName: 'remark',
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