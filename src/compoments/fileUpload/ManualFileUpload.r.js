/**
 * author       : liuliyuan
 * createTime   : 2018/1/4 10:46
 * description  :
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Upload,Button,Icon} from 'antd';


class ManualFileUpload extends Component{
    state = {
        fileList:[],
    }
    static propTypes={
        name:PropTypes.string,
        btnSize:PropTypes.string,
    }
    static defaultProps={
        name:'导入',
        btnSize:'default'
    }

    getUpLoadProps = props => ({
        onRemove: (file) => {
            this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                this.props.setFileList(newFileList);
                return {
                    fileList: newFileList,
                };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ fileList }) => ({
                fileList: [...fileList, file],
            }),()=>{
                this.props.setFileList(this.state.fileList);
            });
            return false;
        },
        fileList: this.state.fileList,
    });

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value){
            this.setState({
                fileList:nextProps.value
            })
        }
    }
    render(){
        const {btnSize,name} = this.props;
        return(
            <div style={{display:'inline-block',marginRight:15}}>
                <Upload {...this.getUpLoadProps(this.props)}>
                    <Button size={btnSize}>
                        <Icon type="upload" /> {name}
                    </Button>
                </Upload>
            </div>
        )
    }
}

export default ManualFileUpload