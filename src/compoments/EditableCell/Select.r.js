/**
 * Created by liuliyuan on 2018/6/12.
 */
import React from 'react'
import { Select } from 'antd';
const Option = Select.Option;

export default class SelectCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,initialValue,componentProps,options=[],fieldDecoratorOptions} = this.props;
        return (
            <div className="editable-cell-input-wrapper">
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:initialValue,
                        ...fieldDecoratorOptions
                    })(

                        <Select {...componentProps} style={{textAlign:'right',backgroundColor: '#E2F6FF'}} >
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