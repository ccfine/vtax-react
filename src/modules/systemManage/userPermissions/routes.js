/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from 'compoments'
import RoleManage from './roleManage'
import UserManage from './userManage'
import UserManagementDetail from './userManage/userManagementDetail'
import RoleManagementDetail from './roleManage/roleManagementDetail'

const UserRightsManage =()=><div>用户权限管理</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/systemManage/userPermissions`

const UserPermissions_Routes = [
    {
        path:`${PATH}/roleManage`,
        component:wrapPage('角色管理',RoleManage),
        name:'角色管理',
        icon:{
            url:`${ICON_URL_PATH}roleManage.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATH}/userManage`,
        component:wrapPage('用户管理',UserManage),
        name:'用户管理',
        icon:{
            url:`${ICON_URL_PATH}userManage.svg`,
            backgroundColor:'#F5A544'
        },
        exact:true,
    },{
        path:`${PATH}/userRightsManage`,
        component:wrapPage('用户权限管理',UserRightsManage),
        name:'用户权限管理',
        icon:{
            url:`${ICON_URL_PATH}userRightsManage.svg`,
            backgroundColor:'#7ED431'
        },
        exact:true,
    },{
        path:`${PATH}/roleManage/:id`,
        component:wrapPage('角色管理详情',RoleManagementDetail),
        name:'角色管理详情',
        exact:true
    },{
        path:`${PATH}/userManage/:userName`,
        component:wrapPage('用户管理详情',UserManagementDetail),
        name:'用户管理详情',
        exact:true
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/roleManage`,
    }
]

export default UserPermissions_Routes