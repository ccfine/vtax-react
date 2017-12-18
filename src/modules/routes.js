/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:38
 * description  :
 */
import React,{Component} from 'react'
import {wrapPage} from '../compoments'
import Home from './home'
import VatManage_Routes from './vatManage'
import ReportManage_Routes from './reportManage'
import BasisManage_Routes from './basisManage'
import SystemManage_Routes from './systemManage'

import TaxDeclare from './taxDeclare'

const PATH = '/web';

const routes = [
            {
                path:`${PATH}`,
                component:wrapPage('首页',Home),
                name:'首页',
                icon:'user',
                exact:true,
                permissions:true,
            },{
                path:`${PATH}/basisManage`,
                name:'基础管理',
                icon:'user',
                exact:true,
                permissions:true,
                redirect:true,
                to:`${PATH}/basisManage/basicInfo`,
                children:BasisManage_Routes
            },{
                path:`${PATH}/vatManage`,
                name:'增值税管理',   // 修改成  name:增值税管理
                icon:'user',
                exact:true,
                redirect:true,
                to:`${PATH}/vatManage/salesTaxAccount`,
                permissions:true,
                children:VatManage_Routes
            },{
                path:`${PATH}/taxDeclare`,
                component:wrapPage('纳税申报',TaxDeclare),
                name:'纳税申报',
                icon:'user',
                exact:true,
                permissions:true,
            },{
                path:`${PATH}/reportManage`,
                name:'报表管理',
                icon:'user',
                exact:true,
                permissions:true,
                redirect:true,
                to:`${PATH}/reportManage/businessReport`,
                children:ReportManage_Routes
            },{
                path:`${PATH}/systemManage`,
                name:'系统管理',
                icon:'user',
                exact:true,
                permissions:true,
                redirect:true,
                to:`${PATH}/systemManage/organization`,
                children:SystemManage_Routes
            },{
                path:'/',
                redirect:true,
                to:`${PATH}`,
            }
        ]

export default routes