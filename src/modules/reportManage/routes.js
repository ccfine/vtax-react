/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {AsyncComponent} from 'compoments'

import business_Routes from './business/routes'
import DataSource_Routes from './dataSource/routes'
import progressAnalysis_Routes from './progressAnalysis/routes'

import { getChildOptions } from 'config/routingAuthority.config'

const business = AsyncComponent(() => import('./business'), '业务报表')
const DataSource = AsyncComponent(() => import('./dataSource'), '数据源报表')
const ProgressAnalysis = AsyncComponent(() => import('./progressAnalysis'), '进度分析报表')

const PATH = `/web/reportManage`;
const ReportManage_Routes = [
    {
        path:`${PATH}/business`,
        component:business,
        name:'业务报表',
        exact:true,
        children:business_Routes,
        authorityInfo:getChildOptions('reportManage','business')
    },
    {
        path:`${PATH}/dataSource`,
        component:DataSource,
        name:'数据源报表',
        exact:true,
        children:DataSource_Routes,
        authorityInfo:getChildOptions('reportManage','dataSource')
    },
    {
        path:`${PATH}/progressAnalysis`,
        component:ProgressAnalysis,
        name:'进度分析报表',
        exact:true,
        children:progressAnalysis_Routes,
        authorityInfo:getChildOptions('reportManage','progressAnalysis')
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/business`,

    }
]

export default ReportManage_Routes