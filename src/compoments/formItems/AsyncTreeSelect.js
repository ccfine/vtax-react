/*
 * @Author: liuchunxiu 暂时未用，先放这里，带官方更完善些可考虑用
 * @Date: 2018-06-21 16:05:27 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-25 19:07:49
 */
import React from 'react'
import {TreeSelect,Spin,Form,message} from 'antd'
import PropTypes from 'prop-types'
import {request} from 'utils'
const FormItem = Form.Item;


const transformData =function transformData(arr,fieldValueName,fieldTextName){
    return arr.map(ele=>{
        let res = {
            key:ele.id,
            value:ele[fieldValueName],
            title:ele[fieldTextName],
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
        initialValue:PropTypes.any,
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
        loaded: false,
        dataSource:[]
    }
    toggleLoaded=loaded=>{
        this.setState({
            loaded
        })
    }
    fetch(url){
        if(!url)return
        this.toggleLoaded(false)
        request.get(url || this.props.url)
            .then(({data}) => {
                if(data.code===200){
                    // this.toggleLoaded(true)
                    const result = transformData(data.data.records || data.data,this.props.fieldValueName,this.props.fieldTextName);
                    // 必须一起更新,分开调用两次render，在这种时候setState并未合并
                    this.setState({
                        dataSource:result,
                        loaded:true
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
        const {loaded,dataSource} = this.state,
            {formItemStyle,fieldName,initialValue,decoratorOptions,label,componentProps} = this.props,
            {getFieldDecorator} = this.props.form;
        return(<Spin spinning={!loaded}>
                {loaded && <FormItem label={label} {...formItemStyle}>
                    {getFieldDecorator(fieldName,{
                                initialValue: initialValue,
                                ...decoratorOptions
                    })(
                        <TreeSelect 
                            treeData={dataSource}  
                            treeCheckable={true} 
                            searchPlaceholder={`请选择${label}`}
                            {...componentProps}>
                        </TreeSelect>
                    )}
                </FormItem>
                }
            </Spin>)
    }
}