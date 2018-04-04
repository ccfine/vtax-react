import React from 'react'
import { Input } from 'antd';
import PropTypes from 'prop-types';

class NumericInput extends React.Component {
    static propTypes={
        /**
         * 限制数值的类型,默认float限制2位小数
         * */
        valueType:PropTypes.oneOf(['float', 'int']),
        /**
         * 是否允许输入负数，默认为false   add by liuchunxiu 2018/3/27
         * */
        allowNegative:PropTypes.bool
    }
    static defaultProps={
        valueType:'float',
        allowNegative:false,
        onBlur:(e)=>{
            const { value } = e.target;
            // 当只有符号时数据不合法（加判断的原因：只有这种情况时允许存在，但作为最终结果不是合法的）
            if(value === '-'){
                this.props.onChange("");
            }
        }
    }
    onChange = (e) => {
        const { value } = e.target;
        let noNegativeValue = value.indexOf('-')===0
                                ?
                                value.substr(1,value.length-1)
                                :
                                value;

        /**
         * 负数/20位整数/2位小数
         * */
        let reg = /^(0|[1-9][0-9]{0,19})(\.[0-9]{0,2})?$/;
        if(this.props.valueType === 'int'){
            reg = /^(0|[1-9][0-9]{0,19})?$/;
        }

        /**
         * 合法情况：
         * 1.空
         * 2.去掉后符号后，是数字并符合正则规范
         */
        if ((!isNaN(noNegativeValue) && reg.test(noNegativeValue)) || noNegativeValue === '') {
            this.props.allowNegative
            ?
            this.props.onChange(value)
            :
            this.props.onChange(noNegativeValue);
        }
    }
    render() {
        const props = {...this.props};
        delete props['valueType'];
        delete props['allowNegative'];
        return (
            <Input
                {...props}
                onChange={this.onChange}
                maxLength="24"
            />
        );
    }
}
export default NumericInput