import React from 'react'
import { Input } from 'antd';
import PropTypes from 'prop-types';

class NumericInput extends React.Component {
    static propTypes={
        /**
         * 限制数值的类型,默认float限制2位小数
         * */
        valueType:PropTypes.oneOf(['float', 'int'])
    }
    static defaultProps={
        valueType:'float'
    }
    onChange = (e) => {
        const { value } = e.target;
        /**
         * 2位小数
         * */
        let reg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        if(this.props.valueType === 'int'){
            reg = /^-?(0|[1-9][0-9]*)?$/;
        }
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
        }
    }
    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const { value, onBlur, onChange } = this.props;
        if(value && typeof value !== 'undefined' && value.charAt){
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                onChange({ value: value.slice(0, -1) });
            }
        }
        onBlur && onBlur();
    }
    render() {
        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                onBlur={this.onBlur}
                maxLength="25"
            />
        );
    }
}
export default NumericInput