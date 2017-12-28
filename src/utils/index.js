/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 18:09
 * description  :
 */
import request from './request'
import composeMenus from './composeMenus'
import regRules from './regRules'
import getFields from './getFields'

const fMoney = (s,n=2)=>{

    if(s === "" || s === 0 || typeof (s) === 'undefined'){
        return '0.00';
    }else{
        n = n > 0 && n <= 20 ? n : 2;
        s = Math.floor(parseFloat((s + "").replace(/[^\d\\.-]/g, "")) * 100 ) /100 + "";
        let l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1] || 0;
        if(r===0 || r.length ===1){
            r+='0';
        }
        let t = "";
        for(let i = 0; i < l.length; i ++ )
        {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
}

const getQueryString=name=>{
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!==null)return  decodeURI(r[2]); return null;
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
    })
}
const requestDict = async (type,callback)=>{
    let result = await getDict(type);
    callback(result)
}
export {
    regRules,
    request,
    fMoney,
    getQueryString,
    composeMenus,
    requestDict,
    getFields
}