/*
 * @Author: liuchunxiu
 * @Date: 2018-05-15 16:12:23
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-18 10:53:53
 */
import React, { Component } from "react";
import { Modal, Form, Button, message, Spin, Row } from "antd";
import { getFields, request,parseJsonToParams } from "utils";
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
                                value: item.id
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
    /*getStagesList=(projectId,stagesId,creditSubjectId,cb)=>{
        request.get(`/project/stages/${projectId}`)
            .then(({data})=>{
                if(data.code ===200){
                    let taxMethod = data.data.records.filter(item=>item.id === stagesId)[0].taxMethod;
                    let nList = this.state.creditSubjectList.filter(item=>item.id === creditSubjectId)[0];
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
    }*/
    componentDidMount() {
        this.getLoadUnRealtyList()
    }
    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({ formLoading: true });
                request
                    .get(`/account/invoiceSale/unrealty/find/${props.id}`)
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
                    delete values.main
                }
                // 利润中心
                if (values.profitCenter) {
                    values.profitCenterId = values.profitCenter.key;
                    values.profitCenterName = values.profitCenter.label;
                    delete values.profitCenter
                }
                // 项目分期
                if (values.stages) {
                    values.stagesId = values.stages.key;
                    values.stagesName = values.stages.label;
                    delete values.stages
                }
                // 科目
                if(values.creditSubject){
                    values.creditSubjectId = values.creditSubject.key;
                    values.creditSubjectName = values.creditSubject.label;
                    delete values.creditSubject
                }


               // 当项目分期的taxMethod=2 取 科目税率对应表的simpleTaxRate为税率。 项目分期的taxMethod=1 取 科目税率对应表的commonlyTaxRate为税率。

                //this.getStagesList(values.projectId,values.stagesId,values.creditSubjectId,(taxRate)=>{

                let obj = Object.assign({}, this.state.record, {...values}); //taxRate:taxRate
                let result, sucessMsg;
                if (this.props.action === "modify") {
                    result = request.put(
                        "/account/invoiceSale/unrealty/update",
                        obj
                    );
                    sucessMsg = "修改成功";
                } else if (this.props.action === "add") {
                    result = request.post(
                        "/account/invoiceSale/unrealty/add",
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

                //});

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
                                        initialValue:record.mainId ? {key: record.mainId,label: record.mainName}: (declare ? {key:declare.mainId,label:declare.mainName} : undefined),
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
                                    label: "利润中心",
                                    fieldName: "profitCenter",
                                    type: "asyncSelect",
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    componentProps: {
                                        disabled:readonly,
                                        selectOptions: {
                                            disabled:readonly,
                                            labelInValue: true
                                        },
                                        fieldTextName: "profitName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: !declare,
                                        fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (record && record.mainId),
                                        url: `/taxsubject/profitCenterList/${(getFieldValue("main") && getFieldValue("main").key) || (record && record.mainId) ||
                                        (declare && declare.mainId)}`
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record && record.profitCenterId? {label:record.profitCenterName,key:record.profitCenterId} : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择利润中心'
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
                                        fetchAble: (getFieldValue("project") && getFieldValue("project").key) || (record && record.projectId),
                                        url:`/project/stage/list?${parseJsonToParams({
                                            profitCenterId:(getFieldValue("profitCenter") && getFieldValue("profitCenter").key) || (record && record.projectId) || "",
                                            size:1000,
                                        })}`,
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue:record && record.stagesId? {label:record.stagesName,key:record.stagesId }: undefined,
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
                                        initialValue:record.creditSubjectId ? { key: record.creditSubjectId, label: record.creditSubjectName } : undefined,
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
                                        disabled: readonly,
                                        allowNegative: true,
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

export default Form.create()(PopModal);
