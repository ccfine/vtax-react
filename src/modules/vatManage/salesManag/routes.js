/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
import SalesInvoiceCollection from './salesInvoiceCollection'
import SalesInvoiceMatching from './salesInvoiceMatching'
/*
import CampBeforeTheIncreaseInSales from './campBeforeTheIncreaseInSales'
import UnBilledSales from '../salesTaxAccount/unBilledSales'
 import UnBilledSales from '../salesTaxAccount/unBilledSales'
* */
import IncomeCheck from './incomeCheck'
import BillingSales from '../salesTaxAccount/billingSales'
//import BeginningNotTaxSalesEstate from './beginningNotTaxSalesEstate'
import UnBilledSalesEstate from './unBilledSalesEstate'
import UnBilledSalesNotEstate from './unBilledSalesNotEstate'
import OtherTaxAdjustment from '../salesTaxAccount/otherTaxAdjustment'
import FinancialDocumentsCollection from './financialDocumentsCollection'
import strategies from 'config/routingAuthority.config'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/salesManag`;
const salesManag = strategies['vatManage']['salesManag'];

const SalesManag_Routes = [
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:wrapPage('销项发票采集',SalesInvoiceCollection),
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        authorityInfo:salesManag['salesInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/salesInvoiceMatching`,
        component:wrapPage('销项发票匹配',SalesInvoiceMatching),
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
        component:wrapPage('收入检查',IncomeCheck),
        name:'收入检查',
        icon:{
            url:`${ICON_URL_PATH}campBeforeTheIncreaseInSales.svg`,
            backgroundColor:'#FFBE06'
        },
        authorityInfo:salesManag['incomeCheck'].options,
        exact:true,
    },{
        path:`${PATH}/billingSales`,
        component:wrapPage('开票销售台账',BillingSales),
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
    /*},{
        path:`${PATH}/beginningNotTaxSalesEstate`,
        component:wrapPage('期初未纳税销售额台账-地产',BeginningNotTaxSalesEstate),
        name:'期初未纳税销售额台账-地产',
        icon:{
            url:`${ICON_URL_PATH}billingSales.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['unBilledSalesEstate'].options,
        exact:true,*/
    },{
        path:`${PATH}/unBilledSalesEstate`,
        component:wrapPage('未开票销售台账-地产',UnBilledSalesEstate),
        name:'未开票销售台账-地产',
        icon:{
            url:`${ICON_URL_PATH}billingSales.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:salesManag['unBilledSalesEstate'].options,
        exact:true,
    },{
        path:`${PATH}/unBilledSalesNotEstate`,
        component:wrapPage('未开票销售台账-非地产',UnBilledSalesNotEstate),
        name:'未开票销售台账-非地产',
        icon:{
            url:`${ICON_URL_PATH}unbilledAales.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:salesManag['unBilledSalesNotEstate'].options,
        exact:true,
    },{
        path:`${PATH}/otherTaxAdjustment`,
        component:wrapPage('其他涉税调整台账',OtherTaxAdjustment),
        name:'其他涉税调整台账',
        icon:{
            url:`${ICON_URL_PATH}otherTaxAdjustment.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:salesManag['otherTaxAdjustment'].options,
        exact:true,
    },{
        path:`${PATH}/financialDocumentsCollection`,
        component:wrapPage('财务凭证采集',FinancialDocumentsCollection),
        name:'财务凭证采集',
        icon:{
            url:`${ICON_URL_PATH}otherTaxAdjustment.svg`,
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