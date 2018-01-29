import React from 'react'
import { Card, Form, Row, Col, Button } from 'antd'
import { getFields } from '../../utils'
const FormItem = Form.Item
const handleSubmit = (props, e) => {
    e && e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            props.filterChange && props.filterChange(values);
        }
    });
}
const reset = (props) => {
    props.form.resetFields();
}

let Search = (props) => {
    return (
        <Card>
            <Form onSubmit={handleSubmit.bind(undefined,props)}>
                <Row>
                    {
                        getFields(props.form, props.feilds)
                    }
                    <Col span={props.buttonSpan?props.buttonSpan:6} style={{textAlign:'right'}}>
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

