/**
 * Created by liurunbin on 2018/1/5.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Button,Icon,Upload} from 'antd'
export default class FileUpload extends Component{
    state = {
        fileList: [],
        uploading: false,
    }
    static propTypes = {
        setFieldsValue:PropTypes.func.isRequired
    }
    static defaultProps = {
        componentProps:{
            name:'file',
            action:'/',
            buttonText:'Click to upload',
            multiple:false
        }
    }
    render(){
        const {setFieldsValue,fileList} = this.props;
        const props = {
            ...this.props,
            onRemove: () => {
                setFieldsValue(undefined)
            },
            beforeUpload: () => {
                return false;
            },
        };
        return(
            <Upload {...props} {...props.componentProps} >
                <Button disabled={fileList && fileList.length>=1}>
                    <Icon type="upload" />{props.componentProps.buttonText}
                </Button>
                <span style={{color:'#ccc',marginLeft:5}}>文件格式为.XLS,并且不超过5M</span>
            </Upload>
        )
    }
}