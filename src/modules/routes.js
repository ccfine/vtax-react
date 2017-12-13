/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:38
 * description  :
 */
import {wrapPage} from '../compoments'
import Home from './home'
import AccountManage from './accountManage'
import ReportManage from './reportManage'
import TaxDeclare from './taxDeclare'
import BasisManage from './basisManage'
import SystemManage from './systemManage'
const PATH = '/web';

const routes = [
    {
        path:`${PATH}`,
        component:wrapPage('首页',Home),
        name:'首页',
        exact:true,
    },{
        path:`${PATH}/accountManage`,
        component:wrapPage('台账管理',AccountManage),
        name:'台账管理',
        icon:'user',
        exact:true,
    },{
        path:`${PATH}/reportManage`,
        component:wrapPage('报表管理',ReportManage),
        name:'报表管理',
        icon:'user',
        exact:true,
    },{
        path:`${PATH}/taxDeclare`,
        component:wrapPage('纳税申报',TaxDeclare),
        name:'纳税申报',
        icon:'user',
        exact:true,
    },{
        path:`${PATH}/basisManage`,
        component:wrapPage('基础管理',BasisManage),
        name:'基础管理',
        icon:'user',
        exact:true,
    },{
        path:`${PATH}/systemManage`,
        component:wrapPage('系统管理',SystemManage),
        name:'系统管理',
        icon:'user',
        exact:true,
    },{
        path:'/web',
        redirect:true,
        to:`${PATH}`,

    }
]

export default routes