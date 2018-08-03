/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
// import LandPriceDeductionDetails from './landPriceDeductionDetails'
import TaxExemptionDetails from './taxExemptionDetails'
import PrepayTax from './prepayTax'
// import TaxCalculation from './taxCalculation'
/*
import DeductProjectSummary from './deductProjectSummary'
import PrePaidHousingSales from './prePaidHousingSales'
import BusinessTaxChangeTaxAnalysisNegative from './businessTaxChangeTaxAnalysisNegative'
*/
import strategies from 'config/routingAuthority.config'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/otherAccount`
const otherAccount = strategies['vatManage']['otherAccount'];

const OtherAccount_Routes = [
    {
    /*    path:`${PATH}/prePaidHousingSales`,
        component:wrapPage('售房预缴台账',PrePaidHousingSales),
        name:'售房预缴台账',
        icon:{
            url:`${ICON_URL_PATH}prePaidHousingSales.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:otherAccount['prePaidHousingSales'].options,
        exact:true,
    },{*/
        path:`${PATH}/prepayTax`,
        component:wrapPage('预缴税款台账',PrepayTax),
        name:'预缴税款台账',
        icon:{
            url:`${ICON_URL_PATH}prepayTax.svg`,
            backgroundColor:'#00D01A'
        },
        authorityInfo:otherAccount['prepayTax'].options,
        exact:true,
    // },{
    //     path:`${PATH}/landPriceDeductionDetails`,
    //     component:wrapPage('土地价款扣除明细台账',LandPriceDeductionDetails),
    //     name:'土地价款扣除明细台账',
    //     icon:{
    //         url:`${ICON_URL_PATH}landPriceDeductionDetails.svg`,
    //         backgroundColor:'#9A572C'
    //     },
    //     authorityInfo:otherAccount['landPriceDeductionDetails'].options,
    //     exact:true,
    },{/*
        path:`${PATH}/deductProjectSummary`,
        component:wrapPage('扣除项目汇总台账',DeductProjectSummary),
        name:'扣除项目汇总台账',
        icon:{
            url:`${ICON_URL_PATH}deductProjectSummary.svg`,
            backgroundColor:'#FD6A60'
        },
        authorityInfo:otherAccount['deductProjectSummary'].options,
        exact:true,
    },{*/
        path:`${PATH}/taxExemptionDetails`,
        component:wrapPage('减免税明细台账',TaxExemptionDetails),
        name:'减免税明细台账',
        icon:{
            url:`${ICON_URL_PATH}taxExemptionDetails.svg`,
            backgroundColor:'#57C8F2'
        },
        authorityInfo:otherAccount['taxExemptionDetails'].options,
        exact:true,
    /*},{
        path:`${PATH}/businessTaxChangeTaxAnalysisNegative`,
        component:wrapPage('营改增税负分析测算台账',BusinessTaxChangeTaxAnalysisNegative),
        name:'营改增税负分析测算台账',
        icon:{
            url:`${ICON_URL_PATH}businessTaxChangeTaxAnalysisNegative.svg`,
            backgroundColor:'#2F7597'
        },
        authorityInfo:otherAccount['businessTaxChangeTaxAnalysisNegative'].options,
        exact:true,*/
    }/*,{
        path:`${PATH}/taxCalculation`,
        component:wrapPage('税款计算台账',TaxCalculation),
        name:'税款计算台账',
        icon:{
            url:`${ICON_URL_PATH}taxCalculation.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:otherAccount['taxCalculation'].options,
        exact:true,
    }*/,{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/billingSalesAccount`,
    }
]

export default OtherAccount_Routes