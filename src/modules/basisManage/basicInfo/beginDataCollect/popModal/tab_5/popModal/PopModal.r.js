/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-23 10:15:07 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-25 15:31:19
 */
import React, { Component } from 'react'
import { Modal, Form,Button, message, Spin, Row } from 'antd'
import { getFields, request } from 'utils'
const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
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
                request.get(`/landPriceCollection/find/${props.id}`).then(({ data }) => {
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
                if(values.event){
                    values.num =values.event.key;
                    values.name = values.event.label;
                    values.event = undefined;
                }

                if(values.project){
                    values.projectId = values.project.key;
                    values.projectName = values.project.label;
                    values.project = undefined;
                }

                if(values.stages){
                    values.stagesId = values.stages.key;
                    values.stagesName = values.stages.label;
                    values.stages = undefined;
                }

                let obj = Object.assign({id:this.state.record.id,mainId:this.state.record.mainId}, values);
                let result,
                    sucessMsg;

                if (this.props.action === "modify") {
                    result = request.put('/landPriceCollection/update', obj);
                    sucessMsg = '修改成功';
                } else if (this.props.action === "add") {
                    obj.mainId = this.props.mainId;
                    result = request.post('/landPriceCollection/add', obj);
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

        const eventkey = parseInt((form.getFieldValue('event') && form.getFieldValue('event').key) || record.num,10);

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
                            {
                                // [事项名称]1附表3-10%税率的项目-期初余额2附表3-5%征收率的项目-期初余额3累计扣除土地价款4累计销售土地面积 
                                getFields(form, [{
                                        span: '24',
                                        label:'事项名称',
                                        fieldName:'event',
                                        type:'select',
                                        options:[
                                            {
                                                text:'附表3-10%税率的项目-期初余额',
                                                value:1
                                            },
                                            // {
                                            //     text:'附表3-5%征收率的项目-期初余额',
                                            //     value:2
                                            // },
                                            {
                                                text:'期初土地信息',
                                                value:3
                                            },
                                            /*{
                                                text:'累计销售土地面积',
                                                value:4
                                            },
                                            {
                                                text:'期初可抵扣土地价款',
                                                value:5
                                            }*/
                                        ],
                                        formItemStyle:formItemLayout,
                                        fieldDecoratorOptions:{
                                            initialValue:record.num && {key:record.num,label:record.name},
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择事项'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            labelInValue:true,
                                            disabled: readonly || isModify
                                        },
                                    }]
                                )
                            }
                        </Row>
                        <Row>
                            {
                                (eventkey === 3) && getFields(form, [{
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
                                            disabled: readonly || isModify,
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
                            {
                                 (eventkey === 3) && getFields(form, [{
                                    label: "项目分期",
                                    fieldName: "stages",
                                    type: "asyncSelect",
                                    span:24,
                                    formItemStyle:formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: record.stagesId && {key:record.stagesId,label:record.stagesName},
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
                                            disabled: readonly || isModify,
                                        },
                                        fieldTextName: "itemName",
                                        fieldValueName: "id",
                                        doNotFetchDidMount: true,
                                        fetchAble: form.getFieldValue("project") && form.getFieldValue("project").key,
                                        url: `/project/stages/${(form.getFieldValue("project") && form.getFieldValue("project").key) || ""}`
                                    }
                                }])
                            }
                        </Row>
                        <Row>
                            {
                                (eventkey === 1 || eventkey === 3) && getFields(form, [{
                                        span: '24',
                                        fieldName: 'amount',
                                        label: '期初余额',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.amount || 0,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入期初余额'
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
                                 eventkey === 3 && getFields(form, [{
                                        span: '24',
                                        fieldName: 'landPrice',
                                        label: '累计扣除土地价款',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.landPrice|| 0,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入累计扣除土地价款'
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
                                eventkey === 3 &&getFields(form, [{
                                        span: '24',
                                        fieldName: 'salesArea',
                                        label: '累计销售土地面积',
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.salesArea|| 0,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入累计销售土地面积'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            decimalPlaces:4,
                                            disabled: readonly
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