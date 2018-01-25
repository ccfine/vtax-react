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
        if(typeof data[key] !== 'undefined' && data[key] !== ''){
            str += `${key}=${data[key]}&`
        }
    }
    return str;
}
class FileExport extends Component{

    static propTypes={
        setButtonStyle:PropTypes.object,
        url:PropTypes.string.isRequired,
        title:PropTypes.string.isRequired,
        params:PropTypes.object
    }

    static defaultProps={
        setButtonStyle:{
        },
        size:'small',
    }

    handleDownload=()=>{
        const {params,url} = this.props;
        let nextUrl =`${window.baseURL}${url}`;

        if(params){
            nextUrl += `?${parseJsonToParams(params)}`;
        }

        let elemIF = document.createElement("iframe");
        elemIF.src = nextUrl;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
        //window.open(url);
    }

    render(){
        const {setButtonStyle,size,title,disabled} = this.props;
        return(
            <Button size={size} style={{...setButtonStyle}} disabled={disabled} onClick={this.handleDownload.bind(this)}>
                <Icon type="download" /> {title}
            </Button>
        )
    }
}

export default FileExport