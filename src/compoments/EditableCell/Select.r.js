/**
 * Created by liuliyuan on 2018/6/12.
 */
import React from 'react'
import { Select } from 'antd';
const Option = Select.Option;

export default class SelectCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,initialValue,componentProps,options=[],fieldDecoratorOptions,style} = this.props;
        return (
            <div className="editable-cell-input-wrapper" style={style}>
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:initialValue,
                        ...fieldDecoratorOptions
                    })(

                        <Select {...componentProps} style={{width:'100%',textAlign:'right',backgroundColor: '#E2F6FF'}} >
                            {
                                options.map((option,i)=>(
                                    <Option key={i} title={option.text} value={option.value}>{option.text}</Option>
                                ))
                            }
                        </Select>
                    )
                }
            </div>
        );
    }
}