/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
import RoomTransactionFile from './roomTransactionFile'
//import PrePaidSalesQuery from './prePaidHousingSales'
import TaxReturnForm from './taxReturnForm'
import FixedAssetCard from './fixedAssetCard'
import FinancialDocuments from './financialDocuments'
import IncomingInvoiceCollection from './incomingInvoiceCollection'
import SalesInvoiceCollection from './salesInvoiceCollection'
import AvailableArea from './availableArea'

import strategies from 'config/routingAuthority.config'

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
        component:wrapPage('房间交易档案',RoomTransactionFile),
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
        component:wrapPage('纳税申报表',TaxReturnForm),
        name:'纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}declareQuery.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['taxReturn'].options,
        exact:true,
    },{
        path:`${PATH}/fixedAssetCard`,
        component:wrapPage('固定资产卡片',FixedAssetCard),
        name:'固定资产卡片',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['fixedAssetCard'].options,
        exact:true,
    },{
        path:`${PATH}/financialDocuments`,
        component:wrapPage('财务凭证',FinancialDocuments),
        name:'财务凭证',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['financialDocuments'].options,
        exact:true,
    },{
        path:`${PATH}/incomingInvoiceCollection`,
        component:wrapPage('进项发票采集',IncomingInvoiceCollection),
        name:'进项发票采集',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['incomingInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/salesInvoiceCollection`,
        component:wrapPage('销项发票采集',SalesInvoiceCollection),
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCard.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['salesInvoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/availableArea`,
        component:wrapPage('可售面积',AvailableArea),
        name:'可售面积',
        icon:{
            url:`${ICON_URL_PATH}invoiceQuery.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:businessReport['availableArea'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default BusinessReport_Routes