/**
 * Created by liurunbin on 2018/1/24.
 */
import React from 'react'
import {CusFormItem} from '../../../../compoments'
export default class EditableCell extends React.Component {
    render() {
        const {getFieldDecorator,fieldName,renderValue} = this.props;
        return (
            <div className="editable-cell-input-wrapper">
                {
                    getFieldDecorator(`${fieldName}`,{
                        initialValue:parseFloat(renderValue)
                    })(
                        <CusFormItem.NumericInput style={{textAlign:'right',backgroundColor: '#E2F6FF'}} />
                    )
                }
            </div>
        );
    }
}