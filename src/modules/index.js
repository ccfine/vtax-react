
/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:05
 * description  :
 */
/*
import {request} from 'utils'

export default ()=>{
    request.get('/permissions').then(({data})=>{
    let str = ``;

    let lookStr = [];
    (data.code === 200) &&
    data.data.forEach(element => {
        str += element.moduleName;
        let moduleStr = ``;
        element.permissionVOs.forEach(item=>{
            str+=`  ${item.actionName}-'${item.permissionId}'`
            item.permissionId.endsWith('1002') && lookStr.push(item.permissionId)
            moduleStr+=`'${item.permissionId}',`
        })
        str+='\n'
        console.log(element.moduleName+moduleStr)
    });

    console.log(str)
    console.log('查看:',"['"+lookStr.toString().replace(/,/g,`','`)+"']")
})

request.get('/oauth/flashDb').then(({data})=>{
    console.log('清理成功')
})
}*/
