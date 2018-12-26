/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'
/*
import CampBeforeTheIncreaseInSales from './campBeforeTheIncreaseInSales'
import UnBilledSales from '../salesTaxAccount/unBilledSales'
 * */
import strategies from 'config/routingAuthority.config'

const SalesInvoiceCollection = AsyncComponent(() => import('./salesInvoiceCollection'), '销项发票采集')
const SalesInvoiceMatching = AsyncComponent(() => import('./salesInvoiceMatching'), '销项发票匹配')
const IncomeCheck = AsyncComponent(() => import('./incomeCheck'), '收入检查')
const BillingSales = AsyncComponent(() => import('../salesTaxAccount/billingSales'), '开票销售台账')
const CheckOut = AsyncComponent(() => import('./checkOut'), '退房处理台账')
const BeginningNotTaxSalesEstate = AsyncComponent(() => import('./beginningNotTaxSalesEstate'), '期初未纳税销售额台账-地产')
const UnBilledSalesEstate = AsyncComponent(() => import('./unBilledSalesEstate'), '未开票销售台账-地产')
const UnBilledSalesNotEstate = AsyncComponent(() => import('./unBilledSalesNotEstate'), '未开票销售台账-非地产')
const OtherTaxAdjustment = AsyncComponent(() => import('../salesTaxAccount/otherTaxAdjustment'), '其他涉税调整台账')
const FinancialDocumentsCollection = AsyncComponent(() => import('./financialDocumentsCollection'), '财务凭证采集')

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/salesManag`;
const salesManag = strategies['vatManage']['salesManag'];

const SalesManag_Routes = [
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:SalesInvoiceCollection,
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        authorityInfo:salesManag['salesInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/salesInvoiceMatching`,
        component:SalesInvoiceMatching,
        name:'销项发票匹配',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        authorityInfo:salesManag['salesInvoiceMatching'].options,
        exact:true,
    /*},{
        path:`${PATH}/campBeforeTheIncreaseInSales`,
        component:wrapPage('营改增前售房',CampBeforeTheIncreaseInSales),
        name:'营改增前售房',
        icon:{
            url:`${ICON_URL_PATH}campBeforeTheIncreaseInSales.svg`,
            backgroundColor:'#FFBE06'
        },
        authorityInfo:salesManag['campBeforeTheIncreaseInSales'].options,
        exact:true,*/
    },{
        path:`${PATH}/incomeCheck`,
        component:IncomeCheck,
        name:'收入检查',
        icon:{
            url:`${ICON_URL_PATH}incomeCheck.svg`,
            backgroundColor:'#FFBE06'
        },
        authorityInfo:salesManag['incomeCheck'].options,
        exact:true,
    },{
        path:`${PATH}/billingSales`,
        component:BillingSales,
        name:'开票销售台账',
        icon:{
            url:`${ICON_URL_PATH}billingSales.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['billingSales'].options,
        exact:true,
    /*},{
        path:`${PATH}/unBilledSales`,
        component:wrapPage('未开票销售台账',UnBilledSales),
        name:'未开票销售台账',
        icon:{
            url:`${ICON_URL_PATH}unbilledAales.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:salesManag['unBilledSales'].options,
        exact:true,*/
    },{
        path:`${PATH}/checkOut`,
        component:CheckOut,
        name:'退房处理台账',
        icon:{
            url:`${ICON_URL_PATH}checkOutAccount.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['checkOutAccount'].options,
        exact:true,
    },{
        path:`${PATH}/beginningNotTaxSalesEstate`,
        component:BeginningNotTaxSalesEstate,
        name:'期初未纳税销售额台账-地产',
        icon:{
            url:`${ICON_URL_PATH}beginningNotTaxSalesEstate.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['beginningNotTaxSalesEstate'].options,
        exact:true,
    },{
        path:`${PATH}/unBilledSalesEstate`,
        component:UnBilledSalesEstate,
        name:'未开票销售台账-地产',
        icon:{
            url:`${ICON_URL_PATH}unBilledSalesEstate.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['unBilledSalesEstate'].options,
        exact:true,
    },{
        path:`${PATH}/unBilledSalesNotEstate`,
        component:UnBilledSalesNotEstate,
        name:'未开票销售台账-非地产',
        icon:{
            url:`${ICON_URL_PATH}unBilledSalesNotEstate.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:salesManag['unBilledSalesNotEstate'].options,
        exact:true,
    },{
        path:`${PATH}/otherTaxAdjustment`,
        component:OtherTaxAdjustment,
        name:'其他涉税调整台账',
        icon:{
            url:`${ICON_URL_PATH}otherTaxAdjustment.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:salesManag['otherTaxAdjustment'].options,
        exact:true,
    },{
        path:`${PATH}/financialDocumentsCollection`,
        component:FinancialDocumentsCollection,
        name:'财务凭证采集',
        icon:{
            url:`${ICON_URL_PATH}financialDocumentsCollection.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:salesManag['financialDocumentsCollection'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/salesInvoiceCollection`,
    }
]

export default SalesManag_Routes