/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-11 10:25:44 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-11 10:51:11
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request,setFormat } from "utils";
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
    }
};

class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        commonlyTaxRateList:[],
        simpleTaxRateList:[],
    };
    componentWillReceiveProps(props) {
        if(!props.visible){
            /**
             * 关闭的时候清空表单
             * */
            props.form.resetFields();
            this.setState({
                record:{},
                commonlyTaxRateList:[],
                simpleTaxRateList:[],

            })
        }
        if (props.visible && this.props.visible !== props.visible) {
            this.fetchTypeList()
            if (props.id) {
                this.setState({ formLoading: true });
                request
                    .get(`/incomeAndTaxRateCorrespondence/find/${props.id}`)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            this.setState({
                                formLoading: false,
                                record: data.data
                            });
                        }
                    })
                    .catch(err => {
                        this.setState({ formLoading: false });
                        message.error(err.message);
                    });
            } else {
                this.props.form.resetFields();
                this.setState({ formLoading: false, record: {} });
            }
        }
    }
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {} });
        this.props.hideModal();
    };
    showConfirm = () => {
        const modalRef = Modal.confirm({
            title: "友情提醒",
            content: "该删除后将不可恢复，是否删除？",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
                this.deleteRecord();
            },
            onCancel() {
                modalRef.destroy();
            }
        });
    };
    deleteRecord = (record = this.state.record) => {
        return request
            .delete(`/incomeAndTaxRateCorrespondence/delete/${record.id}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    message.success("删除成功", 4);
                    this.hideSelfModal();
                    this.props.update && this.props.update();
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    };
    handleOk() {
        if (
            (this.props.action !== "modify" && this.props.action !== "add") ||
            this.state.formLoading
        ) {
            this.hideSelfModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let obj = Object.assign({}, this.state.record, values);

                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put("/incomeAndTaxRateCorrespondence/update", obj);
                    sucessMsg = "编辑成功";
                } else if (this.props.action === "add") {
                    result = request.post("/incomeAndTaxRateCorrespondence/add", obj);
                    sucessMsg = "增加成功";
                }

                this.setState({ loading: true });
                result &&
                result
                    .then(({ data }) => {
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
                    });
            }
        });
    }
    fetchTypeList=()=>{
        // 0 非房地产 1 房地产
        request.get(`sys/taxrate/list/commonlyTaxRate/0`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    commonlyTaxRateList:setFormat(data.data),
                });
            }
        })
            .catch(err => {
                message.error(err.message)
            })

        request.get(`sys/taxrate/list/simpleTaxRate/0`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    simpleTaxRateList:setFormat(data.data),
                });
            }
        })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentDidMount(){
        this.fetchTypeList()
    }

    render() {
        const readonly = this.props.action === "look";
        let { record = {} } = this.state;
        const form = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "新增";
        } else if (this.props.action === "modify") {
            title = "编辑";
        }
        let buttons = [];

        this.props.action !== "look" &&
        buttons.push(
            <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={() => {
                    this.handleOk();
                }}
            >
                保存
            </Button>
        );
        this.props.action !== "look" &&
        buttons.push(
            <Button key="back" onClick={this.hideSelfModal}>
                取消
            </Button>
        );
        this.props.action === "modify" &&
        buttons.push(
            <Button type="danger" key="delete" onClick={this.showConfirm}>
                删除
            </Button>
        );
        this.props.action === "look" &&
        buttons.push(
            <Button key="close" onClick={this.hideSelfModal}>
                关闭
            </Button>
        );
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width="500px"
                bodyStyle={{ maxHeight: "420px", overflow: "auto" }}
                style={{top:'5%'}}
                onCancel={this.hideSelfModal}
                footer={buttons}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {getFields(form, [
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.code,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入科目代码"
                                            }
                                        ]
                                    },
                                    label: "科目代码",
                                    fieldName: "code",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:'科目代码（末级明细科目）'
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.parentName,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入一级科目"
                                            }
                                        ]
                                    },
                                    label: "一级科目",
                                    fieldName: "parentName",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.name,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入二级科目"
                                            }
                                        ]
                                    },
                                    label: "二级科目",
                                    fieldName: "name",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:'请输入二级科目（对应收入类型）'
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.accountingEntries
                                    },
                                    label: "辅助核算项",
                                    fieldName: "accountingEntries",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:readonly?' ':'请输入辅助核算项'
                                    }
                                },
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.noTaxMethod,
                                        onChange:(e)=>{
                                            this.setState({record:{...record,noTaxMethod:e.target.checked}})
                                        },
                                        valuePropName: 'checked',
                                    },
                                    label: "不区分计税方法",
                                    fieldName: "noTaxMethod",
                                    type: "checkbox",
                                    componentProps: {
                                        disabled: readonly,
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    label:'一般计税税率',
                                    fieldName:'commonlyTaxRateId',
                                    type:'select',
                                    span:24,
                                    formItemStyle: formItemLayout,
                                    options:this.state.commonlyTaxRateList,
                                    componentProps:{
                                        allowClear:true,
                                        disabled: readonly,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:record.commonlyTaxRateId,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择一般税率"
                                            }
                                        ]
                                    },
                                }
                            ])}
                        </Row>
                        <Row>
                            {!record.noTaxMethod && getFields(form, [
                                {
                                    label:'简易计税税率',
                                    fieldName:'simpleTaxRateId',
                                    type:'select',
                                    span:24,
                                    formItemStyle: formItemLayout,
                                    options:this.state.simpleTaxRateList,
                                    componentProps:{
                                        allowClear:true,
                                        disabled: readonly,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue: record.simpleTaxRateId,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择简易征收率"
                                            }
                                        ]
                                    },
                                }
                            ])}
                        </Row>
                        {/*<Row>
                         {getFields(form, [
                         {
                         span: 24,
                         formItemStyle: formItemLayout,
                         fieldDecoratorOptions: {
                         initialValue: record.commonlyTaxRate,
                         rules: [
                         {
                         required: true,
                         message: "请输入一般税率"
                         },{
                         pattern:/^100$|^\d{0,2}$/,
                         message:"请输入0~100之间的数字"
                         }
                         ]
                         },
                         label: "一般税率（%）",
                         fieldName: "commonlyTaxRate",
                         type: "numeric",
                         componentProps: {
                         allowNegative:false,
                         valueType:'int',
                         disabled: readonly,
                         placeholder:'请输入一般税率（单位：%）'
                         }
                         }
                         ])}
                         </Row>
                         <Row>
                         {!record.noTaxMethod && getFields(form, [
                         {
                         span: 24,
                         formItemStyle: formItemLayout,
                         fieldDecoratorOptions: {
                         initialValue: record.simpleTaxRate,
                         rules: [
                         {
                         required: true,
                         message: "请输入简易征收率"
                         },{
                         pattern:/^100$|^\d{0,2}$/,
                         message:"请输入0~100之间的数字"
                         }
                         ]
                         },
                         label: "简易征收率（%）",
                         fieldName: "simpleTaxRate",
                         type: "numeric",
                         componentProps: {
                         allowNegative:false,
                         valueType:'int',
                         disabled: readonly,
                         placeholder:readonly?' ':'请输入简易征收率（单位：%）'
                         }
                         }
                         ])}
                         </Row>*/}
                        <Row>
                            {getFields(form, [
                                {
                                    span: 24,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.taxItem
                                    },
                                    label: "税目",
                                    fieldName: "taxItem",
                                    type: "input",
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder:readonly?' ':'请输入税目'
                                    }
                                }
                            ])}
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
