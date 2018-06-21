/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:38
 * description  :
 */
//import LoadAble from 'react-loadable'
import {wrapPage} from 'compoments'
import Home from './home'
import TaxDeclare from './taxDeclare'
import VatManage_Routes from './vatManage'
import ReportManage_Routes from './reportManage'
import BasisManage_Routes from './basisManage'
import SystemManage_Routes from './systemManage'
import Children_Routes from './taxDeclare/children/routes'
import { getParentOptions } from 'config/routingAuthority.config'

/*const AsyncHome = LoadAble({
    loader: () => import('./home'),
    loading: LoadingPage,
});*/

const PATH = '/web';
const routes = [
    {
        path:`${PATH}`,
        component:wrapPage('首页',Home),
        name:'首页',
        icon:'user',
        exact:true,
        permissions:true,
        //authorityInfo:strategies['home'].options,
    },{
        path:`${PATH}/basisManage`,
        name:'基础管理',
        icon:'appstore-o',
        exact:true,
        permissions:true,
        redirect:true,
        to:`${PATH}/basisManage/basicInfo`,
        children:BasisManage_Routes,
        authorityInfo:getParentOptions('basisManage'),
    },{
        path:`${PATH}/vatManage`,
        name:'增值税管理',   // 修改成  name:增值税管理
        icon:'desktop',
        exact:true,
        redirect:true,
        to:`${PATH}/vatManage/salesTaxAccount`,
        permissions:true,
        children:VatManage_Routes,
        authorityInfo:getParentOptions('vatManage'),
    },{
        path:`${PATH}/taxDeclare`,
        name:'纳税申报',
        icon:'form',
        exact:true,
        permissions:false,
        component:wrapPage('纳税申报',TaxDeclare),
        children:Children_Routes,
        authorityInfo:getParentOptions('taxDeclare'),
    },{
        path:`${PATH}/reportManage`,
        name:'报表管理',
        icon:'copy',
        exact:true,
        permissions:true,
        redirect:true,
        to:`${PATH}/reportManage/businessReport`,
        children:ReportManage_Routes,
        authorityInfo:getParentOptions('reportManage'),
    },{
        path:`${PATH}/systemManage`,
        name:'系统管理',
        icon:'global',
        exact:true,
        permissions:true,
        redirect:true,
        to:`${PATH}/systemManage/organization`,
        children:SystemManage_Routes,
    },{
        path:'/',
        redirect:true,
        to:`${PATH}`,
    }
]

export default routes