/**
 * author       : liuliyuan
 * createTime   : 2017/12/29 9:57
 * description  :
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Button,Icon} from 'antd';

const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
class FileExport extends Component{

    static propTypes={
        fileExportProps:PropTypes.object.isRequired,
        url:PropTypes.string.isRequired,
    }

    static defaultProps={
        setButtonStyle:{
            marginRight:5
        },
        size:'small',
        title:'导出',
        disabled:true,
    }

    handleDownload=()=>{
        const {filters} = this.props.fileExportProps;
        let url =`${window.baseURL}${this.props.url}?${parseJsonToParams(filters)}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
        //window.open(url);
    }

    render(){
        const {title,size,setButtonStyle,disabled} = this.props.fileExportProps;
        return(
            <Button size={size} style={{...setButtonStyle}} disabled={disabled} onClick={this.handleDownload.bind(this)}>
                <Icon type="download" /> {title}
            </Button>
        )
    }
}

export default FileExport