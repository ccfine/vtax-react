/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Form,Select,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
const FormItem = Form.Item;
const Option = Select.Option
function fetchTaxMain(value, callback) {
    request.get(`/taxsubject/listByName`,{
        params:{
            name:value,
            ///size:100
        }
    })
        .then(({data}) => {
            if(data.code===200){
                const result = data.data.records || data.data;;
                const newData = [];
                result.forEach((r) => {
                    newData.push({
                        value: `${r.id}`,
                        text: r.name,
                    });
                });
                callback(newData);
            }
        })
        .catch(err => {
            message.error(err.message)
        });
}
export default class TaxMain extends Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        whetherShowAll:PropTypes.bool,
        notShowAll:PropTypes.bool,
        fieldDecoratorOptions:PropTypes.object,
        componentProps:PropTypes.object
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
        fieldName:'mainId',
        whetherShowAll:false,
        notShowAll:false,
        fieldDecoratorOptions:{
        }
    }
    state={
        mainTaxItems:[]
    }
    /*onSearch = (value) => {
        this.props.onSearch && this.props.onSearch(value)
        if(typeof value !== 'undefined' && value !== null){
            fetchTaxMain(value, data => {
                this.mounted && this.setState({
                    mainTaxItems:data
                })
            });
        }
    }*/
    componentDidMount(){
        fetchTaxMain('',data => {
            this.mounted && this.setState({
                mainTaxItems: data
            })
        });
    }
    mounted = true
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const {mainTaxItems}=this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,fieldDecoratorOptions,componentProps,whetherShowAll,notShowAll} = this.props;
        //TODO:为了设置所有不是必填的select都加上一个全部默认选项   notShowAll:是否添加无或者全部
        let optionsData = [], initialValue;
        if(notShowAll === true){
            optionsData = mainTaxItems;
        }else{
            const isShowAll = fieldDecoratorOptions && fieldDecoratorOptions.rules && fieldDecoratorOptions.rules.map(item=>item.required)[0] === true,
                newData =  mainTaxItems.length>0 ? [{text: whetherShowAll ? '无' : '全部', value:''}].concat(mainTaxItems) : mainTaxItems;
            if(componentProps && componentProps.labelInValue === true){
                initialValue = (fieldDecoratorOptions && fieldDecoratorOptions.initialValue) || (isShowAll ? undefined : {key:'',label:'全部'});
            }else{
                initialValue = (fieldDecoratorOptions && fieldDecoratorOptions.initialValue) || (isShowAll ? undefined : '');
            }
            optionsData = isShowAll ? mainTaxItems : newData;
        }

        return(
            <FormItem label='纳税主体' {...formItemStyle}>
                {getFieldDecorator(fieldName,{
                    initialValue:initialValue,
                    ...fieldDecoratorOptions,
                })(
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择纳税主体"
                        optionFilterProp="children"
                        //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        // onSearch={this.onSearch}
                        //labelInValue={true}
                        {...componentProps}
                    >
                        {
                            optionsData.map((item,i)=>(
                                <Option key={i} value={item.value}>{item.text}</Option>
                            ))
                        }
                    </Select>
                )}
            </FormItem>
        )
    }
}