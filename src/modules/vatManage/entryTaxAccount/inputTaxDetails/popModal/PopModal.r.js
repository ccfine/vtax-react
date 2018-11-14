/**
 * Created by liuliyuan on 2018/11/6.
 */
import React, {Component} from 'react';
import {Row, Col, Button, Modal, Form} from 'antd';
import {getFields} from 'utils';

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
            //todo
            //请求历史修改记录
        }
    }

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    ...this.state.record,
                    ...values
                };
                console.log(data)
            }
        });

    };

    render() {
        const {record} = this.state;
        const {title, visible, form, toggleModalVoucherVisible} = this.props;
        const {getFieldValue} = form;
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
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.num,
                                        rules: [
                                            (parseInt(getFieldValue('invoiceType'), 0) !== 7 ) && {
                                                required: true,
                                                message: '请输入凭据份数'
                                            }
                                        ]
                                    }
                                }, {
                                    label: '调整金额',
                                    fieldName: 'amount',
                                    type: 'numeric',
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.amount,
                                        rules: [
                                            (parseInt(getFieldValue('invoiceType'), 0) !== 4 && parseInt(getFieldValue('invoiceType'), 0) !== 7  ) && {
                                                required: true,
                                                message: '请输入金额'
                                            }
                                        ]
                                    }
                                }, {
                                    label: '调整税额',
                                    fieldName: 'taxAmount',
                                    type: 'numeric',
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
                                }
                            ])
                        }
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
