/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'

import BasicInfo from './basicInfo'
import DataField from './dataField'
import ReportConfig from './reportConfig'

import BasicInfo_Routes from './basicInfo/routes'
import DataField_Routes from './dataField/routes'
import ReportConfig_Routes from './reportConfig/routes'

const PATH = `/web/basisManage`;
const BasisManage_Routes = [
    {
        path:`${PATH}/basicInfo`,
        component:wrapPage('基础信息',BasicInfo),
        name:'基础信息',
        exact:true,
        children:BasicInfo_Routes
    },{
        path:`${PATH}/dataField`,
        component:wrapPage('数据字段',DataField),
        name:'数据字段',
        exact:true,
        children:DataField_Routes
    },{
        path:`${PATH}/reportConfig`,
        component:wrapPage('报表配置',ReportConfig),
        name:'报表配置',
        exact:true,
        children:ReportConfig_Routes
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/basicInfo`,

    }
]

export default BasisManage_Routes