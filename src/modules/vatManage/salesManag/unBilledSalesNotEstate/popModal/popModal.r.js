/*
 * @Author: liuchunxiu
 * @Date: 2018-05-15 16:12:23
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-05 16:54:27
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request } from "utils";
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
class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        typelist: [],
        creditSubjectList:[],
    };

    //查询未开票-非地产的科目列表
    getLoadUnRealtyList=()=>{
        request.get('/incomeAndTaxRateCorrespondence/loadUnRealtyList')
            .then(({data})=>{
                if(data.code ===200){

                    this.setState({
                        creditSubjectList:data.data.map(item=>{
                            return {
                                ...item,
                                text: item.name,
                                value: item.code
                            }
                        })
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
            });
    }
    //查询未开票-非地产的科目列表
    getStagesList=(projectId,stagesId,creditSubjectCode,cb)=>{
        request.get(`/project/stages/${projectId}`)
            .then(({data})=>{
                if(data.code ===200){
                    let taxMethod = data.data.records.filter(item=>item.id === stagesId)[0].taxMethod;
                    let nList = this.state.creditSubjectList.filter(item=>item.code === creditSubjectCode)[0];
                    let taxRate = 0;
                    if(parseInt(taxMethod, 0) === 1){
                        taxRate = nList.commonlyTaxRate
                    } else {
                        taxRate = nList.simpleTaxRate
                    }
                    cb && cb(taxRate)
                }
            })
            .catch(err => {
                message.error(err.message)
            });
    }
    componentDidMount() {
        this.getLoadUnRealtyList()
    }
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
                //纳税主体
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                // 项目
                if (values.project) {
                    values.projectId = values.project.key;
                    values.projectName = values.project.label;
                    values.project = undefined;
                }
                // 项目分期
                if (values.stages) {
                    values.stagesId = values.stages.key;
                    values.stagesName = values.stages.label;
                    values.stages = undefined;
                }
                // 科目
                if(values.creditSubject){
                    values.creditSubjectCode = values.creditSubject.key;
                    values.creditSubjectName = values.creditSubject.label;
                    values.creditSubject = undefined;
                }


               // 当项目分期的taxMethod=2 取 科目税率对应表的simpleTaxRate为税率。 项目分期的taxMethod=1 取 科目税率对应表的commonlyTaxRate为税率。

                this.getStagesList(values.projectId,values.stagesId,values.creditSubjectCode,(taxRate)=>{

                    let obj = Object.assign({}, this.state.record, {...values,taxRate:taxRate});
                    console.log(obj)

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
                });

            }
        });
    }
    render() {
        const readonly = this.props.action === "look";
        // const NotModifyWhenEdit = this.props.action === "modify";
        let { record = {}, creditSubjectList } = this.state,
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
                                    label: "纳税主体",
                                    fieldName: "main",
                                    type: "taxMain",
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: readonly || !!declare,
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record.mainId? {key: record.mainId,label: record.mainName}: (declare?{key:declare.mainId}:undefined),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择纳税主体'
                                            }
                                        ]
                                    }
                                },{
                                    label: "期间",
                                    fieldName: "month",
                                    type: "monthPicker",
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue:(record.month && moment(record.month)) || (declare && declare.authMonth && moment(declare.authMonth)),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择期间'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        disabled: readonly || !!declare,
                                    }
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [{
                                    label: "项目",
                                    fieldName: "project",
                                    type: "asyncSelect",
                                    span: 12,
                                    formItemStyle: formItemLayout,
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
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record && record.projectId? {label:record.projectName,key:record.projectId} : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择项目'
                                            }
                                        ]
                                    },
                                },
                                {
                                    label: "项目分期",
                                    fieldName: "stages",
                                    type: "asyncSelect",
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    componentProps: {
                                        disabled:readonly,
                                        selectOptions: {
                                            disabled:readonly,
                                            labelInValue: true
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: !(record && record.projectId),
                                        fetchAble:
                                        (getFieldValue("project") &&
                                        getFieldValue("project").key) || (record && record.projectId),
                                        url: `/project/stages/${(getFieldValue(
                                            "project"
                                        ) &&
                                        getFieldValue("project").key) || (record && record.projectId) ||
                                        ""}`
                                    },
                                    fieldDecoratorOptions: {initialValue:record && record.stagesId? {label:record.stagesName,key:record.stagesId }: undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择项目分期'
                                            }
                                        ]
                                    },
                                }
                            ])}
                        </Row>
                        <Row>
                            {getFields(form, [{
                                    label: "科目",
                                    fieldName: "creditSubject",
                                    type: "select",
                                    options: creditSubjectList,
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    componentProps: {
                                        labelInValue: true,
                                        disabled:readonly
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record.creditSubjectCode ? { key: record.creditSubjectCode, label: record.creditSubjectName } : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择科目'
                                            }
                                        ]
                                    },
                                },{
                                    label: "金额",
                                    fieldName: "creditAmount",
                                    type: "numeric",
                                    span: "12",
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue:record.creditAmount,
                                        rules: [{
                                                required: true,
                                                message: '请输入金额'
                                            }]
                                    },
                                    componentProps: {
                                        disabled: readonly
                                    }
                                },
                            ])}
                        </Row>
                        {
                            this.props.action === 'look' && <div>
                                <Row>
                                    { getFields(form, [
                                        {
                                            span: "12",
                                            formItemStyle: formItemLayout,
                                            fieldDecoratorOptions: {
                                                initialValue:record.taxRate,
                                            },
                                            componentProps: {
                                                disabled: true,
                                                placeholder: "请输入税率（单位：%）"
                                            },
                                            label: "税率（%）",
                                            fieldName: "taxRate",
                                            type: "numeric",
                                        },{
                                            span: "12",
                                            formItemStyle: formItemLayout,
                                            label: "税额",
                                            fieldName: "taxAmount",
                                            type: "numeric",
                                            fieldDecoratorOptions: {
                                                initialValue:record.taxAmount
                                            },
                                            componentProps: {
                                                disabled: true
                                            }
                                        },
                                    ])}
                                </Row>
                                <Row>
                                    { getFields(form, [
                                        {
                                            span: "12",
                                            formItemStyle: formItemLayout,
                                            label: "价税合计",
                                            fieldName: "totalAmount",
                                            type: "numeric",
                                            fieldDecoratorOptions: {
                                                initialValue:record.totalAmount
                                            },
                                            componentProps: {
                                                disabled: true
                                            }
                                        }
                                    ])}
                                </Row>
                            </div>

                        }

                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
}))(Form.create()(PopModal));
