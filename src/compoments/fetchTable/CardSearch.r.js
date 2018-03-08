import React from 'react'
import { Card, Form, Row, Col, Button } from 'antd'
import { getFields } from '../../utils'
import PropTypes from 'prop-types'
const FormItem = Form.Item
class Search extends React.Component{
    static propTypes={
        buttonSpan:PropTypes.number,
        feilds:PropTypes.array.isRequired,
        filterChange:PropTypes.func,
        doNotSubmitDidMount:PropTypes.bool,
        feildvalue:PropTypes.object
    }
    static defaultProps={
        doNotSubmitDidMount:true,
        buttonSpan:6
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
                        <Col span={props.buttonSpan} style={{textAlign:'right'}}>
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

export default Form.create({
    mapPropsToFields:props=>{
        let result = {};
        props.feildvalue && props.feilds.reduce((result, feild)=>{
            result[feild.fieldName] = Form.createFormField({value:props.feildvalue[feild.fieldName]});
            return result;
        },result);
        return result;
    }
})(Search);

