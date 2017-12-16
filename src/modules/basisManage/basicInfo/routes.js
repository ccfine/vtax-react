/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments/index'

import AubjectOfTaxPayment from './aubjectOfTaxPayment'
import LicenseManage from './licenseManage'
import DeclareFile from './declareFile'
import FilingMaterial from './filingMaterial'
import OtherFiles from './otherFiles'
import InitialDataMaintain from './initialDataMaintain'


const PATHS = '/web/basisManage/basicInfo';

const BasicInfo_Routes = [
    {
        path:`${PATHS}/aubjectOfTaxPayment`,
        component:wrapPage('纳税主体',AubjectOfTaxPayment),
        name:'纳税主体',
        exact:true,
    },{
        path:`${PATHS}/licenseManage`,
        component:wrapPage('证照管理',LicenseManage),
        name:'证照管理',
        exact:true,
    },{
        path:`${PATHS}/declareFile`,
        component:wrapPage('申报档案',DeclareFile),
        name:'申报档案',
        exact:true,
    },{
        path:`${PATHS}/filingMaterial`,
        component:wrapPage('备案资料',FilingMaterial),
        name:'备案资料',
        exact:true,
    },{
        path:`${PATHS}/otherFiles`,
        component:wrapPage('其他档案',OtherFiles),
        name:'其他档案',
        exact:true,
    },{
        path:`${PATHS}/initialDataMaintain`,
        component:wrapPage('初始数据维护',InitialDataMaintain),
        name:'初始数据维护',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/aubjectOfTaxPayment`,
    }
]

export default BasicInfo_Routes