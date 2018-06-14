/**
 * Created by liuliyuan on 2018/6/12.
 */
import React from 'react'
import { Select } from 'antd';
const Option = Select.Option;

export default class SelectCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,initialValue,componentProps,options=[]} = this.props;
        return (
            <div className="editable-cell-input-wrapper">
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:initialValue
                    })(

                        <Select {...componentProps} style={{width:'100%',textAlign:'right',backgroundColor: '#E2F6FF'}} >
                            {
                                options.map((option,i)=>(
                                    <Option key={i} value={option.value}>{option.text}</Option>
                                ))
                            }
                        </Select>
                    )
                }
            </div>
        );
    }
}