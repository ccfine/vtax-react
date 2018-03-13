/**
 * Created by liurunbin on 2018/1/18.
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,message,Upload,Spin} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../../utils'
const transformData = data =>{
    return data.map(item=>{
        return {
            uid: item.id,
            name: item.originalFileName,
            status: 'done',
            response: 'success', // custom error message to show
            url: 'http://www.baidu.com/xxx.png',
        }
    })
}
class ButtonWithFileUploadModal extends Component{
    static propTypes={
        id:PropTypes.string,
        disabled:PropTypes.bool,
        size:PropTypes.string,
        uploadUrl:PropTypes.string,
        deleteUrl:PropTypes.string,
        readOnly:PropTypes.bool,
    }
    static defaultProps={
        title:'导入',
        disabled:false,
        size:'small',
        uploadUrl:'/account/prepaytax/upload/',
        deleteUrl:'/sys/file/delete',
        readOnly:false
    }
    state={
        visible:false,
        loaded:false,
        fileList:[]
    }
    toggleLoaded = loaded =>{
        this.setState({
            loaded
        })
    }
    toggleVisible = visible =>{
        if(visible){
            this.fetchFileList()
        }
        this.setState({
            visible
        })
    }
    handleDownload= id =>{
        let url =`${window.baseURL}sys/file/download/${id}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
        //window.open(url);
    }
    fetchFileList = (url=`/sys/file/list/${this.props.id}`) =>{
        this.toggleLoaded(false)
        request.get(url)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        fileList:transformData( data.data )
                    })
                }else{
                    message.error(`附件列表获取失败:${data.msg}`,4)
                }
            }).catch(err=>{
            this.toggleLoaded(true)
        })
    }
    deleteRecord=id=>{
        /*
        * 地址/文件uid
        * */
        return request.delete(`${this.props.deleteUrl}/${id}`).then(({data}) => {
            if (data.code === 200) {
                this.fetchFileList();
            } else {
                message.error(`文件删除失败:${data.msg}`, 4);
            }
        })
            .catch(err => {

            })
    }
    render(){
        const props = this.props;
        const { readOnly } = props;
        const {visible,loaded,fileList} = this.state;
        const uploadProps = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange({ file, fileList }) {

            },
            onPreview:(file)=>{
                this.handleDownload(file.uid)
            },
            onRemove: (file) => {

                /*this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });*/
                if( readOnly ){
                    return false;
                }else{
                    return this.deleteRecord(file.uid)
                }
            },
            beforeUpload: (file) => {
                const formData = new FormData();
                formData.append('files',file)
                request.post(`${props.uploadUrl}`,formData)
                    .then(({data})=>{
                        this.toggleLoaded(true)
                        if(data.code===200){
                            this.fetchFileList()
                        }else{
                            message.error(`附件上传失败:${data.msg}`,4)
                        }
                    }).catch(err=>{
                    this.toggleLoaded(true)
                })
                return false;
            },
            fileList
        };
        return(
            <span style={props.style}>
                    <Button size={props.size} onClick={()=>this.toggleVisible(true)} disabled={props.disabled}>
                   <Icon type="file" />{props.title}
               </Button>
                <Modal title='附件' visible={visible} maskClosable={false} destroyOnClose={true} onCancel={()=>this.toggleVisible(false)} footer={null}>
                    <Spin spinning={!loaded}>
                    <Upload {...uploadProps}>
                        {
                            !readOnly && (
                                <Button size='small'>
                                    <Icon type="upload" /> 上传
                                </Button>
                            )
                        }
                      </Upload>
                    </Spin>
                </Modal>
            </span>
        )
    }
}

export default ButtonWithFileUploadModal