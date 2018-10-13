/*
 * @Author: liuchunxiu 
 * @Date: 2018-06-21 16:05:27 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-22 16:17:10
 */
import React from 'react'
import {Form,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
import Tree from './SearchTree'
const FormItem = Form.Item;

// 将后台数据转换为前端需要的数据
const transformData =function transformData(arr,fieldValueName,fieldTextName){
    return arr.map(ele=>{
        let res = {
            key:ele[fieldValueName],
            value:ele[fieldValueName],
            title:`${ele.code}-${ele[fieldTextName]}`,
            parentId:ele["parentId"],
        };
        if(ele.children && ele.children.length>0){
            res.children = transformData(ele.children,fieldValueName,fieldTextName)
        }
        return res;
    })
}
export default class AsyncTreeSelect extends React.Component{
    static propTypes={
        form:PropTypes.object.isRequired,
        label:PropTypes.string,
        formItemStyle:PropTypes.object,
        initialValues:PropTypes.any,
        decoratorOptions:PropTypes.any,
        componentProps:PropTypes.any,
        fieldTextName:PropTypes.string,
        fieldValueName:PropTypes.string,
        
        url:PropTypes.string,
        fetchAble:PropTypes.bool,
        doNotFetchDidMount:PropTypes.bool,
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
        doNotFetchDidMount:false,
        decoratorOptions:{
        },
        fetchAble:true,
        fieldTextName:'',
        fieldValueName:'',
    }
    state = {
        dataSource:[]
    }
    fetch(url){
        if(!url)return
        request.get(url || this.props.url)
            .then(({data}) => {
                if(data.code===200){
                    const result = transformData(data.data.records || data.data,this.props.fieldValueName,this.props.fieldTextName);
                    this.setState({
                        dataSource:result
                    })
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentWillReceiveProps(nextProps){
        if(this.props.url !== nextProps.url){
            if(nextProps.fetchAble){
                this.fetch(nextProps.url)
            }
        }
    }
    componentDidMount(){
        !this.props.doNotFetchDidMount && this.fetch(this.props.url)
    }
    render() {
        const {dataSource} = this.state,
            {formItemStyle,fieldName,initialValue,decoratorOptions,label,componentProps} = this.props,
            {getFieldDecorator} = this.props.form;
        return(
                <FormItem label={label} {...formItemStyle}>
                    {getFieldDecorator(fieldName,{
                        initialValue: initialValue,
                        ...decoratorOptions
                    })(
                        <Tree 
                            checkable={true} 
                            treeData={dataSource}
                            {...componentProps}>
                        </Tree>
                    )}
                </FormItem>)
    }
}