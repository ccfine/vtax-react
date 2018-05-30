/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from 'compoments'
import BusinessReport from './businessReport'
/*
import ManageAnalysisReport from './manageAnalysisReport'
import ManageAnalysisReport_Routes from './manageAnalysisReport/routes'
 * */
import BusinessReport_Routes from './businessReport/routes'
import { getChildOptions } from 'config/routingAuthority.config'

const PATH = `/web/reportManage`;
const ReportManage_Routes = [
    {
        path:`${PATH}/businessReport`,
        component:wrapPage('业务报表',BusinessReport),
        name:'业务报表',
        exact:true,
        children:BusinessReport_Routes,
        authorityInfo:getChildOptions('reportManage','businessReport')
    /*},{
        path:`${PATH}/manageAnalysisReport`,
        component:wrapPage('管理分析报表',ManageAnalysisReport),
        name:'管理分析报表',
        exact:true,
        children:ManageAnalysisReport_Routes,
        authorityInfo:reportManage['manageAnalysisReport'].options*/
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/businessReport`,

    }
]

export default ReportManage_Routes