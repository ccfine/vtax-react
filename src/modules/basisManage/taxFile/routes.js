/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'

import LicenseManage from './licenseManage'
import DeclareFile from './declareFile'
import FilingMaterial from './filingMaterial'
import OtherFiles from './otherFiles'
import InspectionReport from './inspectionReport'
const ICON_URL_PATH = '/assets/routes_avatar/'
const PATHS = '/web/basisManage/taxFile';

const TaxFile_Routes = [
    {
        path:`${PATHS}/declareFile`,
        component:wrapPage('申报档案',DeclareFile),
        name:'申报档案',
        icon:{
            url:`${ICON_URL_PATH}declareFile.svg`,
            backgroundColor:'#F6CB3D'
        },
        exact:true,
    },{
        path:`${PATHS}/inspectionReport`,
        component:wrapPage('稽查报告',InspectionReport),
        name:'稽查报告',
        icon:{
            url:`${ICON_URL_PATH}inspectionReport.svg`,
            backgroundColor:'#F74C04'
        },
        exact:true,
    },{
        path:`${PATHS}/filingMaterial`,
        component:wrapPage('备案资料',FilingMaterial),
        name:'备案资料',
        icon:{
            url:`${ICON_URL_PATH}filingMaterial.svg`,
            backgroundColor:'#4DC1F0'
        },
        exact:true,
    },{
        path:`${PATHS}/licenseManage`,
        component:wrapPage('证照管理',LicenseManage),
        name:'证照管理',
        icon:{
            url:`${ICON_URL_PATH}licenseManage.svg`,
            backgroundColor:'#296A8C'
        },
        exact:true,
    },{
        path:`${PATHS}/otherFiles`,
        component:wrapPage('其他档案',OtherFiles),
        name:'其他档案',
        icon:{
            url:`${ICON_URL_PATH}otherFiles.svg`,
            backgroundColor:'#F49B3C'
        },
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/declareFile`,
    }
]

export default TaxFile_Routes