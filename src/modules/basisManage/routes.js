/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from 'compoments'

import BasicInfo from './basicInfo'
import TaxFile from './taxFile'

import BasicInfo_Routes from './basicInfo/routes'
import TaxFile_Routes from './taxFile/routes'

const PATH = `/web/basisManage`;
const BasisManage_Routes = [
    {
        path:`${PATH}/basicInfo`,
        component:wrapPage('基础信息',BasicInfo),
        name:'基础信息',
        exact:true,
        children:BasicInfo_Routes
    },{
        path:`${PATH}/taxFile`,
        component:wrapPage('税务档案',TaxFile),
        name:'税务档案',
        exact:true,
        children:TaxFile_Routes
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/basicInfo`,

    }
]

export default BasisManage_Routes