/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'

import Organization from './organization'
import UserPermissions from './userPermissions'
import InterfaceManage from './interfaceManage'
import ProcessManage from './processManage'
import SystemMonitor from './systemMonitor'

const SystemManage_PATH = `/web/systemManage`;
const SystemManage_routes = [
    {
        path:`${SystemManage_PATH}/organization`,
        component:wrapPage('组织架构',Organization),
        name:'组织架构'
    },{
        path:`${SystemManage_PATH}/userPermissions`,
        component:wrapPage('用户权限',UserPermissions),
        name:'用户权限'
    },{
        path:`${SystemManage_PATH}/interfaceManage`,
        component:wrapPage('接口管理',InterfaceManage),
        name:'接口管理'
    },{
        path:`${SystemManage_PATH}/processManage`,
        component:wrapPage('流程管理',ProcessManage),
        name:'流程管理'
    },{
        path:`${SystemManage_PATH}/systemMonitor`,
        component:wrapPage('系统监控',SystemMonitor),
        name:'系统监控'
    },{
        path:`${SystemManage_PATH}`,
        redirect:true,
        to:`${SystemManage_PATH}/organization`,
    }
]

export default SystemManage_routes