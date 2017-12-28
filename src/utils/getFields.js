/**
 * Created by liurunbin on 2017/12/28.
 */
import React from 'react';
import {Col,Form,Input,DatePicker,Select} from 'antd'
import {CusFormItem} from '../compoments'
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker,MonthPicker } = DatePicker;
const getFields = (form,fieldsData=[]) =>{
    const {getFieldDecorator} = form;
    let formItemStyle={
        labelCol:{
            span:6
        },
        wrapperCol:{
            span:18
        }
    }
    return fieldsData.map((item,i)=>{
        let Component;
        const type = item.type;
        switch (type){
            case 'input':
                Component = Input;
                break;
            case 'taxMain':
                Component = CusFormItem.TaxMain;
                break;
            case 'rangePicker' :
                Component = RangePicker;
                break;
            case 'select':
                Component = props=>(
                    <Select {...props}>
                        {
                            item.options.map((option,i)=>(
                                <Option key={i} value={option.value}>{option.text}</Option>
                            ))
                        }
                    </Select>
                );
                break;
            case 'asyncSelect':
                Component = CusFormItem.AsyncSelect;
                break;
            case 'monthPicker':
                Component = MonthPicker;
                break;
            default:
                Component = props =><div {...props}>no match Component</div>
        }

        if(type ==='taxMain' || type === 'asyncSelect'){
            return <Col key={i} span={item['span'] || 8}>
                <Component label={item['label']} fieldName={item['fieldName']} formItemStyle={formItemStyle} form={form} {...item['componentProps']} />
            </Col>
        }else{
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <Component {...item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }

    })

}

export default getFields