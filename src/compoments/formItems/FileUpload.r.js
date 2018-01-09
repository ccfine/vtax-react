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
        //const fileSize = this.props.componentProps.size;
        const props = {
            ...this.props,
            onRemove: () => {
                setFieldsValue(undefined)
            },
            beforeUpload: file => {
                //TODO:文件大小限制
                /*if(fileSize){
                    const isLtSize = file.size / 1024 / 1024 < fileSize;
                    if (!isLtSize) {
                        message.error(`文件大小不能超过${fileSize}mb`);
                        setFieldsValue(undefined)
                    }
                }
*/
                return false;
            },
        };
        return(
            <Upload {...props} {...props.componentProps} >
                <Button size="small" disabled={fileList && fileList.length>=1}>
                    <Icon type="upload" />{props.componentProps.buttonText}
                </Button>
                {
                    props.componentProps.explain && <span style={{color:'#ccc',marginLeft:5}}>{props.componentProps.explain}</span>
                }
            </Upload>
        )
    }
}