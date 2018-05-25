/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
/*import React from 'react'*/
import {wrapPage} from 'compoments'
import RoomTransactionFile from './roomTransactionFile'
import PrePaidSalesQuery from './prePaidHousingSales'
import TaxReturnForm from './taxReturnForm'
import FixedAssetCard from './fixedAssetCard'
import FinancialDocuments from './financialDocuments'
import IncomingInvoiceCollection from './incomingInvoiceCollection'
import SalesInvoiceCollection from './salesInvoiceCollection'
import AvailableArea from './availableArea'

import strategies from 'config/routingAuthority.config'

/*const GeneralTaxpayerVATReturn =()=><div>增值税一般纳税人申报表</div>
const VATPrepaymentForm =()=><div>增值税预缴表</div>
const RoomFileSummaryQuery =()=><div>房间档案汇总查询</div>
const InterimContractInputTaxTransferredOutQuery =()=><div>跨期合同进项税额转出查询</div>
const LandPriceDeductionDetails =()=><div>土地价款扣除明细查询</div>
const TaxpayersQuery =()=><div>纳税主体查询</div>
const TaxIncentives =()=><div>税收优惠</div>
const TaxFileQuery =()=><div>税务档案查询</div>
const DeclareParametersQuery =()=><div>申报参数查询</div>
const InvoiceQuery =()=><div>发票查询</div>
const DeclareQuery =()=><div>申报查询</div>*/

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/businessReport`
const businessReport = strategies['reportManage']['businessReport'];

const BusinessReport_Routes = [
    {
    /*    path:`${PATH}/generalTaxpayerVATReturn`,
        component:wrapPage('增值税一般纳税人申报表',GeneralTaxpayerVATReturn),
        name:'增值税一般纳税人申报表',
        icon:{
            url:`${ICON_URL_PATH}generalTaxpayerVATReturn.svg`,
            backgroundColor:'#00AFD8'
        },
        authorityInfo:businessReport['generalTaxpayerVATReturn'].options,
        exact:true,
    },{
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
    },{
        path:`${PATH}/prePaidSalesQuery`,
        component:wrapPage('售房预缴查询',PrePaidSalesQuery),
        name:'售房预缴查询',
        icon:{
            url:`${ICON_URL_PATH}prePaidSalesQuery.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:businessReport['prePaidSalesQuery'].options,
        exact:true,
    /*},{
        path:`${PATH}/roomFileSummaryQuery`,
        component:wrapPage('房间档案汇总查询',RoomFileSummaryQuery),
        name:'房间档案汇总查询',
        icon:{
            url:`${ICON_URL_PATH}roomFileSummaryQuery.svg`,
            backgroundColor:'#2F7597'
        },
        authorityInfo:businessReport['roomFileSummaryQuery'].options,
        exact:true,
    },{
        path:`${PATH}/interimContractInputTaxTransferredOutQuery`,
        component:wrapPage('跨期合同进项税额转出查询',InterimContractInputTaxTransferredOutQuery),
        name:'跨期合同进项税额转出查询',
        icon:{
            url:`${ICON_URL_PATH}interimContractInputTaxTransferredOutQuery.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:businessReport['interimContractInputTaxTransferredOutQuery'].options,
        exact:true,
    },{
        path:`${PATH}/landPriceDeductionDetails`,
        component:wrapPage('土地价款扣除明细查询',LandPriceDeductionDetails),
        name:'土地价款扣除明细查询',
        icon:{
            url:`${ICON_URL_PATH}report_landPriceDeductionDetails.svg`,
            backgroundColor:'#9B562C'
        },
        authorityInfo:businessReport['landPriceDeductionDetails'].options,
        exact:true,
    },{
        path:`${PATH}/taxpayersQuery`,
        component:wrapPage('纳税主体查询',TaxpayersQuery),
        name:'纳税主体查询',
        icon:{
            url:`${ICON_URL_PATH}taxpayersQuery.svg`,
            backgroundColor:'#6CCCCA'
        },
        authorityInfo:businessReport['taxpayersQuery'].options,
        exact:true,
    },{
        path:`${PATH}/taxIncentives`,
        component:wrapPage('税收优惠',TaxIncentives),
        name:'税收优惠报表',
        icon:{
            url:`${ICON_URL_PATH}report_taxIncentives.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:businessReport['taxIncentives'].options,
        exact:true,
    },{
        path:`${PATH}/taxFileQuery`,
        component:wrapPage('税务档案查询',TaxFileQuery),
        name:'税务档案查询',
        icon:{
            url:`${ICON_URL_PATH}taxFileQuery.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:businessReport['taxFileQuery'].options,
        exact:true,
    },{
        path:`${PATH}/declareParametersQuery`,
        component:wrapPage('申报参数查询',DeclareParametersQuery),
        name:'申报参数查询',
        icon:{
            url:`${ICON_URL_PATH}declareParametersQuery.svg`,
            backgroundColor:'#A9D96B'
        },
        authorityInfo:businessReport['declareParametersQuery'].options,
        exact:true,
    },{
        path:`${PATH}/invoiceQuery`,
        component:wrapPage('发票查询',InvoiceQuery),
        name:'发票查询',
        icon:{
            url:`${ICON_URL_PATH}invoiceQuery.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:businessReport['invoiceQuery'].options,
        exact:true,
    },{
        path:`${PATH}/declareQuery`,
        component:wrapPage('申报查询',DeclareQuery),
        name:'申报查询',
        icon:{
            url:`${ICON_URL_PATH}declareQuery.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:businessReport['declareQuery'].options,
        exact:true,*/
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