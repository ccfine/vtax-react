import React,{Component} from 'react';
import {message,Upload,Button,Icon} from 'antd';
import {connect} from 'react-redux'


class AutoFileUpload extends Component{
    state={
        loading:false
    }
    onChange=info=>{
        if (info.file.status === 'uploading') {
            this.setState({loading:true})
        }
        if (info.file.status === 'done') {
            if(info.file.response.code===200){
                message.success(`${info.file.name} 上传成功`);
                this.props.fetchTable_1_Data()
            }else {
                message.error(info.file.response.msg);
            }
            this.setState({loading:false})
        }
        if(info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
            this.setState({loading:false});
        }
    }
    //不设置accept的原因是设置之后osx下弹出文件选择会特别慢
    getUpLoadProps = props => ({
        name: 'files',
        action:`${window.baseURL+this.props.url}`,
        headers: {
            Authorization:props.token,
        },
        showUploadList:false
    });
    render(){
        let {loading} = this.state;
        return(
            <div style={{display:'inline-block',marginRight:5}}>
                    <Upload {...this.getUpLoadProps(this.props)} onChange={this.onChange.bind(this)}>
                            <Button size="small" style={{marginTop:10}} loading={loading}>
                                <Icon type="upload" /> 导入
                            </Button>
                    </Upload>
            </div>
        )
    }
}

export default connect(state=>({
    token:state.user.get('token')
}))(AutoFileUpload)