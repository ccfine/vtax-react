/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:38
 * description  :
 */
import {wrapPage} from '../compoments'
import Home from './home'

import SalesTaxAccount from './accountManage/salesTaxAccount'
import EntryTaxAccount from './accountManage/entryTaxAccount'
import OtherAccount from './accountManage/otherAccount'

import BusinessReport from './reportManage/businessReport'
import ManageAnalysisReport from './reportManage/manageAnalysisReport'

import TaxDeclare from './taxDeclare'

import BasicInfo from './basisManage/basicInfo'
import DataField from './basisManage/dataField'
import ReportConfig from './basisManage/reportConfig'

import Organization from './systemManage/organization'
import UserPermissions from './systemManage/userPermissions'
import InterfaceManage from './systemManage/interfaceManage'
import ProcessManage from './systemManage/processManage'
import SystemMonitor from './systemManage/systemMonitor'

const PATH = '/web';
const AccountManage_PATH = `${PATH}/accountManage`;
const ReportManage_PATH = `${PATH}/reportManage`;
const BasisManage_PATH = `${PATH}/basisManage`;
const SystemManage_PATH = `${PATH}/systemManage`;

const routes = [
            {
                path:`${PATH}`,
                component:wrapPage('首页',Home),
                name:'首页',
                icon:'user',
                exact:true
            },{
                path:`${AccountManage_PATH}`,
                name:'台账管理',
                icon:'user',
                exact:true,
                children: [
                    {
                        path:`${AccountManage_PATH}/salesTaxAccount`,
                        component:wrapPage('销项税台账',SalesTaxAccount),
                        name:'销项税台账',
                    },{
                        path:`${AccountManage_PATH}/entryTaxAccount`,
                        component:wrapPage('进项税台账',EntryTaxAccount),
                        name:'进项税台账',
                    },{
                        path:`${AccountManage_PATH}/otherAccount`,
                        component:wrapPage('其它台账',OtherAccount),
                        name:'其它台账',
                    },{
                        path:`${AccountManage_PATH}`,
                        redirect:true,
                        to:`${AccountManage_PATH}/salesTaxAccount`,

                    }
                ]
            },{
                path:`${ReportManage_PATH}`,
                name:'报表管理',
                icon:'user',
                exact:true,
                children: [
                    {
                        path:`${ReportManage_PATH}/businessReport`,
                        component:wrapPage('业务报表',BusinessReport),
                        name:'业务报表',
                    },{
                        path:`${ReportManage_PATH}/manageAnalysisReport`,
                        component:wrapPage('管理分析报表',ManageAnalysisReport),
                        name:'管理分析报表',
                    },{
                        path:`${ReportManage_PATH}`,
                        redirect:true,
                        to:`${ReportManage_PATH}/businessReport`,

                    }
                ]
            },{
                path:`${PATH}/taxDeclare`,
                component:wrapPage('纳税申报',TaxDeclare),
                name:'纳税申报',
                icon:'user',
                exact:true,
                children: [

                ]
            },{
                path:`${BasisManage_PATH}`,
                name:'基础管理',
                icon:'user',
                exact:true,
                children: [
                    {
                        path:`${BasisManage_PATH}/basicInfo`,
                        component:wrapPage('基础信息',BasicInfo),
                        name:'基础信息',
                    },{
                        path:`${BasisManage_PATH}/dataField`,
                        component:wrapPage('数据字段',DataField),
                        name:'数据字段',
                    },{
                        path:`${BasisManage_PATH}/reportConfig`,
                        component:wrapPage('报表配置',ReportConfig),
                        name:'报表配置',
                    },{
                        path:`${BasisManage_PATH}`,
                        redirect:true,
                        to:`${BasisManage_PATH}/basicInfo`,

                    }
                ]
            },{
                path:`${SystemManage_PATH}`,
                name:'系统管理',
                icon:'user',
                exact:true,
                children: [
                    {
                        path:`${SystemManage_PATH}/organization`,
                        component:wrapPage('组织架构',Organization),
                        name:'组织架构',
                    },{
                        path:`${SystemManage_PATH}/userPermissions`,
                        component:wrapPage('用户权限',UserPermissions),
                        name:'用户权限',
                    },{
                        path:`${SystemManage_PATH}/interfaceManage`,
                        component:wrapPage('接口管理',InterfaceManage),
                        name:'接口管理',
                    },{
                        path:`${SystemManage_PATH}/processManage`,
                        component:wrapPage('流程管理',ProcessManage),
                        name:'流程管理',
                    },{
                        path:`${SystemManage_PATH}/systemMonitor`,
                        component:wrapPage('系统监控',SystemMonitor),
                        name:'系统监控',
                    },{
                        path:`${SystemManage_PATH}`,
                        redirect:true,
                        to:`${SystemManage_PATH}/organization`,
                    }
                ]
            },{
                path:'/',
                redirect:true,
                to:`${PATH}`,
            }
        ]

export default routes