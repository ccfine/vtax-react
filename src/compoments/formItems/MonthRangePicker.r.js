/**
 * author       : liuliyuan
 * createTime   : 2018/1/23 10:23
 * description  :
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Form,DatePicker} from 'antd'
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
export default class MonthRangePicker extends Component {
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        fieldDecoratorOptions:PropTypes.object,
        componentProps:PropTypes.object,
        label:PropTypes.string.isRequired,
    }
    static defaultProps={
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        },
        fieldName:'authMonth',
        label:'认证月份',
        fieldDecoratorOptions:{

        }
    }
    state = {
        mode: ['month', 'month'],
    };

    handlePanelChange = (value, mode) => {

        this.setState({
            mode: [
                mode[0] === 'date' ? 'month' : mode[0],
                mode[1] === 'date' ? 'month' : mode[1],
            ],
        },()=>{
            this.props.form.setFieldsValue({
                [`${this.props.fieldName}`]: value
            });
        });
    }

    render() {
        const { mode } = this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,fieldDecoratorOptions,componentProps,label} = this.props;
        return (
            <FormItem label={label} {...formItemStyle}>
                {getFieldDecorator(fieldName,{
                    ...fieldDecoratorOptions
                })(
                    <RangePicker
                        placeholder={['开始月份', '结束月份']}
                        format="YYYY-MM"
                        mode={mode}
                        onPanelChange={this.handlePanelChange}
                        {...componentProps}
                    />
                )}
            </FormItem>
        );
    }
}