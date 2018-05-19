/**
 * Created by liuliyuan on 2018/5/16
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request, requestDict,setFormat } from "utils";
import moment from 'moment';
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 14 },
    },
};
class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        reduceNameList:[],

    };
    componentDidMount(){
        //减免税性质代码：从数据字典中取出JMS 根据代码获取和类型
        requestDict('JMS',result=>{
            this.setState({
                reduceNameList : setFormat(result)
            })
        });
    }
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request
                    .get(`/account/other/reduceTaxDetail/find/${props.id}`)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            this.setState({
                                formLoading: false,
                                record: data.data
                            });
                        }
                    })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ formLoading: false });
                    });
            } else {
                this.props.form.resetFields();
                this.setState({ formLoading: false, record: {} });
            }
        }
    }
    hideModal = () => {
        this.setState({ visible: false });
    };
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {} });
        this.props.hideModal();
    };
    handleOk() {
        if ((this.props.action !== "modify" && this.props.action !== "add") ||  this.state.formLoading ) {
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                if (values.monthDate) {
                    values.monthDate = values.monthDate.format('YYYY-MM-DD');
                }
                values.incomeTaxAuth = values.incomeTaxAuth === true ? 1 : 0;
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                if(values.reduce){
                    values.sysDictId = values.reduce.key;
                    values.reduceName = values.reduce.label;
                    values.reduce = undefined;
                }
                let obj = Object.assign({}, this.state.record, values);

                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put("/account/other/reduceTaxDetail/update", obj);
                    sucessMsg = "修改成功";
                } else if (this.props.action === "add") {
                    result = request.post("/account/other/reduceTaxDetail/add",obj);
                    sucessMsg = "添加成功";
                }

                this.setState({ loading: true, formLoading: true });
                result &&
                    result
                        .then(({ data }) => {
                            if (data.code === 200) {
                                message.success(sucessMsg, 4);
                                this.props.update && this.props.update();
                                this.props.hideModal();
                            } else {
                                message.error(data.msg, 4);
                            }
                            this.setState({
                                loading: false,
                                formLoading: false
                            });
                        })
                        .catch(err => {
                            message.error(err.message);
                            this.setState({
                                loading: false,
                                formLoading: false
                            });
                        });
            }
        });
    }
    render() {
        let { record = {}, reduceNameList} = this.state;
        const form = this.props.form;
        let title='';
        const disabled = this.props.action === "look";
        let shouldShowDefaultData = false;
        const type = this.props.action;
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'modify':
                title = '编辑';
                shouldShowDefaultData = true;
                break;
            case 'look':
                title = '查看';
                shouldShowDefaultData = true;
                break;
            default:
                title = '新增';
                break;
        }

        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width="800px"
                style={{ top: "10%" }}
                bodyStyle={{ maxHeight: "450px", overflow: "auto" }}
                onCancel={this.hideSelfModal}
                footer={[
                    <Button key="back" onClick={this.hideSelfModal}>
                        取消
                    </Button>,
                    !disabled && (
                        <Button
                            key="submit"
                            type="primary"
                            loading={this.state.loading}
                            onClick={() => {
                                this.handleOk();
                            }}
                        >
                            确认
                        </Button>
                    )
                ]}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {
                                getFields(form, [{
                                        label: '纳税主体',
                                        fieldName: 'main',
                                        type: 'taxMain',
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
                                        componentProps: {
                                            labelInValue: true,
                                            disabled
                                        }
                                    },{
                                        label: '减税性质名称',
                                        fieldName: 'reduce',
                                        type: 'select',
                                        span: 12,
                                        options: reduceNameList,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.sysDictId ? { key: record.sysDictId, label: record.reduceName } : undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入减税性质名称'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            labelInValue: true,
                                            disabled
                                        },
                                    }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        label: '凭证号',
                                        fieldName: 'voucherNum',
                                        type: 'input',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.voucherNum,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入凭证号'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        },
                                    },{
                                        label: '日期',
                                        fieldName: 'monthDate',
                                        type: 'datePicker',
                                        componentProps: {
                                            disabled
                                        },
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: shouldShowDefaultData ? moment(record.monthDate, 'YYYY-MM-DD') : undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入日期'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        label: '金额',
                                        fieldName: 'amount',
                                        type: 'numeric',
                                        span: 12,
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
                                            disabled
                                        },
                                    }, {
                                        label: '税额',
                                        fieldName: 'taxAmount',
                                        type: 'numeric',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.taxAmount,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入税额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                        },
                                    },
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        label: '减免税金额',
                                        fieldName: 'reduceTaxAmount',
                                        type: 'numeric',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.reduceTaxAmount,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入减免税金额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        },
                                    }, {
                                        label: '进项税额是否认证抵扣',
                                        fieldName: 'incomeTaxAuth',
                                        type: 'checkbox',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: parseInt(record.incomeTaxAuth,0) === 1,
                                            valuePropName: 'checked',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入税额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                        },
                                    },
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
