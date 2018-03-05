/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import SalesInvoiceCollection from './salesInvoiceCollection'
import SalesInvoiceMatching from './salesInvoiceMatching'
import CampBeforeTheIncreaseInSales from './campBeforeTheIncreaseInSales'
import BillingSales from '../salesTaxAccount/billingSales'
import UnbilledAales from '../salesTaxAccount/unbilledAales'
import OtherTaxAdjustment from '../salesTaxAccount/otherTaxAdjustment'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/salesManag`;

const SalesManag_Routes = [
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:wrapPage('销项发票采集',SalesInvoiceCollection),
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        exact:true,
    },{
        path:`${PATH}/salesInvoiceMatching`,
        component:wrapPage('销项发票匹配',SalesInvoiceMatching),
        name:'销项发票匹配',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        exact:true,
    },{
        path:`${PATH}/campBeforeTheIncreaseInSales`,
        component:wrapPage('营改增前售房',CampBeforeTheIncreaseInSales),
        name:'营改增前售房',
        icon:{
            url:`${ICON_URL_PATH}campBeforeTheIncreaseInSales.svg`,
            backgroundColor:'#FFBE06'
        },
        exact:true,
    },{
        path:`${PATH}/billingSales`,
        component:wrapPage('开票销售台账',BillingSales),
        name:'开票销售台账',
        icon:{
            url:`${ICON_URL_PATH}billingSales.svg`,
            backgroundColor:'#7ED530'
        },
        exact:true,
    },{
        path:`${PATH}/unbilledAales`,
        component:wrapPage('未开票销售台账',UnbilledAales),
        name:'未开票销售台账',
        icon:{
            url:`${ICON_URL_PATH}unbilledAales.svg`,
            backgroundColor:'#F5A544'
        },
        exact:true,
    },{
        path:`${PATH}/otherTaxAdjustment`,
        component:wrapPage('其他涉税调整台账',OtherTaxAdjustment),
        name:'其他涉税调整台账',
        icon:{
            url:`${ICON_URL_PATH}otherTaxAdjustment.svg`,
            backgroundColor:'#57C8F2'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/salesInvoiceCollection`,
    }
]

export default SalesManag_Routes