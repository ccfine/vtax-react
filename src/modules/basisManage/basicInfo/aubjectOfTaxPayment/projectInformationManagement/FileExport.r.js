/**
 * author       : liuliyuan
 * createTime   : 2017/12/27 12:32
 * description  :
 */
import React,{Component} from 'react';
import {Button,Icon} from 'antd';

class FileExport extends Component{

    handleDownload=()=>{
        let url =`${window.baseURL}${this.props.url}`;
        let elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        window.document.body.appendChild(elemIF);
    }

    render(){
        return(
            <div style={{display:'inline-block',marginRight:15}}>
                <Button size="small" style={{marginTop:10}} onClick={this.handleDownload.bind(this)}>
                    <Icon type="download" /> {this.props.title}
                </Button>
            </div>
        )
    }
}

export default FileExport