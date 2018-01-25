/**
 * author       : liuliyuan
 * createTime   : 2017/12/29 9:57
 * description  :
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Button,Icon} from 'antd';

class FileExport extends Component{

    static propTypes={
        setButtonStyle:PropTypes.object,
        url:PropTypes.string.isRequired,
        title:PropTypes.string.isRequired,
    }

    static defaultProps={
        setButtonStyle:{
        },
        size:'small',
    }

    handleDownload=()=>{
        let url =`${window.baseURL}${this.props.url}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
        //window.open(url);
    }

    render(){
        const {setButtonStyle,size,title} = this.props;
        return(
            <Button size={size} style={{...setButtonStyle}} onClick={this.handleDownload.bind(this)}>
                <Icon type="download" /> {title}
            </Button>
        )
    }
}

export default FileExport