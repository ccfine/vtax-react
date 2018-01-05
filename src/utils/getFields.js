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
    const {getFieldDecorator,setFieldsValue} = form;
    let defaultFormItemStyle={
        labelCol:{
            span:6
        },
        wrapperCol:{
            span:18
        }
    }
    return fieldsData.map((item,i)=>{
        let CusComponent;
        const type = item.type;
        let formItemStyle = item.formItemStyle || defaultFormItemStyle;
        switch (type){
            case 'input':
                CusComponent = Input;
                break;
            case 'taxMain':
                CusComponent = CusFormItem.TaxMain;
                break;
            case 'rangePicker' :
                CusComponent = RangePicker;
                break;
            case 'select':
                CusComponent = Select;
                break;
            case 'asyncSelect':
                CusComponent = CusFormItem.AsyncSelect;
                break;
            case 'monthPicker':
                CusComponent = MonthPicker;
                break;
            case 'datePicker':
                CusComponent = DatePicker;
                break;
            case 'numeric':
                CusComponent = CusFormItem.NumericInput;
                break;
            case 'taxClassCodingSelect':
                CusComponent = CusFormItem.TaxClassCodingSelect;
                break;
            case 'yearSelect':
                CusComponent = CusFormItem.YearSelect;
                break;
            default:
                CusComponent = Input
        }

        if(type ==='taxMain' || type === 'asyncSelect' || type === 'yearSelect'){
            return <Col key={i} span={item['span'] || 8}>
                <CusComponent label={item['label']} fieldName={item['fieldName']} fieldDecoratorOptions={item.fieldDecoratorOptions} formItemStyle={formItemStyle} form={form} {...item['componentProps']} componentProps={item['componentProps']} />
            </Col>
        }else if(type==='select'){
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} >
                                {
                                    item.options.map((option,i)=>(
                                        <Option key={i} value={option.value}>{option.text}</Option>
                                    ))
                                }
                            </CusComponent>
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='taxClassCodingSelect'){
            // 给这个税收分类编码特殊对待，因为他的弹出窗组件需要修改这个值，就把setFieldsValue传到子组件下
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent fieldName={item['fieldName']} setFieldsValue={setFieldsValue} {...item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }else{
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }

    })

}

export default getFields

