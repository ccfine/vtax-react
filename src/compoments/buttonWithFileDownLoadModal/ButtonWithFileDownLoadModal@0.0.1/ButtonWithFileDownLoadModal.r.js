/**
 * Created by liurunbin on 2018/1/18.
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,Row,message,Popconfirm,Col,List} from 'antd'
import PropTypes from 'prop-types'
import {request} from '../../../utils'
class ButtonWithFileDownLoadModal extends Component{
    static propTypes={
        title:PropTypes.string,
        deleteOptions:PropTypes.shape({
            url:PropTypes.string.isRequired,
            fieldName:PropTypes.string
        }),
        fetchOptions:PropTypes.shape({
            url:PropTypes.string
        }).isRequired,
        downLoadOptions:PropTypes.shape({
            url:PropTypes.string
        })
    }
    static defaultProps={
        title:'导入'
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
            this.fetchFileList(this.props.fetchOptions.url)
        }
        this.setState({
            visible
        })
    }
    handleDownload= id =>{
        let url =`${window.baseURL}${this.props.downLoadOptions.url}/${id}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
        //window.open(url);
    }
    fetchFileList = url =>{
        this.toggleLoaded(false)
        request.get(url)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        fileList:data.data
                    })
                }else{
                    message.error(`附件列表获取失败:${data.msg}`,4)
                }
            }).catch(err=>{
            this.toggleLoaded(true)
        })
    }
    deleteRecord=id=>{
        request.delete(`/${this.props.deleteOptions.url}/${id}`).then(({data}) => {
            if (data.code === 200) {
                this.updateFileList(this.props.fetchOptions.url);
            } else {
                message.error(`文件删除失败:${data.msg}`, 4);
            }
        })
            .catch(err => {
                this.toggleLoaded(true)
            })
    }
    render(){
        const props = this.props;
        const {deleteOptions}  = this.props;
        const {visible,loaded,fileList} = this.state;
        return(
            <span style={props.style}>
               <Button size='small' onClick={()=>this.toggleVisible(true)}>
                   <Icon type="file" />{props.title}
               </Button>
                <Modal title='附件下载' visible={visible} onCancel={()=>this.toggleVisible(false)} footer={null}>
                        <List
                            loading={!loaded}
                            itemLayout="horizontal"
                            dataSource={fileList}
                            renderItem={item => (
                                <List.Item style={{paddingTop:4,paddingBottom:4}} actions={[
                                    deleteOptions ?
                                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{this.deleteRecord(item)}} onCancel={()=>{}} okText="确定" cancelText="取消">
                                        <a style={{marginRight:"5px"}}>删除</a>
                                    </Popconfirm> : null, <a  onClick={()=>this.handleDownload(item.id)}>下载</a>].filter(item=>item)}>
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
            </span>
        )
    }
}

export default ButtonWithFileDownLoadModal