/**
 * Created by liurunbin on 2017/12/20.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,DatePicker} from 'antd';
import {request} from '../../../../../utils'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
let timeout;
let currentValue;
function fetchTaxMain(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const fetch = ()=> {
        request.get(`/taxsubject/listByName`,{
            params:{
                name:value
            }
        })
            .then(({data}) => {
                if(data.code===200 && currentValue === value){

                    const result = data.data.records;
                    const newData = [];
                    result.forEach((r) => {
                        newData.push({
                            value: `${r.name}`,
                            text: r.name,
                        });
                    });
                    callback(newData);
                }
            });
    }

    timeout = setTimeout(fetch, 300);
}
class EditModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        mainTaxItems:[
        ],
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    handleChange = (value) => {
        //this.setState({ value });
        this.setState({
            selectedId:value
        })
        fetchTaxMain(value, data => this.setState({ mainTaxItems:data }));
    }
    render(){
        const props = this.props;
        const {mainTaxItems} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return(
                <Modal
                    onOk={this.handleSubmit}
                    onCancel={()=>props.toggleModalVisible(false)}
                    width={800}
                    visible={props.visible}
                    title={props.type==='edit'?'编辑':'添加'}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={12}>
                                <FormItem label='纳税主体' {...formItemLayout}>
                                    {getFieldDecorator(`aa`,{
                                    })(
                                        <Select
                                            mode="combobox"
                                            defaultActiveFirstOption={true}
                                            filterOption={false}
                                            onChange={this.handleChange}
                                            style={{width:'100%'}}>
                                            {
                                                mainTaxItems.map((item,i)=>(
                                                    <Option key={i} value={item.value}>{item.text}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label='涉及税种' {...formItemLayout}>
                                    {getFieldDecorator(`a`,{
                                    })(
                                        <Select
                                            style={{width:'100%'}}>
                                            {
                                                mainTaxItems.map((item,i)=>(
                                                    <Option key={i} value={item.value}>{item.text}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label='税收优惠分类' {...formItemLayout}>
                                    {getFieldDecorator(`b`,{
                                    })(
                                        <Select
                                            style={{width:'100%'}}>
                                            {
                                                mainTaxItems.map((item,i)=>(
                                                    <Option key={i} value={item.value}>{item.text}</Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label='文号' {...formItemLayout}>
                                    {getFieldDecorator(`c`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="有效期起止"
                                >
                                    {getFieldDecorator('range-time-picker', {
                                        rules: [{ type: 'array', required: true, message: 'Please select time!' }],
                                    })(
                                        <RangePicker showTime format="YYYY-MM-DD" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label="税收优惠法律依据"
                                >
                                    {getFieldDecorator('range-time-picker', {
                                        rules: [{ type: 'array', required: true, message: 'Please select time!' }],
                                    })(
                                        <TextArea placeholder="Autosize height with minimum and maximum number of lines" autosize={{ minRows: 2, maxRows: 6 }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
        )
    }
}

export default Form.create()(EditModal)