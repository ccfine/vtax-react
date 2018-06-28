/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
// import React from 'react'
import {wrapPage} from 'compoments'
// import strategies from 'config/routingAuthority.config'

import InterfaceMaintain from './InterfaceMaintain'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/systemManage/interfaceManage`
// const interfaceManage = strategies['systemManage']['interfaceManage']

const InterfaceManage_Routes = [
    {
        path:`${PATH}/interfaceMaintain`,
        component:wrapPage('接口维护',InterfaceMaintain),
        name:'接口维护',
        icon:{
            url:`${ICON_URL_PATH}interfaceMaintain.svg`,
            backgroundColor:'#7ED530'
        },
        // authorityInfo:interfaceManage['interfaceMaintain'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/interfaceMaintain`,
    }
]

export default InterfaceManage_Routes