import React from 'react'
import { Card, Form, Row, Col, Button } from 'antd'
import { getFields,getUrlParam } from 'utils'
import moment from 'moment'
const FormItem = Form.Item
const handleSubmit = (props, e) => {
    e && e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            values.authMonth = moment(values.authMonth).format('YYYY-MM');
            props.filterChange && props.filterChange(values);
        }
    });
}
const reset = (props) => {
    props.form.resetFields();
    props.filterChange && props.filterChange();
}

let Search = (props) => {
    return (
        <Card>
            <Form onSubmit={handleSubmit.bind(undefined,props)}>
                <Row>
                    {
                        getFields(props.form, [{
                            label: '纳税主体',
                            type: 'taxMain',
                            fieldName: 'mainId',
                            componentProps:{
                                disabled:props.disabled
                            },
                            fieldDecoratorOptions:{
                                initialValue: (props.disabled && getUrlParam('mainId')) || undefined,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择纳税主体'
                                    }
                                ]
                            }
                        }, {
                            label: `查询月份`,
                            fieldName: 'authMonth',
                            type: 'monthPicker',
                            componentProps: {
                                format: 'YYYY-MM',
                                disabled:props.disabled
                            },
                            fieldDecoratorOptions: {
                                initialValue: (props.disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                                rules: [{
                                    required: true,
                                    message: '请选择查询月份'
                                }]
                            }
                        }])
                    }
                    <Col span={7} offset={1} style={{textAlign:'right'}}>
                        <FormItem>
                            <Button size='small' type='primary' htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                            <Button size='small' onClick={reset.bind(undefined,props)}>重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
}

export default Form.create()(Search);

