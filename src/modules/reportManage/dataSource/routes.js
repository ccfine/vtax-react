/**
 * Created by liuliyuan on 2018/11/15.
 */
import {AsyncComponent} from 'compoments'

import strategies from 'config/routingAuthority.config'

const RoomTransactionFile = AsyncComponent(() => import('./roomTransactionFile'), '营销-房间交易档案采集')
const SalesInvoiceCollection = AsyncComponent(() => import('./salesInvoiceCollection'), '喜盈佳-销项发票采集')
const IncomingInvoiceCollection = AsyncComponent(() => import('./incomingInvoiceCollection'), '喜盈佳-进项发票采集')
const FinancialDocuments = AsyncComponent(() => import('./financialDocuments'), 'SAP-财务凭证数据采集')
const FixedAssetCard = AsyncComponent(() => import('./fixedAssetCard'), 'SAP-不动产卡片采集')
const AccountBalanceSheet = AsyncComponent(() => import('./accountBalanceSheet'), 'SAP-科目余额表数据采集')
const AdvancePayment = AsyncComponent(() => import("./advancePayment"), "SAP-预收账款租金表数据采集")
const BillPool = AsyncComponent(() => import("./billPool"), "SAP-票据池数据采集")
const AvailableArea = AsyncComponent(() => import('./availableArea'), '明源-可售面积数据采集')
const SelfContainedProductList = AsyncComponent(() => import("./selfContainedProductList"), "明源-自持类产品关联清单数据采集")
const SelfContainedProductAssociation = AsyncComponent(() => import("./selfContainedProductAssociation"), "明源-自持类产品关联进项发票数据采集")


const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/dataSource`
const business = strategies['reportManage']['dataSource'];

const DataSource_Routes = [
    {
        path:`${PATH}/roomTransactionFile`,
        component:RoomTransactionFile,
        name:'营销-房间交易档案采集',
        icon:{
            url:`${ICON_URL_PATH}roomTransactionFile.svg`,
            backgroundColor:'#6CCCCA'
        },
        authorityInfo:business['roomTransactionFile'].options,
        exact:true,
    },
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:SalesInvoiceCollection,
        name:'喜盈佳-销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceCollection.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['salesInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/incomingInvoiceCollection`,
        component:IncomingInvoiceCollection,
        name:'喜盈佳-进项发票采集',
        icon:{
            url:`${ICON_URL_PATH}incomingInvoiceCollection.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['incomingInvoiceCollection'].options,
        exact:true,
    },
    {
        path:`${PATH}/financialDocuments`,
        component:FinancialDocuments,
        name:'SAP-财务凭证数据采集',
        icon:{
            url:`${ICON_URL_PATH}financialDocuments.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['financialDocuments'].options,
        exact:true,
    },
    {
        path:`${PATH}/fixedAssetCard`,
        component:FixedAssetCard,
        name:'SAP-不动产卡片采集',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['fixedAssetCard'].options,
        exact:true,
    },
    {
        path:`${PATH}/accountBalanceSheet`,
        component:AccountBalanceSheet,
        name:'SAP-科目余额表数据采集',
        icon:{
            url:`${ICON_URL_PATH}accountBalanceSheet.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['accountBalanceSheet'].options,
        exact:true,
    },
    {
        path: `${PATH}/advancePayment`,
        component: AdvancePayment,
        name: "SAP-预收账款租金表数据采集",
        icon: {
            url: `${ICON_URL_PATH}advancePayment.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["advancePayment"].options,
        exact: true
    },
    {
        path: `${PATH}/billPool`,
        component: BillPool,
        name: "SAP-票据池数据采集",
        icon: {
            url: `${ICON_URL_PATH}billPool.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["billPool"].options,

    },{
        path:`${PATH}/availableArea`,
        component:AvailableArea,
        name:'明源-可售面积数据采集',
        icon:{
            url:`${ICON_URL_PATH}availableArea.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:business['availableArea'].options,
        exact:true,
    },
    {
        path: `${PATH}/selfContainedProductList`,
        component: SelfContainedProductList,
        name: "明源-自持类产品关联清单数据采集",
        icon: {
            url: `${ICON_URL_PATH}selfContainedProductList.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["selfContainedProductList"].options,
        exact: true
    },
    {
        path: `${PATH}/selfContainedProductAssociation`,
        component: SelfContainedProductAssociation,
        name: "明源-自持类产品关联进项发票数据采集",
        icon: {
            url: `${ICON_URL_PATH}selfContainedProductAssociation.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["selfContainedProductAssociation"].options,
        exact: true
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default DataSource_Routes