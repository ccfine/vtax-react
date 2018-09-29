/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {AsyncComponent} from 'compoments'

import BusinessReport_Routes from './businessReport/routes'
import { getChildOptions } from 'config/routingAuthority.config'

const BusinessReport = AsyncComponent(() => import('./businessReport'), '业务报表')

const PATH = `/web/reportManage`;
const ReportManage_Routes = [
    {
        path:`${PATH}/businessReport`,
        component:BusinessReport,
        name:'业务报表',
        exact:true,
        children:BusinessReport_Routes,
        authorityInfo:getChildOptions('reportManage','businessReport')
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/businessReport`,

    }
]

export default ReportManage_Routes