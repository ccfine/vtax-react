/**
 * Created by chenfeng on 2018/11/16.
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

class AdjustPopModal extends Component {
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
            const {detailId} = nextProps.filters;
            request.get(`/account/income/taxout/find/${detailId}`).then(({data})=>{
                const {modifyOutTaxAmount, modifyInvoiceCount} = data.data || {};
                const record = {
                    modifyOutTaxAmount,
                    modifyInvoiceCount
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
                let data = {
                    ...this.state.record,
                    ...values,
                    id: this.props.filters.detailId
                };
                request.put('/account/income/taxout/update', data).then(({data})=>{
                    this.props.toggleModalVoucherVisible(false);
                    this.props.refreshTable();
                })
            }
        });

    };

    render() {
        const {record} = this.state;
        const {title, visible, toggleModalVoucherVisible} = this.props;
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
                                    label: '调整发票份数',
                                    fieldName: 'modifyInvoiceCount',
                                    type: 'numeric',
                                    componentProps: {
                                        allowNegative: true,
                                        valueType: "int",
                                        decimalPlaces: -10
                                    },
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.modifyInvoiceCount,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入发票份数'
                                            }
                                        ]
                                    }
                                },
                                ...[{
                                    label: '调整税额',
                                    fieldName: 'modifyOutTaxAmount',
                                    type: 'numeric',
                                    componentProps: {
                                        allowNegative: true
                                    },
                                    span: 22,
                                    formItemStyle,
                                    fieldDecoratorOptions: {
                                        initialValue: record.modifyOutTaxAmount,
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

export default Form.create()(AdjustPopModal);
