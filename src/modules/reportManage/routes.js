/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'

import BusinessReport from './businessReport'
import ManageAnalysisReport from './manageAnalysisReport'

const ReportManage_PATH = `/web/reportManage`;
const ReportManage_routes = [
    {
        path:`${ReportManage_PATH}/businessReport`,
        component:wrapPage('业务报表',BusinessReport),
        name:'业务报表'
    },{
        path:`${ReportManage_PATH}/manageAnalysisReport`,
        component:wrapPage('管理分析报表',ManageAnalysisReport),
        name:'管理分析报表'
    },{
        path:`${ReportManage_PATH}`,
        redirect:true,
        to:`${ReportManage_PATH}/businessReport`,

    }
]

export default ReportManage_routes