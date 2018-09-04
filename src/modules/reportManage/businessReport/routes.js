/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'
//import PrePaidSalesQuery from './prePaidHousingSales'

import strategies from 'config/routingAuthority.config'

const RoomTransactionFile = AsyncComponent(() => import('./roomTransactionFile'), '房间交易档案')
const TaxReturnForm = AsyncComponent(() => import('./taxReturnForm'), '纳税申报表')
const FixedAssetCard = AsyncComponent(() => import('./fixedAssetCard'), '固定资产卡片')
const FinancialDocuments = AsyncComponent(() => import('./financialDocuments'), '财务凭证')
const IncomingInvoiceCollection = AsyncComponent(() => import('./incomingInvoiceCollection'), '进项发票采集')
const SalesInvoiceCollection = AsyncComponent(() => import('./salesInvoiceCollection'), '销项发票采集')
const AvailableArea = AsyncComponent(() => import('./availableArea'), '可售面积')
const AccountBalanceSheet = AsyncComponent(() => import('./accountBalanceSheet'), '科目余额表')

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/businessReport`
const businessReport = strategies['reportManage']['businessReport'];

const BusinessReport_Routes = [
    {
    /*
        path:`${PATH}/vatPrepaymentForm`,
        component:wrapPage('增值税预缴表',VATPrepaymentForm),
        name:'增值税预缴表',
        icon:{
            url:`${ICON_URL_PATH}vatPrepaymentForm.svg`,
            backgroundColor:'#00D01A'
        },
        authorityInfo:businessReport['vatPrepaymentForm'].options,
        exact:true,
    },{*/
        path:`${PATH}/roomTransactionFile`,
        component:RoomTransactionFile,
        name:'房间交易档案',
        icon:{
            url:`${ICON_URL_PATH}roomTransactionFile.svg`,
            backgroundColor:'#6CCCCA'
        },
        authorityInfo:businessReport['roomTransactionFile'].options,
        exact:true,
    /*},{
        path:`${PATH}/prePaidSalesQuery`,
        component:wrapPage('售房预缴查询',PrePaidSalesQuery),
        name:'售房预缴查询',
        icon:{
            url:`${ICON_URL_PATH}prePaidSalesQuery.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:businessReport['prePaidSalesQuery'].options,
        exact:true,
        */
    },{
        path:`${PATH}/taxReturn`,
        component:TaxReturnForm,
        name:'纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}taxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['taxReturn'].options,
        exact:true,
    },{
        path:`${PATH}/fixedAssetCard`,
        component:FixedAssetCard,
        name:'固定资产卡片',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['fixedAssetCard'].options,
        exact:true,
    },{
        path:`${PATH}/financialDocuments`,
        component:FinancialDocuments,
        name:'财务凭证',
        icon:{
            url:`${ICON_URL_PATH}financialDocuments.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['financialDocuments'].options,
        exact:true,
    },{
        path:`${PATH}/incomingInvoiceCollection`,
        component:IncomingInvoiceCollection,
        name:'进项发票采集',
        icon:{
            url:`${ICON_URL_PATH}businessReportIncomingInvoiceCollection.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['incomingInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/salesInvoiceCollection`,
        component:SalesInvoiceCollection,
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}businessReportSalesInvoiceCollection.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['salesInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/availableArea`,
        component:AvailableArea,
        name:'可售面积',
        icon:{
            url:`${ICON_URL_PATH}availableArea.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:businessReport['availableArea'].options,
        exact:true,
    },{
        path:`${PATH}/accountBalanceSheet`,
        component:AccountBalanceSheet,
        name:'科目余额表',
        icon:{
            url:`${ICON_URL_PATH}accountBalanceSheet.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['accountBalanceSheet'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default BusinessReport_Routes