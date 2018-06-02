/**
 * Created by liurunbin on 2018/1/24.
 */
import React from 'react'
import {CusFormItem} from 'compoments'
export default class EditableCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,renderValue,componentProps} = this.props;
        return (
            <div className="editable-cell-input-wrapper">
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:renderValue,
                    })(
                        <CusFormItem.NumericInput {...componentProps} style={{textAlign:'right',backgroundColor: '#E2F6FF'}} />
                    )
                }
            </div>
        );
    }
}