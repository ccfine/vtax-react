import React from 'react'
import {Modal,Button,Popconfirm,message,Icon,List,Avatar,Row,Col,Upload} from 'antd'
import SearchTable from './SearchTableTansform.react'
import {request} from '../../../../../utils'
import moment from 'moment'
import { update } from 'immutable';

const getProps = context => ({
    action: `${window.baseURL}${context.props.url}/file/upload/${context.props.id}`,
    onChange: context.handleChange,
    multiple: false,
    headers:{
        Authorization:request.getToken(),
    },
    showUploadList:false,
    name:'files',
    beforeUpload:context.beforeUpload
});

class FileModal extends React.Component{
    state={
        uid:undefined,//正在上传文件uid
        loading: false,
        uploadLoading:false,
        data: []
    }
    beforeUpload = (file, fileList)=>{
        // 文件大小判断
        this.setState({uid:file.uid,uploadLoading:true});
        return true;
    }
    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.forEach((file) => {
            if (file.uid === this.state.uid && file.response) {
               // 判断文件上传是否成功
               if(file.response.code && file.response.data){
                    this.updateFileList(this.props.url,this.props.id);
               }else{
                    message.error('上传失败，请重试', 4);
               }
                
               this.setState({uid:undefined,uploadLoading:false});
            }
            return file;
          });
    }
    deleteRecord(record){
        request.delete(`/${this.props.url}/file/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                this.updateFileList(this.props.url,this.props.id);
            } else {
                message.error(data.msg, 4);
            }
        })
        .catch(err => {
            message.error(err.message);
        })
    }
    updateFileList=(url, id)=>{
        this.setState({loading:true});
                request.get(`/${url}/file/list/${id}`).then(({data}) => {
                    if (data.code === 200) {
                        this.setState({data:data.data,loading:false});
                    }
                }) 
    }
    componentWillReceiveProps(props){
          if(this.props.visible !== props.visible){
            if(props.id){
                this.updateFileList(props.url,props.id);
            }
          }
      }
      render(){
        const { loading, data } = this.state;
          return (
              <Modal
                title='附件信息'
                visible={this.props.visible}
                width='500px'
                bodyStyle={{height:"400px",overflow:"auto",padding:'20px'}}
                onCancel={()=>{this.props.hideModal()}}
                footer={[
                    <Button key="close" type="primary" onClick={this.props.hideModal}>
                    关闭
                    </Button>,
                ]}>
                 <Upload {...getProps(this)}> 
                    <Button loading={this.state.uploadLoading}>
                            <Icon type="upload" /> 上传
                    </Button>
                </Upload>
                    <List
                        style={{marginTop:'10px'}}
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                        <List.Item actions={[
                        <Popconfirm title="确定要删除吗?" onConfirm={()=>{this.deleteRecord(item)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                            <a style={{marginRight:"5px"}}>删除</a>
                        </Popconfirm>, <a href={`${window.baseURL}/${this.props.url}/file/download/${item.id}`} target="_blank">下载</a>]}>
                            <div style={{width:'100%',position:'static'}}>
                                <Row>
                                    <Col span={16}>
                                        <i className="anticon anticon-paper-clip"></i>
                                        <a style={{marginLeft:'10px'}} href={`${window.baseURL}/${this.props.url}/file/download/${item.id}`} target="_blank" title={item.originalFileName}>{item.originalFileName}</a>
                                    </Col>
                                    <Col span={8} style={{textAlign:'right'}}>
                                        {item.createdDate}
                                    </Col>
                                </Row>
                            </div>
                           
                        </List.Item>
                        )}
                    />
                   
              </Modal>
          );
      }
  }

  export default FileModal;