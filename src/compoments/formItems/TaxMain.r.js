/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Form,Select} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
const FormItem = Form.Item;
const Option = Select.Option
let timeout;
let currentValue;
function fetchTaxMain(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const fetch = ()=> {
        request.get(`/taxsubject/listByName`,{
            params:{
                name:value
            }
        })
            .then(({data}) => {
                if(data.code===200 && currentValue === value){

                    const result = data.data.records;
                    const newData = [];
                    result.forEach((r) => {
                        newData.push({
                            value: `${r.id}`,
                            text: r.name,
                        });
                    });
                    callback(newData);
                }
            });
    }

    timeout = setTimeout(fetch, 300);
}
export default class TaxMain extends Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        initialValue:PropTypes.any,
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
        initialValue:'',
        fieldDecoratorOptions:{

        }
    }
    state={
        mainTaxItems:[
        ]
    }
    onSearch = (value) => {
        fetchTaxMain(value, data => this.setState({ mainTaxItems:data }));
    }
    render(){
        const {mainTaxItems}=this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue,fieldDecoratorOptions,componentProps} = this.props;
        return(
            <FormItem label='纳税主体' {...formItemStyle}>
                {getFieldDecorator(fieldName,{
                    initialValue,
                    ...fieldDecoratorOptions
                })(
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        onSearch={this.onSearch}
                        {...componentProps}
                    >
                        {
                            mainTaxItems.map((item,i)=>(
                                <Option key={i} value={item.value}>{item.text}</Option>
                            ))
                        }
                    </Select>
                )}
            </FormItem>
        )
    }
}