/**
 * Created by liurunbin on 2017/12/22.
 */
import React,{Component} from 'react'
import {Form,Select,Spin} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../utils'
const FormItem = Form.Item;
const Option = Select.Option
export default class TaxMain extends Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        formItemStyle:PropTypes.object,
        fieldName:PropTypes.string,
        initialValue:PropTypes.any,
        fieldTextName:PropTypes.string.isRequired,
        fieldValueName:PropTypes.string.isRequired,
        label:PropTypes.string.isRequired,
        url:PropTypes.string.isRequired,
        selectOptions:PropTypes.object,
        decoratorOptions:PropTypes.object
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
        initialValue:'',
        label:'field',
        selectOptions:{

        },
        decoratorOptions:{

        }
    }
    state={
        dataSource:[
        ],
        loaded:false
    }
    componentWillReceiveProps(nextProps){
        if(this.props.url !== nextProps.url){
            this.fetch(nextProps.url)
        }
    }
    componentDidMount(){
       this.fetch()
    }
    toggleLoaded=loaded=>{
        this.setState({
            loaded
        })
    }
    fetch(url){
        this.toggleLoaded(false)
        request.get(url || this.props.url)
            .then(({data}) => {
                if(data.code===200 && this.mounted){
                    this.toggleLoaded(true)
                    const result = data.data.records;
                    this.setState({
                        dataSource:result
                    })
                }
            });
    }
    mounted = true
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const {dataSource,loaded}=this.state;
        const {getFieldDecorator} = this.props.form;
        const {formItemStyle,fieldName,initialValue,fieldTextName,fieldValueName,label,selectOptions,decoratorOptions} = this.props;
        return(
            <Spin spinning={!loaded}>
                <FormItem label={label} {...formItemStyle}>
                    {getFieldDecorator(fieldName,{
                        initialValue,
                        ...decoratorOptions
                    })(
                        <Select
                            style={{ width: '100%' }}
                            {...selectOptions}
                        >
                            {
                                dataSource.map((item,i)=>(
                                    <Option key={i} value={item[fieldValueName]}>{item[fieldTextName]}</Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>
            </Spin>
        )
    }
}