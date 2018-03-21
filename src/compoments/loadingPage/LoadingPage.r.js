/**
 * author       : liuliyuan
 * createTime   : 2018/3/20 10:42
 * description  :
 */
import React from 'react'
import {Spin} from 'antd'

export default ({ error, isLoading })=> {
    if (error) {
        return <div>加载出错了！</div>;
    } else if (isLoading) {
        return <div style={{position:'fixed',left:'50%',top:'50%'}}><Spin size="large" /></div>;
    } else {
        return null;
    }
}