/**
 * Created by liuliyuan on 2018/11/6.
 */
import React, {Component} from 'react';
import {Row, Col, Button, Modal, Form} from 'antd';
import {request, getFields} from 'utils';

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 14
    }
};

class PopModal extends Component {
    state = {
        record: {}
    };

    componentWillReceiveProps(nextProps){
        if (!nextProps.visible) {
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                record: {}
            });
        }
        if (this.props.visible !== nextProps.visible && !this.props.visible) {
            //请求历史修改记录
            const {hideAmount, detailId} = nextProps.filters;
            request.get('/account/income/taxDetail/query/account/income/revise?detailId=' + detailId).then(({data})=>{
                const {num, amount, taxAmount} = data.data || {};
                const record = {
                    num,
                    ...(hideAmount ? {} : {amount}),
                    taxAmount
                };
                this.setState({record});
                nextProps.form.setFieldsValue(record);
            })
        }
    }

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {hideAmount, ...filters} = this.props.filters;
                let data = {
                    ...this.state.record,
                    ...values,
                    ...filters
                };
                request.post('/account/income/taxDetail/update/account/income/revise', data).then(({data})=>{
                    this.props.toggleModalVoucherVisible(false);
                    this.props.refreshTable();
                })
            }
        });

    };

    render() {
        const {record} = this.state;
        const {title, visible, toggleModalVoucherVisible, filters: {hideAmount}} = this.props;
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => toggleModalVoucherVisible(false)}
                width={500}
                style={{top: 200, maxWidth: '80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                            <Button onClick={() => toggleModalVoucherVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form>
                    <Row>
                        {
                            getFields(this.props.form, [
                                {
                                    label: '调整凭据份数',
                                    fieldName: 'num',
                                    type: 'numeric',
                                    componentProps: {
                                        allowNegative: true,
                                        valueType: "int",
                                        decimalPlaces: -10
                                    },
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.num,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入凭据份数'
                                            }
                                        ]
                                    }
                                },
                                ...(hideAmount ? [] : [{
                                    label: '调整金额',
                                    fieldName: 'amount',
                                    type: 'numeric',
                                    componentProps: {
                                        allowNegative: true
                                    },
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.amount,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入金额'
                                            }
                                        ]
                                    }
                                }]),
                                ...[{
                                    label: '调整税额',
                                    fieldName: 'taxAmount',
                                    type: 'numeric',
                                    componentProps: {
                                        allowNegative: true
                                    },
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.taxAmount,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入税额'
                                            }
                                        ]
                                    }
                                }]
                            ])
                        }
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
