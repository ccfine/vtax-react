/**
 * Created by liurunbin on 2018/1/24.
 */
import React from 'react'
import {CusFormItem} from 'compoments'
export default class NumericInputCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,initialValue,componentProps,style,allowNegative=false} = this.props;
        return (
            <div className="editable-cell-input-wrapper" style={style}>
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:initialValue
                    })(
                        <CusFormItem.NumericInput {...componentProps} allowNegative={allowNegative} style={{textAlign:'right',backgroundColor: '#E2F6FF'}} />
                    )
                }
            </div>
        );
    }
}