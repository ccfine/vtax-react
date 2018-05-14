import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request } from "../../../../../utils";
import moment from "moment";
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 }
    }
};
const setComItem = (
    initialValue,
    readonly = false,
    required = true,
    message
) => ({
    span: "12",
    type: "input",
    formItemStyle: formItemLayout,
    fieldDecoratorOptions: {
        initialValue,
        rules: [
            {
                required: required,
                message: message
            }
        ]
    },
    componentProps: {
        disabled: readonly
    }
});
class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        typelist: []
    };
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request
                    .get(`/account/income/taxout/find/${props.id}`)
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
                this.setState({ formLoading: false, record: {}, typelist: [] });
            }
        }
    }
    hideModal = () => {
        this.setState({ visible: false });
    };
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({ formLoading: false, record: {}, typelist: [] });
        this.props.hideModal();
    };
    handleOk() {
        if (
            (this.props.action !== "modify" && this.props.action !== "add") ||
            this.state.formLoading
        ) {
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                values.taxDate = values.taxDate.format("YYYY-MM-DD");
                //处理下拉数据
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                // 处理应税项目
                if (values.taxableItem) {
                    values.taxableItemId = values.taxableItem.key;
                    values.taxableItemName = values.taxableItem.label;
                    values.taxableItem = undefined;
                }
                // 处理转出项目
                if (values.outProject) {
                    values.outProjectId = values.outProject.key;
                    values.outProjectName = values.outProject.label;
                    values.outProject = undefined;
                }

                let obj = Object.assign({}, this.state.record, values);

                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put("/account/income/taxout/update", obj);
                    sucessMsg = "修改成功";
                } else if (this.props.action === "add") {
                    result = request.post("/account/income/taxout/add", obj);
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
        const readonly = this.props.action === "look";
        // const NotModifyWhenEdit = this.props.action === "modify";
        let { record = {} } = this.state;
        const form = this.props.form;
        let title = "查看";
        if (this.props.action === "add") {
            title = "新增";
        } else if (this.props.action === "modify") {
            title = "编辑";
        }
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width="700px"
                style={{ top: "10%" }}
                bodyStyle={{ maxHeight: "450px", overflow: "auto" }}
                onCancel={this.hideSelfModal}
                footer={[
                    <Button key="back" onClick={this.hideSelfModal}>
                        取消
                    </Button>,
                    readonly ? (
                        undefined
                    ) : (
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
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.mainId
                                            ? {
                                                  key: record.mainId,
                                                  label: record.mainName
                                              }
                                            : undefined,
                                        readonly,
                                        true,
                                        "请选择纳税主体"
                                    ),
                                    label: "纳税主体",
                                    fieldName: "main",
                                    type: "taxMain",
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: readonly
                                    }
                                },
                                {
                                    ...setComItem(
                                        record && record.taxableItemId
                                            ? {
                                                  label:
                                                      record.taxableItemName ||
                                                      "",
                                                  key:
                                                      record.taxableItemId || ""
                                              }
                                            : undefined,
                                        readonly,
                                        true,
                                        "请选择项目分期"
                                    ),
                                    label: "项目分期",
                                    fieldName: "taxableItem",
                                    type: "taxableProject",
                                    fieldDecoratorOptions: {
                                        initialValue:
                                            record && record.taxableItemId
                                                ? {
                                                      label:
                                                          record.taxableItemName ||
                                                          "",
                                                      key:
                                                          record.taxableItemId ||
                                                          ""
                                                  }
                                                : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择项目分期"
                                            }
                                        ]
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {
                            getFields(form, [
                                {
                                    ...setComItem(
                                        record.taxMethod,
                                        readonly,
                                        true,
                                        "请选择科目"
                                    ),
                                    label: "科目",
                                    fieldName: "taxMethod",
                                    type: "select",
                                    options: [
                                        { text: "一般计税方法", value: "1" },
                                        { text: "简易计税方法", value: "2" }
                                    ]
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.outTaxAmount,
                                        readonly,
                                        true,
                                        "请输入金额"
                                    ),
                                    label: "金额",
                                    fieldName: "outTaxAmount",
                                    type: "numeric"
                                },{
                                    ...setComItem(
                                        record.outTaxAmount,
                                        readonly,
                                        true,
                                        "请输入税率"
                                    ),
                                    label: "税率",
                                    fieldName: "outTaxAmount",
                                    type: "numeric"
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.outTaxAmount,
                                        readonly,
                                        true,
                                        "请输入税额"
                                    ),
                                    label: "税额",
                                    fieldName: "outTaxAmount",
                                    type: "numeric"
                                },{
                                    ...setComItem(
                                        record.outTaxAmount,
                                        readonly,
                                        true,
                                        "请输入价税合计"
                                    ),
                                    label: "价税合计",
                                    fieldName: "outTaxAmount",
                                    type: "numeric"
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
