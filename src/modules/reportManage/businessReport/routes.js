/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const GeneralTaxpayerVATReturn =()=><div>增值税一般纳税人申报表</div>
const VATPrepaymentForm =()=><div>增值税预缴表</div>
const RoomTransactionFile =()=><div>房间交易档案</div>
const RoomFileSummaryQuery =()=><div>房间档案汇总查询</div>
const InterimContractInputTaxTransferredOutQuery =()=><div>跨期合同进项税额转出查询</div>
const LandPriceDeductionDetails =()=><div>土地价款扣除明细查询</div>
const PrePaidSalesQuery =()=><div>售房预缴查询</div>
const TaxpayersQuery =()=><div>纳税主体查询</div>
const TaxIncentives =()=><div>税收优惠</div>
const TaxFileQuery =()=><div>税务档案查询</div>
const DeclareParametersQuery =()=><div>申报参数查询</div>
const InvoiceQuery =()=><div>发票查询</div>
const DeclareQuery =()=><div>申报查询</div>

const PATH = `/web/reportManage/businessReport`;

const BusinessReport_Routes = [
    {
        path:`${PATH}/generalTaxpayerVATReturn`,
        component:wrapPage('增值税一般纳税人申报表',GeneralTaxpayerVATReturn),
        name:'增值税一般纳税人申报表',
        exact:true,
    },{
        path:`${PATH}/vatPrepaymentForm`,
        component:wrapPage('增值税预缴表',VATPrepaymentForm),
        name:'增值税预缴表',
        exact:true,
    },{
        path:`${PATH}/roomTransactionFile`,
        component:wrapPage('房间交易档案',RoomTransactionFile),
        name:'房间交易档案',
        exact:true,
    },{
        path:`${PATH}/roomFileSummaryQuery`,
        component:wrapPage('房间档案汇总查询',RoomFileSummaryQuery),
        name:'房间档案汇总查询',
        exact:true,
    },{
        path:`${PATH}/interimContractInputTaxTransferredOutQuery`,
        component:wrapPage('跨期合同进项税额转出查询',InterimContractInputTaxTransferredOutQuery),
        name:'跨期合同进项税额转出查询',
        exact:true,
    },{
        path:`${PATH}/landPriceDeductionDetails`,
        component:wrapPage('土地价款扣除明细查询',LandPriceDeductionDetails),
        name:'土地价款扣除明细查询',
        exact:true,
    },{
        path:`${PATH}/prePaidSalesQuery`,
        component:wrapPage('售房预缴查询',PrePaidSalesQuery),
        name:'售房预缴查询',
        exact:true,
    },{
        path:`${PATH}/taxpayersQuery`,
        component:wrapPage('纳税主体查询',TaxpayersQuery),
        name:'纳税主体查询',
        exact:true,
    },{
        path:`${PATH}/taxIncentives`,
        component:wrapPage('税收优惠',TaxIncentives),
        name:'税收优惠',
        exact:true,
    },{
        path:`${PATH}/taxFileQuery`,
        component:wrapPage('税务档案查询',TaxFileQuery),
        name:'税务档案查询',
        exact:true,
    },{
        path:`${PATH}/declareParametersQuery`,
        component:wrapPage('申报参数查询',DeclareParametersQuery),
        name:'申报参数查询',
        exact:true,
    },{
        path:`${PATH}/invoiceQuery`,
        component:wrapPage('发票查询',InvoiceQuery),
        name:'发票查询',
        exact:true,
    },{
        path:`${PATH}/declareQuery`,
        component:wrapPage('申报查询',DeclareQuery),
        name:'申报查询',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default BusinessReport_Routes