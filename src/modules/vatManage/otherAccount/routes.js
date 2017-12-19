/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const PrePaidHousingSales =()=><div>售房预缴台账</div>
const PrepayTax =()=><div>预缴税款台账</div>
const LandPriceDeductionDetails =()=><div>土地价款扣除明细台账</div>
const DeductProjectSummary =()=><div>扣除项目汇总台账</div>
const TaxExemptionDetails =()=><div>减免税明细台账</div>
const BusinessTaxChangeTaxAnalysisNegative =()=><div>营改增税负分析测算台账</div>
const TaxCalculation =()=><div>税款计算台账</div>

const PATH = `/web/vatManage/otherAccount`;

const OtherAccount_Routes = [
    {
        path:`${PATH}/prePaidHousingSales`,
        component:wrapPage('售房预缴台账',PrePaidHousingSales),
        name:'售房预缴台账',
        exact:true,
    },{
        path:`${PATH}/prepayTax`,
        component:wrapPage('预缴税款台账',PrepayTax),
        name:'预缴税款台账',
        exact:true,
    },{
        path:`${PATH}/landPriceDeductionDetails`,
        component:wrapPage('土地价款扣除明细台账',LandPriceDeductionDetails),
        name:'土地价款扣除明细台账',
        exact:true,
    },{
        path:`${PATH}/deductProjectSummary`,
        component:wrapPage('扣除项目汇总台账',DeductProjectSummary),
        name:'扣除项目汇总台账',
        exact:true,
    },{
        path:`${PATH}/taxExemptionDetails`,
        component:wrapPage('减免税明细台账',TaxExemptionDetails),
        name:'减免税明细台账',
        exact:true,
    },{
        path:`${PATH}/businessTaxChangeTaxAnalysisNegative`,
        component:wrapPage('营改增税负分析测算台账',BusinessTaxChangeTaxAnalysisNegative),
        name:'营改增税负分析测算台账',
        exact:true,
    },{
        path:`${PATH}/taxCalculation`,
        component:wrapPage('税款计算台账',TaxCalculation),
        name:'税款计算台账',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/billingSalesAccount`,
    }
]

export default OtherAccount_Routes