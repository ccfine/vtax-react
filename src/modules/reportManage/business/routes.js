/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'

import strategies from 'config/routingAuthority.config'

const TaxReturnForm = AsyncComponent(() => import('./taxReturnForm'), '法人公司纳税申报表')
const ProfitCenterTaxReturn = AsyncComponent(() => import('./profitCenterTaxReturn'), '利润中心纳税申报表')
const PartnersTaxReturn = AsyncComponent(() => import('./partnersTaxReturn'), '合作方纳税申报表')
const PartnersTaxReturnForm = AsyncComponent(() => import('./partnersTaxReturn/taxReturnForm'), '合作方的纳税申报-纳税申报表')
const TaxReturnMergeCalculation = AsyncComponent(() => import('./taxReturnMergeCalculation'), '纳税申报合并计算表')
const RealEstateTax = AsyncComponent(() => import("./realEstateTax"), "不动产进项税额抵扣表")
const ReissueTicketTaxed = AsyncComponent(() => import('./reissueTicketTaxed'), '补开票已税备查档案')

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/business`
const business = strategies['reportManage']['business'];

const business_Routes = [
    {
        path:`${PATH}/taxReturn`,
        component:TaxReturnForm,
        name:'法人公司纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}taxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['taxReturn'].options,
        exact:true,
    },
    {
        path:`${PATH}/profitCenterTaxReturn`,
        component:ProfitCenterTaxReturn,
        name:'利润中心纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}profitCenterTaxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['profitCenterTaxReturn'].options,
        exact:true,
    },
    {
        path:`${PATH}/partnersTaxReturn`,
        component:PartnersTaxReturn,
        name:'合作方纳税申报表',
        icon:{
            url:`${ICON_URL_PATH}partnersTaxReturn.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['partnersTaxReturn'].options,
        exact:true,
    },
    {
        path:`${PATH}/partnersTaxReturn/partnersTaxReturnForm`,
        component:PartnersTaxReturnForm,
        name:'合作方纳税申报信息-纳税申报表',
        exact:true
    },
    {
        path:`${PATH}/taxReturnMergeCalculation`,
        component:TaxReturnMergeCalculation,
        name:'纳税申报合并计算表',
        icon:{
            url:`${ICON_URL_PATH}taxReturnMergeCalculation.svg`,
            backgroundColor:'#2E8A57'
        },
        authorityInfo:business['taxReturnMergeCalculation'].options,
        exact:true,
    },
    {
        path: `${PATH}/realEstateTax`,
        component: RealEstateTax,
        name: "不动产进项税额抵扣表",
        icon: {
            url: `${ICON_URL_PATH}realEstateTax.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["realEstateTax"].options,
        exact: true
    },
    {
        path:`${PATH}/reissueTicketTaxed`,
        component:ReissueTicketTaxed,
        name:'补开票已税备查档案',
        icon: {
            url: `${ICON_URL_PATH}reissueTicketTaxed.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["reissueTicketTaxed"].options,
        exact:true,
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default business_Routes