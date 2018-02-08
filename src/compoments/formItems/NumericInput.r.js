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
         * 2位小数 不能输入负数
         * */
        let reg = /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        //let reg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        if(this.props.valueType === 'int'){
            reg = /^(0|[1-9][0-9]*)?$/;
            //reg = /^-?(0|[1-9][0-9]*)?$/;
        }
        if(value === '-'){
            this.props.onChange('');
        }
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            let l = value.toString().split(".")[0],
                r = value.toString().split(".")[1];
            this.props.onChange(value);
            if(typeof r === 'undefined'){
                if(l.length>20){
                    this.props.onChange(value.substr(0,value.length-1));
                }
            }
        }
    }
    render() {
        const props = {...this.props};
        delete props['valueType'];
        return (
            <Input
                {...props}
                onChange={this.onChange}
                maxLength="23"
            />
        );
    }
}
export default NumericInput