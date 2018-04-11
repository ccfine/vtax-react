/**
 * author       : liuliyuan
 * createTime   : 2018/3/20 10:42
 * description  :
 */
import React from 'react'
import {Spin} from 'antd'

export default ({isLoading, error}) => {
    // Handle the loading state
    if (isLoading) {
        return <Spin />;//<div style={{position:'fixed',left:'50%',top:'50%'}}><Spin size="large" /></div>;
    }
    // Handle the error state
    else if (error) {
        return <div>加载出错了！</div>;
    }
    else {
        return null;
    }
};