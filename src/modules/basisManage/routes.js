/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {AsyncComponent} from 'compoments'
// import TaxFile from './taxFile'
import BasicInfo_Routes from './basicInfo/routes'
// import TaxFile_Routes from './taxFile/routes'
import { getChildOptions } from 'config/routingAuthority.config'

const BasicInfo = AsyncComponent(() => import('./basicInfo'), '基础信息')

const PATH = `/web/basisManage`;
const BasisManage_Routes = [
    {
        path:`${PATH}/basicInfo`,
        component:BasicInfo,
        name:'基础信息',
        exact:true,
        children:BasicInfo_Routes,
        authorityInfo:getChildOptions('basisManage','basicInfo')
    }/*,{
        path:`${PATH}/taxFile`,
        component:wrapPage('税务档案',TaxFile),
        name:'税务档案',
        exact:true,
        children:TaxFile_Routes,
        authorityInfo:getChildOptions('basisManage','taxFile')
    }*/,{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/basicInfo`,

    }
]

export default BasisManage_Routes