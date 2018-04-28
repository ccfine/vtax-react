/**
 * Created by liurunbin on 2017/12/28.
 */
import React from 'react';
import {Col,Form,Input,DatePicker,Select,Checkbox,Cascader,Radio,Switch } from 'antd'
import {CusFormItem} from 'compoments'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker,MonthPicker } = DatePicker;
const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
}
const getFields = (form,fieldsData=[]) =>{
    const {getFieldDecorator,setFieldsValue,getFieldValue} = form;
    let defaultFormItemStyle={
        labelCol:{
            span:6
        },
        wrapperCol:{
            span:18
        }
    }
    if(typeof fieldsData === 'function'){
        /**
         * 当fieldsData为function的时候，必须要在最后返回fieldsData*/
        fieldsData = fieldsData(getFieldValue,setFieldsValue)
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
            case 'monthRangePicker' :
                CusComponent = CusFormItem.MonthRangePicker;
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
            case 'roomCodeSelect':
                CusComponent = CusFormItem.RoomCodeSelect;
                break;
            case 'yearSelect':
                CusComponent = CusFormItem.YearSelect;
                break;
            case 'fileUpload':
                CusComponent = CusFormItem.FileUpload;
                break;
            case 'textArea':
                CusComponent = TextArea;
                break;
            case 'checkbox':
                CusComponent = Checkbox;
                break;
            case 'checkboxGroup':
                CusComponent = CheckboxGroup;
                break;
            case 'radio':
                CusComponent = Radio;
                break;
            case 'radioGroup':
                CusComponent = RadioGroup;
                break;
            case 'cascader':
                CusComponent = Cascader;
                break;
            case 'industry':
                CusComponent = CusFormItem.Industry;
                break;
            case 'taxableProject':
                CusComponent = CusFormItem.TaxableProject;
                break;
            case 'switch':
                CusComponent = Switch;
                break;
            default:
                CusComponent = Input
        }

        if(type ==='taxMain' || type === 'asyncSelect' || type === 'yearSelect' || type==='monthRangePicker'){
            return <Col key={i} span={item['span'] || 8}>
                <CusComponent label={item['label']} fieldName={item['fieldName']} fieldDecoratorOptions={item.fieldDecoratorOptions} decoratorOptions={item.fieldDecoratorOptions} formItemStyle={formItemStyle} form={form} {...item['componentProps']} componentProps={item['componentProps']} />
            </Col>
        }else if(type==='select'){
            //TODO:为了设置所有不是必填的select都加上一个全部默认选项
            const isShowAll = (item['fieldDecoratorOptions'] && item['fieldDecoratorOptions'].rules && item['fieldDecoratorOptions'].rules.map(item=>item.required)[0] === true),
                newData =  item.options.length>0 ? [{text: item['whetherShowAll'] ? '无' : '全部', value:''}].concat(item.options) : item.options,
                selectOptions = isShowAll ? item.options : newData;

            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            initialValue:isShowAll ? undefined : '',
                            ...item['fieldDecoratorOptions'],
                        })(
                            <CusComponent {...item['componentProps']} placeholder={`请选择${item['label']}`} >
                                {
                                    selectOptions.map((option,i)=>(
                                        <Option key={i} value={option.value}>{option.text}</Option>
                                    ))
                                }
                            </CusComponent>
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='taxableProject' || type==='taxClassCodingSelect' || type==='industry'){
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

        }else if(type==='roomCodeSelect'){
            // 给这个房间编码选择特殊对待，因为他的弹出窗组件需要修改这个值，就把setFieldsValue传到子组件下
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent fieldName={item['fieldName']} getFieldValue={getFieldValue} setFieldsValue={setFieldsValue} {...item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='fileUpload'){
            return(
                <Col key={i} span={item['span'] || 8} className={type==='fileUpload' ? 'fix-ie10-formItem-fileUpload' : ''}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            valuePropName: 'fileList',
                            getValueFromEvent:normFile,
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent setFieldsValue={fileList=>setFieldsValue({[item['fileName']]:fileList})} componentProps={item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='checkbox' || type==='radio'){
            return(
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            valuePropName: type,
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} />
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='checkboxGroup' || type==='cascader' || type==='radioGroup'){
            //TODO: 如果要显示垂直的 RadioGroup className="radioStyle" 否则不传
            return(
                <Col key={i} span={item['span'] || 8} className={(type==='checkboxGroup' || type==='radioGroup') ? 'fix-ie10-formItem-textArea' : ''}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions'],
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || `请选择${item['label']}` } options={item['options']} />
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='rangePicker'){
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || [`开始时间`,`结束时间`] } style={{width:'100%'}} />
                        )}
                    </FormItem>
                </Col>
            )
        }else if(type==='switch'){
            return (
                <Col key={i} span={item['span'] || 8}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            valuePropName: 'checked' ,
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || `请输入${item['label']}` } />
                        )}
                    </FormItem>
                </Col>
            )
        }else{
            return (
                <Col key={i} span={item['span'] || 8} className={type==='textArea' ? 'fix-ie10-formItem-textArea' : ''}>
                    <FormItem label={item['notLabel'] === true ? null : item['label']} {...formItemStyle}>
                        {getFieldDecorator(item['fieldName'],{
                            ...item['fieldDecoratorOptions']
                        })(
                            <CusComponent {...item['componentProps']} placeholder={ (item['componentProps'] && item['componentProps'].placeholder) || `请输入${item['label']}` } style={{width:'100%'}} />
                        )}
                    </FormItem>
                </Col>
            )
        }

    })

}

export default getFields

