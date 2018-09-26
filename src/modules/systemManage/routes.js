/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {AsyncComponent} from 'compoments'

//import InterfaceManage from './interfaceManage'
/*import ProcessManage from './processManage'
import SystemMonitor from './systemMonitor'*/
import Organization_Routes from './organization/routes'
import UserPermissions_Routes from './userPermissions/routes'
import SystemMaintain_Routes from './systemMaintain/routes'
//import InterfaceManage_Routes from './interfaceManage/routes'
/*import ProcessManage_Routes from './processManage/routes'
import SystemMonitor_Routes from './systemMonitor/routes'*/

const Organization = AsyncComponent(() => import('./organization'), '组织架构')
const UserPermissions = AsyncComponent(() => import('./userPermissions'), '用户权限')
const SystemMaintain = AsyncComponent(() => import('./systemMaintain'), '系统维护')
const QueryLog = AsyncComponent(() => import("./queryLog"), "查询日志")
const ImportData = AsyncComponent(() => import('./importData'), '导入')

const PATH = `/web/systemManage`;
let SystemManage_Routes = [
    {
        path:`${PATH}/organization`,
        component:Organization,
        name:'组织架构',
        exact:true,
        children:Organization_Routes,
    },{
        path:`${PATH}/userPermissions`,
        component:UserPermissions,
        name:'用户权限',
        exact:true,
        children:UserPermissions_Routes,
    },{
        path:`${PATH}/systemMaintain`,
        component:SystemMaintain,
        name:'系统维护',
        exact:true,
        children:SystemMaintain_Routes,
        /*},{
         path:`${PATH}/interfaceManage`,
         component:wrapPage('接口管理',InterfaceManage),
         name:'接口管理',
         exact:true,
         children:InterfaceManage_Routes,
         },{
         path:`${PATH}/processManage`,
         component:wrapPage('流程管理',ProcessManage),
         name:'流程管理',
         exact:true,
         children:ProcessManage_Routes,
         authorityInfo:systemManage['processManage'].options,
         },{
         path:`${PATH}/systemMonitor`,
         component:wrapPage('系统监控',SystemMonitor),
         name:'系统监控',
         exact:true,
         children:SystemMonitor_Routes,
         authorityInfo:systemManage['systemMonitor'].options,*/
    },
    {
      path: `${PATH}/queryLog`,
      component: QueryLog,
      name: "查询日志",
      exact: true
    },
    {
        path:`${PATH}/importData`,
        component:ImportData,
        name:'导入',
        exact:true,
        isProd:window.isProd,
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/organization`,
    }
]

export default SystemManage_Routes