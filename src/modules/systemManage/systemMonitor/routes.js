/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const LogMonitoring =()=><div>日志监控</div>
const systemMaintain =()=><div>系统维护</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/systemManage/systemMonitor`;

const SystemMonitor_Routes = [
    {
        path:`${PATH}/logMonitoring`,
        component:wrapPage('日志监控',LogMonitoring),
        name:'日志监控',
        icon:{
            url:`${ICON_URL_PATH}logMonitoring.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATH}/systemMaintain`,
        component:wrapPage('系统维护',systemMaintain),
        name:'系统维护',
        icon:{
            url:`${ICON_URL_PATH}systemMaintain.svg`,
            backgroundColor:'#7ED530'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/logMonitoring`,
    }
]

export default SystemMonitor_Routes