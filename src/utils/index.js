/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 18:09
 * description  :
 */
import React from 'react';
import {message} from 'antd'
import request from './request'
import composeMenus from './composeMenus'
import regRules from './regRules'
import getFields from './getFields'
import {BigNumber} from 'bignumber.js'
import composeBotton from './composeBotton';

const fMoney = (s,n=2)=>{
    if(s === "" || s === 0 || typeof (s) === 'undefined'){
        return '0.00';
    }
    n = n > 0 && n <= 20 ? n : 2;
    /**添加一下代码 大数字用parseFloat不精确 */
    s = s.toString().replace(/[^\d\\.-]/g, "");
    try{
        return (new BigNumber(s)).toFormat(n);
    }catch(e){
        console.warn('fMoney error：',e)
        return '';
    }

    // s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
    // /**过滤负号 .replace(/-/g,'') 解决负数转换 2018/3/19*/
    // let l = s.split(".")[0].replace(/-/g,'').split("").reverse(),
    //     r = s.split(".")[1];
    // let t = "";
    // for (let i = 0; i < l.length; i++) {
    //     t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    // }
    // /**添加负号 (s.indexOf('-')>-1?"-":"") + 解决负数转换 2018/3/19*/
    // return  (s.indexOf('-')>-1?"-":"") + t.split("").reverse().join("") + "." + r;
}
const getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}
const getDict = type => {
    return new Promise(function (resolve, reject) {
        request.get(`/sys/dict/listBaseInfo/${type}`)
            .then(({data})=>{
                if(data.code===200){
                    resolve(data.data)
                }else{
                    reject(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    })
}
const requestDict = async (type,callback)=>{
    let result = await getDict(type);
    callback(result)
}

//获取html
const htmlDecode = html =>{
    if(html){
        let div = document.createElement( 'div' );
        div.innerHTML = html;
        return div.textContent;
    }
};

//将0.5转换成50%
const toPercent = val => {
    let valNum = Number(val);
    if (isNaN(valNum)){
         return val;
    }else if (valNum === 0) {
        return valNum;
    }
    return `${valNum * 100}%`;
};

//将50%转换成0.5
const fromPercent = val=>{
    let valTrim = val.replace?val.replace('%',''):val;
    let valNum = Number(valTrim);
    if(isNaN(valNum))return val;
    return valNum/100;
}

// 提交、撤回相关 状态显示
const transformDataStatus = status =>{
    status = parseInt(status,0)
    if(status===1){
        return '暂存';
    }
    if(status===2){
        return '提交'
    }
    return status
}
const listMainResultStatus = (statusParam) =>{
    return (statusParam && statusParam.status) && <div style={{marginRight: 30, display: 'inline-block'}}>
                                <span style={{marginRight: 20}}>状态：<label style={{color: '#f5222d'}}>{
                                    transformDataStatus(statusParam.status)
                                }</label></span>
        {
            statusParam.lastModifiedDate && <span>提交时间：{statusParam.lastModifiedDate}</span>
        }
    </div>
}

//设置select值名不同
const setFormat = data =>{
    return data.map(item=>{
        return{
            //...item,
            value:item.id,
            text:item.name
        }
    })
}

const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        if(typeof data[key] !== 'undefined' && data[key] !== ''){
            str += `${key}=${data[key]}&`
        }
    }
    return str;
}
const getResultStatus = (url,filters) => {
    return new Promise(function (resolve, reject) {
        request.get(url,{
                params:filters
            })
            .then(({data}) => {
                if(data.code===200){
                    resolve(data.data)
                }else{
                    reject(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    })
}
const requestResultStatus = async (url,filters,callback)=>{
    let result = await getResultStatus(url,filters);
    callback(result)
}

export {
    regRules,
    request,
    fMoney,
    getUrlParam,
    composeMenus,
    requestDict,
    getFields,
    htmlDecode,
    toPercent,
    fromPercent,
    listMainResultStatus,
    composeBotton,
    setFormat,
    parseJsonToParams,
    requestResultStatus,
}