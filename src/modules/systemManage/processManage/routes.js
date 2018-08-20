/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from 'compoments'
import strategies from 'config/routingAuthority.config'

const ProcessConfiguration =()=><div>流程配置</div>
const ApproveTheConfiguration =()=><div>审批配置</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/systemManage/processManage`
const processManage = strategies['systemManage']['processManage']

const ProcessManage_Routes = [
    {
        path:`${PATH}/processConfiguration`,
        component:wrapPage('流程配置',ProcessConfiguration),
        name:'流程配置',
        icon:{
            url:`${ICON_URL_PATH}processConfiguration.svg`,
            backgroundColor:'#55C6F2'
        },
        authorityInfo:processManage['processConfiguration'].options,
        exact:true,
    },{
        path:`${PATH}/approveTheConfiguration`,
        component:wrapPage('审批配置',ApproveTheConfiguration),
        name:'审批配置',
        icon:{
            url:`${ICON_URL_PATH}approveTheConfiguration.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:processManage['approveTheConfiguration'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/interfaceMaintain`,
    }
]

export default ProcessManage_Routes