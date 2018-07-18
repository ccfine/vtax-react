import React from 'react'
import {Button,Icon} from 'antd'
export default class FileCenter extends React.Component{
    render(){
        return <div>
        <h2 className='help-title'>
            文档中心
        </h2>
        <div className='help-item'>
            <h4 className='help-item-title'>系统操作手册</h4>
            <ul className='download-list'>
                <li>
                    《碧桂园纳税申报系统操作手册》
                    <Button type="primary" size='small'><Icon type="download" />下载</Button>
                </li>
            </ul>
        </div>
    </div>
    }
}