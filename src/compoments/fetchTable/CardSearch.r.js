import React from 'react'
import { Card, Form, Row, Col, Button } from 'antd'
import { getFields } from '../../utils'
import PropTypes from 'prop-types'
const FormItem = Form.Item
class Search extends React.Component{
    static propTypes={
        buttonSpan:PropTypes.number,
        feilds:PropTypes.array,
        filterChange:PropTypes.func,
        doNotSubmitDidMount:PropTypes.bool,
    }
    static defaultProps={
        doNotSubmitDidMount:true
    }
    componentDidMount(){
        if(!this.props.doNotSubmitDidMount){
            this.handleSubmit()
        }
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        let props = this.props;
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                props.filterChange && props.filterChange(values);
            }
        });
    }
    reset = () => {
        let props = this.props;
        props.form.resetFields();
    }
    render(){
        let props = this.props;
        return (
            <Card>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        {
                            getFields(props.form, props.feilds)
                        }
                        <Col span={props.buttonSpan?props.buttonSpan:6} style={{textAlign:'right'}}>
                            <FormItem>
                                <Button size='small' type='primary' htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                                <Button size='small' onClick={this.reset}>重置</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(Search);

