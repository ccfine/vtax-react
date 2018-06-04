/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'

import AubjectOfTaxPayment from './aubjectOfTaxPayment'
import TaxIncentives from './taxIncentives'
import DeclareParameter from './declareParameter'
import BeginDataCollect from './beginDataCollect'
import FinancialDocumentsBeginData from './financialDocumentsBeginData'
import strategies from 'config/routingAuthority.config'


const PATHS = '/web/basisManage/basicInfo';
const ICON_URL_PATH = '/assets/routes_avatar/';
const basicInfo = strategies['basisManage']['basicInfo'];

const BasicInfo_Routes = [
    {
        path:`${PATHS}/aubjectOfTaxPayment`,
        component:wrapPage('纳税主体',AubjectOfTaxPayment),
        name:'纳税主体',
        icon:{
            url:`${ICON_URL_PATH}mainTax.svg`,
            backgroundColor:'#61C5C3'
        },
        authorityInfo:basicInfo['aubjectOfTaxPayment'].options,
        exact:true,
    },{
        path:`${PATHS}/taxIncentives`,
        component:wrapPage('税收优惠',TaxIncentives),
        name:'税收优惠',
        icon:{
            url:`${ICON_URL_PATH}taxIncentives.svg`,
            backgroundColor:'#4DC1F0'
        },
        authorityInfo:basicInfo['taxIncentives'].options,
        exact:true,
    },{
        path:`${PATHS}/declareParameter`,
        component:wrapPage('申报参数',DeclareParameter),
        name:'申报参数',
        icon:{
            url:`${ICON_URL_PATH}declareParameter.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['declareParameter'].options,
        exact:true,
    },{
        path:`${PATHS}/beginDataCollect`,
        component:wrapPage('期初数据采集',BeginDataCollect),
        name:'期初数据采集',
        icon:{
            url:`${ICON_URL_PATH}declareParameter.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['beginDataCollect'].options,
        exact:true,
    },{
        path:`${PATHS}/financialDocumentsBeginData`,
        component:wrapPage('财务凭证期初数据',FinancialDocumentsBeginData),
        name:'财务凭证期初数据',
        icon:{
            url:`${ICON_URL_PATH}declareParameter.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['financialDocumentsBeginData'].options,
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/aubjectOfTaxPayment`,
    }
]

export default BasicInfo_Routes