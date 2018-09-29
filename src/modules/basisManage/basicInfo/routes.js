/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'
// import TaxIncentives from './taxIncentives'
// import DeclareParameter from './declareParameter'
/*import TableSum from '../../../compoments/tableSum'*/
/*import FinancialDocumentsBeginData from './financialDocumentsBeginData'
// import RoomTransactionFile from './roomTransactionFile'*/
import strategies from 'config/routingAuthority.config'
const AubjectOfTaxPayment = AsyncComponent(() => import('./aubjectOfTaxPayment'), '纳税主体');
const BeginDataCollect = AsyncComponent(() => import('./beginDataCollect'), '期初数据采集');
const ProjectManagement = AsyncComponent(() => import('./projectManagement'), '项目管理');

const PATHS = '/web/basisManage/basicInfo';
const ICON_URL_PATH = '/assets/routes_avatar/';
const basicInfo = strategies['basisManage']['basicInfo'];

const BasicInfo_Routes = [
    {
        path:`${PATHS}/aubjectOfTaxPayment`,
        component: AubjectOfTaxPayment,
        name:'纳税主体',
        icon:{
            url:`${ICON_URL_PATH}mainTax.svg`,
            backgroundColor:'#61C5C3'
        },
        authorityInfo:basicInfo['aubjectOfTaxPayment'].options,
        exact:true,
    },
    {
        path:`${PATHS}/aubjectOfTaxPayment/:id`,
        component: ProjectManagement,
        name:'项目管理',
        //authorityInfo:basicInfo['aubjectOfTaxPayment'].options,
        exact:true,
    },
    /*{
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
    },*/{
        path:`${PATHS}/beginDataCollect`,
        component: BeginDataCollect,
        name:'期初数据采集',
        icon:{
            url:`${ICON_URL_PATH}beginDataCollect.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['beginDataCollect'].options,
        exact:true,
    },/*{
        path:`${PATHS}/tableSum`,
        component:wrapPage('表格合计组件',TableSum),
        name:'表格合计组件',
        icon:{
            url:`${ICON_URL_PATH}declareParameter.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['beginDataCollect'].options,
        exact:true,*/
    /*},{
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
        path:`${PATHS}/roomTransactionFile`,
        name:'房间交易档案期初数据',
        component:wrapPage('房间交易档案期初数据',RoomTransactionFile),
        icon:{
            url:`${ICON_URL_PATH}declareParameter.svg`,
            backgroundColor:'#9FD360'
        },
        authorityInfo:basicInfo['roomTransactionFile'].options,
        exact:true,
    },*/{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/aubjectOfTaxPayment`,
    }
]

export default BasicInfo_Routes