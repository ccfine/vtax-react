import React,{Component} from 'react';
import {Select} from 'antd'
const Option  = Select.Option;
export default class YearSelect extends Component{
    state={
        data:[]
    }
    render(){
        const {data} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue} = this.props;
        return(
            <Select>

                {
                    data.map((item,i)=>{
                        return <Option value={item.value}>{item.text}</Option>
                    })
                }
            </Select>
        )
    }
}