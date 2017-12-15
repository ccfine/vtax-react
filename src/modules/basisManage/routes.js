/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'

import BasicInfo from './basicInfo'
import DataField from './dataField'
import ReportConfig from './reportConfig'

const BasisManage_PATH = `/web/basisManage`;
const BasisManage_routes = [
    {
        path:`${BasisManage_PATH}/basicInfo`,
        component:wrapPage('基础信息',BasicInfo),
        name:'基础信息'
    },{
        path:`${BasisManage_PATH}/dataField`,
        component:wrapPage('数据字段',DataField),
        name:'数据字段'
    },{
        path:`${BasisManage_PATH}/reportConfig`,
        component:wrapPage('报表配置',ReportConfig),
        name:'报表配置'
    },{
        path:`${BasisManage_PATH}`,
        redirect:true,
        to:`${BasisManage_PATH}/basicInfo`,

    }
]

export default BasisManage_routes