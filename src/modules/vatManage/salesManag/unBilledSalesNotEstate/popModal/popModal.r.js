/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-15 16:12:23 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-06 17:18:22
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request } from "../../../../../utils";
import {connect} from 'react-redux'
import moment from 'moment';
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
                    .get(`/account/notInvoiceUnSale/realty/find/${props.id}`)
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
                values.month = values.month.format('YYYY-MM');
                //处理下拉数据
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                // 处理应税项目
                if (values.project) {
                    values.projectId = values.project.key;
                    values.projectName = values.project.label;
                    values.project = undefined;
                }
                // 处理转出项目
                if (values.stages) {
                    values.stagesId = values.stages.key;
                    values.stagesName = values.stages.label;
                    values.stages = undefined;
                }

                let obj = Object.assign({}, this.state.record, values);

                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put(
                        "/account/notInvoiceUnSale/realty/update",
                        obj
                    );
                    sucessMsg = "修改成功";
                } else if (this.props.action === "add") {
                    result = request.post(
                        "/account/notInvoiceUnSale/realty/add",
                        obj
                    );
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
        let { record = {} } = this.state,
            {declare,form} = this.props;
        const { getFieldValue } = form;
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
                                            : (declare?{key:declare.mainId}:undefined),
                                        readonly || !!declare,
                                        true,
                                        "请选择纳税主体"
                                    ),
                                    label: "纳税主体",
                                    fieldName: "main",
                                    type: "taxMain",
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: readonly || !!declare,
                                    }
                                },{
                                    ...setComItem(
                                        (record.month && moment(record.month)) || (declare && declare.authMonth && moment(declare.authMonth)),
                                        readonly || !!declare,
                                        true,
                                        "请选择期间"
                                    ),
                                    label: "期间",
                                    fieldName: "month",
                                    type: "monthPicker"
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record && record.projectId
                                            ? {
                                                  label:
                                                      record.projectName ||
                                                      "",
                                                  key:
                                                      record.projectId || ""
                                              }
                                            : undefined,
                                        readonly,
                                        true,
                                        "请选择项目"
                                    ),
                                    label: "项目",
                                    fieldName: "project",
                                    type: "asyncSelect",
                                    span: 12,
                                    componentProps: {
                                        disabled:readonly,
                                        selectOptions: {
                                            disabled:readonly,
                                            labelInValue: true
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: !declare,
                                        fetchAble:
                                            (getFieldValue("main") &&
                                            getFieldValue("main").key) || (record && record.mainId),
                                        url: `/project/list/${(getFieldValue("main") && getFieldValue("main").key) || (record && record.mainId) ||
                                        (declare && declare.mainId)}`
                                    }
                                },
                                {
                                    ...setComItem(
                                        record && record.stagesId
                                            ? {
                                                  label:
                                                      record.stagesName ||
                                                      "",
                                                  key:
                                                      record.stagesId || ""
                                              }
                                            : undefined,
                                        readonly,
                                        true,
                                        "请选择项目分期"
                                    ),
                                    label: "项目分期",
                                    fieldName: "stages",
                                    type: "asyncSelect",
                                    span: 12,
                                    componentProps: {
                                        disabled:readonly,
                                        selectOptions: {
                                            disabled:readonly,
                                            labelInValue: true
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: true,
                                        fetchAble:
                                            (getFieldValue("project") &&
                                            getFieldValue("project").key) || (record && record.projectId),
                                        url: `/project/stages/${(getFieldValue(
                                            "project"
                                        ) &&
                                            getFieldValue("project").key) || (record && record.projectId) ||
                                            ""}`
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.creditSubjectCode,
                                        readonly,
                                        true,
                                        "请输入科目代码"
                                    ),
                                    label: "科目代码",
                                    fieldName: "creditSubjectCode"
                                },
                                {
                                    ...setComItem(
                                        record.creditSubjectName,
                                        readonly,
                                        true,
                                        "请输入科目名称"
                                    ),
                                    label: "科目名称",
                                    fieldName: "creditSubjectName"
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.creditAmount,
                                        readonly,
                                        true,
                                        "请输入金额"
                                    ),
                                    label: "金额",
                                    fieldName: "creditAmount",
                                    type: "numeric"
                                },
                                {
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue:record.taxRate,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入税率'
                                            },{
                                                pattern:/^100$|^\d{0,2}$/,
                                                message:"请输入0~100之间的数字"
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly,
                                        placeholder: "请输入税率（单位：%）"
                                    },
                                    label: "税率（%）",
                                    fieldName: "taxRate",
                                    type: "numeric",
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [
                                {
                                    ...setComItem(
                                        record.taxAmount,
                                        readonly,
                                        true,
                                        "请输入税额"
                                    ),
                                    label: "税额",
                                    fieldName: "taxAmount",
                                    type: "numeric"
                                },
                                {
                                    ...setComItem(
                                        record.totalAmount,
                                        readonly,
                                        true,
                                        "请输入价税合计"
                                    ),
                                    label: "价税合计",
                                    fieldName: "totalAmount",
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

export default connect(state=>({
    declare:state.user.get('declare')
}))(Form.create()(PopModal));
