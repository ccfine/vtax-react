/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const OrganizationalStructureMaintenance =()=><div>组织架构维护</div>

const PATH = `/web/systemManage/organization`;

const Organization_Routes = [
    {
        path:`${PATH}/organizationalStructureMaintenance`,
        component:wrapPage('组织架构维护',OrganizationalStructureMaintenance),
        name:'组织架构维护',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/organizationalStructureMaintenance`,
    }
]

export default Organization_Routes