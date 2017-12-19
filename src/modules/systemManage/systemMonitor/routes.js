/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const LogMonitoring =()=><div>日志监控</div>
const systemMaintain =()=><div>系统维护</div>

const PATH = `/web/systemManage/systemMonitor`;

const SystemMonitor_Routes = [
    {
        path:`${PATH}/LogMonitoring`,
        component:wrapPage('日志监控',LogMonitoring),
        name:'日志监控',
        exact:true,
    },{
        path:`${PATH}/systemMaintain`,
        component:wrapPage('系统维护',systemMaintain),
        name:'系统维护',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/LogMonitoring`,
    }
]

export default SystemMonitor_Routes