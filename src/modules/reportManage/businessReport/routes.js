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
const ProfitCenterTaxReturn = AsyncComponent(() => import('./profitCenterTaxReturn'), '利润中心纳税申报表')
const PartnersTaxReturn = AsyncComponent(() => import('./partnersTaxReturn'), '合作方纳税申报表')
const PartnersTaxReturnForm = AsyncComponent(() => import('./partnersTaxReturn/taxReturnForm'), '合作方的纳税申报-纳税申报表')
const TaxReturnMergeCalculation = AsyncComponent(() => import('./taxReturnMergeCalculation'), '纳税申报合并计算表')
const FixedAssetCard = AsyncComponent(() => import('./fixedAssetCard'), '不动产卡片')
const FinancialDocuments = AsyncComponent(() => import('./financialDocuments'), '财务凭证')
const IncomingInvoiceCollection = AsyncComponent(() => import('./incomingInvoiceCollection'), '进项发票采集')
const SalesInvoiceCollection = AsyncComponent(() => import('./salesInvoiceCollection'), '销项发票采集')
const AvailableArea = AsyncComponent(() => import('./availableArea'), '可售面积')
const AccountBalanceSheet = AsyncComponent(() => import('./accountBalanceSheet'), '科目余额表')
const BillPool = AsyncComponent(() => import("./billPool"), "票据池")
const TaxReturnProgressTrackTable = AsyncComponent(() => import("./taxReturnProgressTrackTable"), "纳税申报进度跟踪表")
const SelfContainedProductAssociation = AsyncComponent(() => import("./selfContainedProductAssociation"), "自持类产品关联进项发票")
const SelfContainedProductList = AsyncComponent(() => import("./selfContainedProductList"), "自持类产品关联清单")
const RealEstateTax = AsyncComponent(() => import("./realEstateTax"), "不动产进项税额抵扣表")
const AdvancePayment = AsyncComponent(() => import("./advancePayment"), "预收账款-租金表")

const InvoiceSupplement = AsyncComponent(() => import('./invoiceSupplement'), '未开票销售补开发票报表')

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
        path:`${PATH}/profitCenterTaxReturn`,
        component:ProfitCenterTaxReturn,
        name:'利润中心纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}profitCenterTaxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['profitCenterTaxReturn'].options,
        exact:true,
    },{
        path:`${PATH}/partnersTaxReturn`,
        component:PartnersTaxReturn,
        name:'合作方纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}partnersTaxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['partnersTaxReturn'].options,
        exact:true,
    },{
        path:`${PATH}/partnersTaxReturn/partnersTaxReturnForm`,
        component:PartnersTaxReturnForm,
        name:'合作方纳税申报信息-纳税申报表',
        exact:true
    },{
        path:`${PATH}/taxReturnMergeCalculation`,
        component:TaxReturnMergeCalculation,
        name:'纳税申报合并计算表',
        icon:{
            url:`${ICON_URL_PATH}taxReturnMergeCalculation.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['taxReturnMergeCalculation'].options,
        exact:true,
    },{
        path:`${PATH}/fixedAssetCard`,
        component:FixedAssetCard,
        name:'不动产卡片',
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
    },
    {
        path: `${PATH}/billPool`,
        component: BillPool,
        name: "票据池",
        icon: {
            url: `${ICON_URL_PATH}billPool.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["billPool"].options,
    },
    {
        path: `${PATH}/selfContainedProductAssociation`,
        component: SelfContainedProductAssociation,
        name: "自持类产品关联进项发票",
        icon: {
            url: `${ICON_URL_PATH}selfContainedProductAssociation.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["selfContainedProductAssociation"].options,
        exact: true
    },
    {
        path: `${PATH}/selfContainedProductList`,
        component: SelfContainedProductList,
        name: "自持类产品清单",
        icon: {
            url: `${ICON_URL_PATH}selfContainedProductList.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["selfContainedProductList"].options,
        exact: true
    },
    {
        path: `${PATH}/taxReturnProgressTrackTable`,
        component: TaxReturnProgressTrackTable,
        name: "纳税申报进度跟踪表",
        icon: {
            url: `${ICON_URL_PATH}taxReturnProgressTrackTable.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["taxReturnProgressTrackTable"].options,
        exact: true
    },
    {
        path: `${PATH}/realEstateTax`,
        component: RealEstateTax,
        name: "不动产进项税额抵扣表",
        icon: {
            url: `${ICON_URL_PATH}realEstateTax.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["realEstateTax"].options,
        exact: true
    },
    {
        path: `${PATH}/advancePayment`,
        component: AdvancePayment,
        name: "预收账款-租金表",
        icon: {
            url: `${ICON_URL_PATH}advancePayment.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["advancePayment"].options,
        exact: true
    },
    {
        path:`${PATH}/invoiceSupplement`,
        component:InvoiceSupplement,
        name:'未开票销售补开发票报表',
        icon: {
            url: `${ICON_URL_PATH}advancePayment.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: businessReport["invoiceSupplement"].options,
        exact:true,
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default BusinessReport_Routes