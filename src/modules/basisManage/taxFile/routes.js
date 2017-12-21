/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments/index'

import LicenseManage from './licenseManage'
import DeclareFile from './declareFile'
import FilingMaterial from './filingMaterial'
import OtherFiles from './otherFiles'
import InspectionReport from './inspectionReport'

const PATHS = '/web/basisManage/taxFile';

const TaxFile_Routes = [
    {
        path:`${PATHS}/declareFile`,
        component:wrapPage('申报档案',DeclareFile),
        name:'申报档案',
        exact:true,
    },{
        path:`${PATHS}/inspectionReport`,
        component:wrapPage('稽查报告',InspectionReport),
        name:'稽查报告',
        exact:true,
    },{
        path:`${PATHS}/filingMaterial`,
        component:wrapPage('备案资料',FilingMaterial),
        name:'备案资料',
        exact:true,
    },{
        path:`${PATHS}/licenseManage`,
        component:wrapPage('证照管理',LicenseManage),
        name:'证照管理',
        exact:true,
    },{
        path:`${PATHS}/otherFiles`,
        component:wrapPage('其他档案',OtherFiles),
        name:'其他档案',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/declareFile`,
    }
]

export default TaxFile_Routes