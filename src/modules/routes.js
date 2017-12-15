/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:38
 * description  :
 */
import {wrapPage} from '../compoments'
import Home from './home'
import AccountManage_routes from './accountManage'
import ReportManage_routes from './reportManage'
import BasisManage_routes from './basisManage'
import SystemManage_routes from './systemManage'

import TaxDeclare from './taxDeclare'

const PATH = '/web';

const routes = [
            {
                path:`${PATH}`,
                component:wrapPage('首页',Home),
                name:'首页',
                icon:'user',
                exact:true
            },{
                path:`${PATH}/accountManage`,
                name:'台账管理',
                icon:'user',
                exact:true,
                children:AccountManage_routes
            },{
                path:`${PATH}/reportManage`,
                name:'报表管理',
                icon:'user',
                exact:true,
                children:ReportManage_routes
            },{
                path:`${PATH}/taxDeclare`,
                component:wrapPage('纳税申报',TaxDeclare),
                name:'纳税申报',
                icon:'user',
                exact:true,
            },{
                path:`${PATH}/basisManage`,
                name:'基础管理',
                icon:'user',
                exact:true,
                children:BasisManage_routes
            },{
                path:`${PATH}/systemManage`,
                name:'系统管理',
                icon:'user',
                exact:true,
                children:SystemManage_routes
            },{
                path:'/',
                redirect:true,
                to:`${PATH}`,
            }
        ]

export default routes