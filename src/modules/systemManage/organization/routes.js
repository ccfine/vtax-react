/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
import OrganizationalStructureMaintenance from './organizationalStructureMaintenance'
import strategies from 'config/routingAuthority.config'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/systemManage/organization`
const organization = strategies['systemManage']['organization'];

const Organization_Routes = [
    {
        path:`${PATH}/organizationalStructureMaintenance`,
        component:wrapPage('组织架构维护',OrganizationalStructureMaintenance),
        name:'组织架构维护',
        icon:{
            url:`${ICON_URL_PATH}organizationalStructureMaintenance.svg`,
            backgroundColor:'#6CCCCA'
        },
        authorityInfo:organization['organizationalStructureMaintenance'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/organizationalStructureMaintenance`,
    }
]

export default Organization_Routes