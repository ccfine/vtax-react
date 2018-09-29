/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'

const RoleManage = AsyncComponent(() => import('./roleManage'), '角色管理')
const UserManage = AsyncComponent(() => import('./userManage'), '用户管理')
const RoleManagementDetail = AsyncComponent(() => import('./roleManage/roleManagementDetail'), '角色管理详情')
const UserManagementDetail = AsyncComponent(() => import('./userManage/userManagementDetail'), '用户管理详情')

const ICON_URL_PATH = '/assets/routes_avatar/';
const PATH = `/web/systemManage/userPermissions`;

const UserPermissions_Routes = [
    {
        path:`${PATH}/roleManage`,
        component:RoleManage,
        name:'角色管理',
        icon:{
            url:`${ICON_URL_PATH}roleManage.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATH}/userManage`,
        component:UserManage,
        name:'用户管理',
        icon:{
            url:`${ICON_URL_PATH}userManage.svg`,
            backgroundColor:'#F5A544'
        },
        exact:true,
    /*},{
        path:`${PATH}/userRightsManage`,
        component:wrapPage('用户权限管理',UserRightsManage),
        name:'用户权限管理',
        icon:{
            url:`${ICON_URL_PATH}userRightsManage.svg`,
            backgroundColor:'#7ED431'
        },
        authorityInfo:userPermissions['basicInfo'].options,
        exact:true,*/
    },{
        path:`${PATH}/roleManage/:id`,
        component:RoleManagementDetail,
        name:'角色管理详情',
        exact:true
    },{
        path:`${PATH}/userManage/:id`,
        component:UserManagementDetail,
        name:'用户管理详情',
        exact:true
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/roleManage`,
    }
]

export default UserPermissions_Routes