/**
 * Created by liuliyuan on 2018/5/16
 */
import React, {Component} from "react";
import {Modal, Form, Button, message, Spin, Row} from "antd";
import {getFields, request, requestDict} from "utils";
import {connect} from 'react-redux';
import {BigNumber} from 'bignumber.js';


//设置select值名不同
const setFormat = data =>{
    return data.map(item=>{
        return{
            code:item.code,
            value:item.id,
            text:item.name
        }
    })
}

const formItemLayout = {
    labelCol: {
        xs: {span: 12},
        sm: {span: 8}
    },
    wrapperCol: {
        xs: {span: 16},
        sm: {span: 14}
    }
};

class PopModal extends Component {
    state = {
        loading: false,
        formLoading: false,
        record: {},
        visible: false,
        reduceNameList: [],
        modalKey: Date.now()
    };

    componentDidMount() {
        //减免税性质代码：从数据字典中取出JMS 根据代码获取和类型
        requestDict('JMS', result => {
            this.setState({
                reduceNameList: setFormat(result),
                modalKey: Date.now()
            });
        });
    }

    componentWillReceiveProps(props) {
        if (props.visible && this.props.visible !== props.visible) {
            if (props.id) {
                this.setState({formLoading: true});
                request
                .get(`/account/other/reduceTaxDetail/find/${props.id}`)
                .then(({data}) => {
                    if (data.code === 200) {
                        this.setState({
                            formLoading: false,
                            record: data.data
                        });
                    }
                })
                .catch(err => {
                    message.error(err.message);
                    this.setState({formLoading: false});
                });
            } else {
                this.props.form.resetFields();
                this.setState({formLoading: false, record: {}});
            }
        }
    }

    hideModal = () => {
        this.setState({visible: false});
    };
    hideSelfModal = () => {
        this.props.form.resetFields();
        this.setState({formLoading: false, record: {}});
        this.props.hideModal();
    };

    handleOk() {
        if ((this.props.action !== "modify" && this.props.action !== "add") || this.state.formLoading) {
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                values.incomeTaxAuth = values.incomeTaxAuth ? 1 : 0;
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                if (values.month) {
                    values.month = values.month.label;
                }
                if (values.reduce) {
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
                    result = request.post("/account/other/reduceTaxDetail/add", obj);
                    sucessMsg = "添加成功";
                }

                this.setState({loading: true, formLoading: true});
                result &&
                result
                .then(({data}) => {
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
        let {record = {}, reduceNameList, modalKey} = this.state;
        const {declareData, form} = this.props;
        const {getFieldValue} = form;
        let title = '';
        const disabled = this.props.action === "modify";
        const type = this.props.action;
        switch (type) {
            case 'add':
                title = '新增';
                break;
            case 'modify':
                title = '编辑';
                break;
            case 'look':
                title = '查看';
                break;
            default:
                title = '新增';
                break;
        }

        const {mainId, mainName, authMonth} = declareData || {};

        return (
            <Modal
                key={modalKey}
                title={title}
                visible={this.props.visible}
                width="800px"
                style={{top: "10%"}}
                bodyStyle={{maxHeight: "450px", overflow: "auto"}}
                onCancel={this.hideSelfModal}
                footer={
                    [
                        <Button key="back" onClick={this.hideSelfModal}>
                            取消
                        </Button>,
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
                    ]
                }
                maskClosable={false}
                destroyOnClose={true}
            >
                <Spin spinning={this.state.formLoading}>
                    <Form>
                        <Row>
                            {
                                getFields(form, ([{
                                    label: '纳税主体',
                                    fieldName: 'main',
                                    type: 'taxMain',
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: {key: mainId, label: mainName},
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择纳税主体'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: true
                                    }
                                }, {
                                    label: '纳税申报期',
                                    fieldName: 'month',
                                    type: 'select',
                                    span: 12,
                                    options: [{key: authMonth, label: authMonth}],
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        initialValue: {key: authMonth, label: authMonth},
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入纳税申报期'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        labelInValue: true,
                                        disabled: true
                                    }
                                }]))
                            }
                        </Row>
                        <Row>
                            {
                                this.props.profitCenter && getFields(form, ([{
                                    label: '利润中心',
                                    fieldName: 'profitCenterId',
                                    type: 'asyncSelect',
                                    span: 12,
                                    formItemStyle: formItemLayout,
                                    fieldDecoratorOptions: {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入利润中心'
                                            }
                                        ]
                                    },
                                    componentProps: {
                                        fieldTextName: 'profitName',
                                        fieldValueName: 'id',
                                        doNotFetchDidMount: false,
                                        fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
                                        url: `/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`
                                    }
                                }]))
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        label: '减税性质名称',
                                        fieldName: 'reduce',
                                        type: 'select',
                                        span: 12,
                                        options: reduceNameList,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.sysDictId ? {
                                                key: record.sysDictId,
                                                label: record.reduceName
                                            } : undefined,
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
                                        }
                                    },
                                    {
                                        label: '减税性质代码',
                                        fieldName: 'reduceNum',
                                        type: 'input',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: (()=>{
                                                let code = '';
                                                reduceNameList.map(o=>{
                                                    if(getFieldValue('reduce') && getFieldValue('reduce').key){
                                                        if(o.value === getFieldValue('reduce').key){
                                                            return code = o.code;
                                                        }
                                                    }
                                                    return null;
                                                });
                                                return code || record.reduceNum;
                                            })(),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入期初余额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: true
                                        }
                                    }
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
                                        }
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
                                        }
                                    }
                                ])
                            }
                        </Row>
                        <Row>
                            {
                                getFields(form, [
                                    {
                                        label: '进项税额是否认证抵扣',
                                        fieldName: 'incomeTaxAuth',
                                        type: 'select',
                                        span: 12,
                                        options: [
                                            {text: '否', value: 0},
                                            {text: '是', value: 1}
                                        ],
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: record.incomeTaxAuth,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择进项税额是否认证抵扣'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            width: '100px'
                                        }
                                    },
                                    {
                                        label: '减免税金额',
                                        fieldName: 'reduceTaxAmount',
                                        type: 'numeric',
                                        span: 12,
                                        formItemStyle: formItemLayout,
                                        fieldDecoratorOptions: {
                                            initialValue: (()=>{
                                                let reduceTaxAmount = '';
                                                if(getFieldValue('incomeTaxAuth') === 1){
                                                    reduceTaxAmount = getFieldValue('amount');
                                                }else if(getFieldValue('incomeTaxAuth') === 0){
                                                    const amount = new BigNumber(getFieldValue('amount') || 0);
                                                    const taxAmount = new BigNumber(getFieldValue('taxAmount') || 0);
                                                    reduceTaxAmount = amount.plus(taxAmount);
                                                }
                                                return reduceTaxAmount || record.reduceTaxAmount;
                                            })(),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入减免税金额'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: true
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

export default connect(state => ({
    declare: state.user.get('declare')
}))(Form.create()(PopModal));
