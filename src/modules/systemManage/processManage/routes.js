/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const ProcessConfiguration =()=><div>流程配置</div>
const ApproveTheConfiguration =()=><div>审批配置</div>

const PATH = `/web/systemManage/processManage`;

const ProcessManage_Routes = [
    {
        path:`${PATH}/processConfiguration`,
        component:wrapPage('流程配置',ProcessConfiguration),
        name:'流程配置',
        exact:true,
    },{
        path:`${PATH}/approveTheConfiguration`,
        component:wrapPage('审批配置',ApproveTheConfiguration),
        name:'审批配置',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/interfaceMaintain`,
    }
]

export default ProcessManage_Routes