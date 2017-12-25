import React,{Component} from 'react';
import {Select,Form} from 'antd'
import PropTypes from 'prop-types'
const Option  = Select.Option;
const FormItem = Form.Item;
export default class YearSelect extends Component{
    constructor(props){
        super(props)
        const now = new Date().getFullYear();
        let prevArr =[]
        let nextArr = []
        for(let i = 0;i<100;i++){
            prevArr.push(now-100 + i)
            nextArr.push(now+i)
        }
        let data = prevArr.concat(nextArr)
        this.state={
            data
        }
    }
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        initialValue:PropTypes.any
    }
    static defaultProps={
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        },
        initialValue:`${new Date().getFullYear()}`
    }
    render(){
        const {data} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue} = this.props;
        return(
            <FormItem label='实施年度' {...formItemStyle}>
                {getFieldDecorator(fieldName,{
                    initialValue
                })(
                    <Select
                        style={{ width: '100%' }}
                    >
                        {
                            data.map((item,i)=>(
                                <Option key={i} value={`${item}`}>{item}</Option>
                            ))
                        }
                    </Select>
                )}
            </FormItem>
        )
    }
}