import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row,Col } from "antd";
import { getFields, request } from "utils";
import moment from "moment";
import {connect} from 'react-redux';
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
    /*disabledDate = (value)=>{
        let {declare} = this.props;
        if(declare && declare.authMonth){
            return moment(declare.authMonth).format('YYYY-MM') !== value.format('YYYY-MM');
        }else{
            return false;
        }
    }*/
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
                // 处理月份
                values.taxDate = values.taxDate.format("YYYY-MM");
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

        let {declare} = this.props;
        return (
            <Modal
                title={title}
                visible={this.props.visible}
                width="700px"
                style={{ top: "10%" }}
                bodyStyle={{ maxHeight: "450px", overflow: "auto" }}
                onCancel={this.hideSelfModal}
                footer={
                    !readonly && <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button key="back" onClick={this.hideSelfModal}> 取消 </Button>
                            <Button key="submit" type="primary" loading={this.state.loading}
                                onClick={() => {
                                    this.handleOk();
                                }}
                            >
                                确认
                            </Button>
                        </Col>
                    </Row>
                }
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {getFields(form, [{
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    label: "纳税主体",
                                    fieldName: "main",
                                    type: "taxMain",
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: readonly || !!declare
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record.mainId
                                        ? {
                                              key: record.mainId,
                                              label: record.mainName
                                          }
                                        : (declare && declare.mainId) ? {key:declare.mainId} :undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择纳税主体'
                                            }
                                        ]
                                    },
                                },
                                {
                                    label: "应税项目",
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    fieldName: "taxableItem",
                                    type: "taxableProject",
                                    componentProps: {
                                        disabled: readonly
                                    },
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
                                                message: "请选择应税项目"
                                            }
                                        ]
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {//1一般计税方法，2简易计税方法 ,
                            getFields(form, [{
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    label: "计税方法",
                                    fieldName: "taxMethod",
                                    type: "select",
                                    options: [
                                        { text: "一般计税方法", value: "1" },
                                        { text: "简易计税方法", value: "2" }
                                    ],
                                    fieldDecoratorOptions: {
                                        initialValue:record.taxMethod,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择计税方法'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    label: "转出项目",
                                    fieldName: "outProject",
                                    type: "asyncSelect",
                                    componentProps: {
                                        selectOptions: {
                                            labelInValue: true,
                                            disabled: readonly
                                        },
                                        fieldTextName: "name",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: false,
                                        fetchAble: !readonly,
                                        url: `/sys/dict/listBaseInfo/ZCXM`
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:
                                            record && record.outProjectId
                                                ? {
                                                      label:
                                                          record.outProjectName ||
                                                          "",
                                                      key:
                                                          record.outProjectId ||
                                                          ""
                                                  }
                                                : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择转出项目"
                                            }
                                        ]
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [{
                                    span: "12",
                                    type: "input",
                                    formItemStyle: formItemLayout,
                                    label: "凭证号",
                                    fieldName: "voucherNum",
                                    fieldDecoratorOptions: {
                                        initialValue:record.voucherNum,
                                        /*rules: [
                                            {
                                                required: true,
                                                message: '请输入凭证号'
                                            }
                                        ]*/
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                                {
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    label: "期间",
                                    fieldName: "taxDate",
                                    type: "monthPicker",
                                    componentProps: {
                                        disabled: readonly || !!declare
                                        // disabledDate:this.disabledDate
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:(record.taxDate && moment(record.taxDate)) || (declare && declare.authMonth && moment(declare.authMonth)),
                                        rules: [{
                                                required: true,
                                                message: '请选择期间'
                                            }]
                                    },
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [{
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    label: "转出税额",
                                    fieldName: "outTaxAmount",
                                    type: "numeric",
                                    fieldDecoratorOptions: {
                                        initialValue:record.outTaxAmount,
                                        rules: [{
                                                required: true,
                                                message: '请输入转出税额'
                                            }]
                                    },
                                    componentProps: {
                                        disabled: readonly
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

export default connect(state=>({
    declare:state.user.get('declare')
  }))(Form.create()(PopModal));
