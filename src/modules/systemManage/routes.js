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

const PATH = `/web/systemManage`;
const SystemManage_Routes = [
    {
        path:`${PATH}/organization`,
        component:wrapPage('组织架构',Organization),
        name:'组织架构',
        exact:true,
    },{
        path:`${PATH}/userPermissions`,
        component:wrapPage('用户权限',UserPermissions),
        name:'用户权限',
        exact:true,
    },{
        path:`${PATH}/interfaceManage`,
        component:wrapPage('接口管理',InterfaceManage),
        name:'接口管理',
        exact:true,
    },{
        path:`${PATH}/processManage`,
        component:wrapPage('流程管理',ProcessManage),
        name:'流程管理',
        exact:true,
    },{
        path:`${PATH}/systemMonitor`,
        component:wrapPage('系统监控',SystemMonitor),
        name:'系统监控',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/organization`,
    }
]

export default SystemManage_Routes