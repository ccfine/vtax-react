/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'
//import OtherDeductionVoucher from './otherDeductionVoucher'
/*
import InputTaxStructure from '../entryTaxAccount/inputTaxStructure'
import InvoiceMatching from './invoiceMatching'
import InterimContractInputTaxTransferredOut from '../entryTaxAccount/interimContractInputTaxTransferredOut'
import InputTaxOnFixedAssets from '../entryTaxAccount/inputTaxOnFixedAssets'
 * */
import strategies from 'config/routingAuthority.config'

const InvoiceCollection = AsyncComponent(() => import('./invoiceCollection'), '进项发票采集')
const FixedAssetCollection = AsyncComponent(() => import('./fixedAssetCollection'), '固定资产信息采集')
const InputTaxDetails = AsyncComponent(() => import('../entryTaxAccount/inputTaxDetails'), '进项税额明细台账')
const OtherBusinessInputTaxRollOut = AsyncComponent(() => import('../entryTaxAccount/otherBusinessInputTaxRollOut'), '其他类型进项税额转出台账')
//const SimplifiedTaxInputTaxTransfer = AsyncComponent(() => import('../entryTaxAccount/simplifiedTaxInputTaxTransfer'), '简易计税进项税额转出台账')
const RealEstateInputTaxCredit = AsyncComponent(() => import('../entryTaxAccount/realEstateInputTaxCredit'), '不动产进项税额抵扣台账')
const SelfContainedProductAssociation = AsyncComponent(() => import("./selfContainedProductAssociation"), "自持类产品关联进项发票")
const FixedAssetsInvoice = AsyncComponent(() => import('../entryTaxAccount/fixedAssetsInvoice'), '固定资产进项发票台账')

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/entryManag`;
const entryManag = strategies['vatManage']['entryManag'];

const EntryManag_Routes = [
    {
        path: `${PATH}/invoiceCollection`,
        component:InvoiceCollection,
        name: '进项发票采集',
        icon: {
            url: `${ICON_URL_PATH}invoiceCollection.svg`,
            backgroundColor: '#73CF2B'
        },
        authorityInfo: entryManag['invoiceCollection'].options,
        exact: true,
    },{
        path:`${PATH}/fixedAssetCollection`,
        component:FixedAssetCollection,
        name:'固定资产信息采集',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        authorityInfo:entryManag['fixedAssetCollection'].options,
        exact:true,
    /*},{
        path:`${PATH}/invoiceMatching`,
        component:wrapPage('进项发票匹配',InvoiceMatching),
        name:'进项发票匹配',
        icon:{
            url:`${ICON_URL_PATH}invoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        authorityInfo:entryManag['invoiceMatching'].options,
        exact:true,*/
    },{
        path:`${PATH}/inputTaxDetails`,
        component:InputTaxDetails,
        name:'进项税额明细台账',
        icon:{
            url:`${ICON_URL_PATH}inputTaxDetails.svg`,
            backgroundColor:'#307173'
        },
        authorityInfo:entryManag['inputTaxDetails'].options,
        exact:true,
        /* },{
        path:`${PATH}/otherDeductionVoucher`,
        component:wrapPage('其他扣税凭证',OtherDeductionVoucher),
        name:'其他扣税凭证',
        icon:{
            url:`${ICON_URL_PATH}otherDeductionVoucher.svg`,
            backgroundColor:'#4DC1F0'
        },
        authorityInfo:entryManag['otherDeductionVoucher'].options,
        exact:true,
    },{
        path:`${PATH}/inputTaxStructure`,
        component:wrapPage('进项税额结构台账',InputTaxStructure),
        name:'进项税额结构台账',
        icon:{
            url:`${ICON_URL_PATH}inputTaxStructure.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATH}/inputTaxOnFixedAssets`,
        component:wrapPage('固定资产进项税额台账',InputTaxOnFixedAssets),
        name:'固定资产进项税额台账',
        icon:{
            url:`${ICON_URL_PATH}inputTaxOnFixedAssets.svg`,
            backgroundColor:'#2F7597'
        },
        authorityInfo:entryManag['inputTaxOnFixedAssets'].options,
        exact:true,
    },{
        path:`${PATH}/interimContractInputTaxTransferredOut`,
        component:wrapPage('跨期合同进项税额转出台账',InterimContractInputTaxTransferredOut),
        name:'跨期合同进项税额转出台账',
        icon:{
            url:`${ICON_URL_PATH}interimContractInputTaxTransferredOut.svg`,
            backgroundColor:'#FD6A60'
        },
        authorityInfo:entryManag['interimContractInputTaxTransferredOut'].options,
        exact:true,*/
    },{
        path:`${PATH}/otherBusinessInputTaxRollOut`,
        component:OtherBusinessInputTaxRollOut,
        name:'其他类型进项税额转出台账',
        icon:{
            url:`${ICON_URL_PATH}otherBusinessInputTaxRollOut.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['otherBusinessInputTaxRollOut'].options,
        exact:true,
    /*},{
        path:`${PATH}/simplifiedTaxInputTaxTransfer`,
        component:SimplifiedTaxInputTaxTransfer,
        name:'简易计税进项税额转出台账',
        icon:{
            url:`${ICON_URL_PATH}simplifiedTaxInputTaxTransfer.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['simplifiedTaxInputTaxTransfer'].options,
        exact:true,*/
    },{
        path:`${PATH}/fixedAssetsInvoice`,
        component:FixedAssetsInvoice,
        name:'固定资产进项发票台账',
        icon:{
            url:`${ICON_URL_PATH}fixedAssetsInvoice.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['fixedAssetsInvoice'].options,
        exact:true,
    },{
        path:`${PATH}/realEstateInputTaxCredit`,
        component:RealEstateInputTaxCredit,
        name:'不动产进项税额抵扣台账',
        icon:{
            url:`${ICON_URL_PATH}realEstateInputTaxCredit.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['realEstateInputTaxCredit'].options,
        exact:true,
    },
    {
        path: `${PATH}/selfContainedProductAssociation`,
        component: SelfContainedProductAssociation,
        name: "自持类产品关联进项发票",
        icon: {
            url: `${ICON_URL_PATH}selfContainedProductAssociation.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: entryManag["selfContainedProductAssociation"].options,
        exact: true
    },
    {
        exact:true,
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/invoiceCollection`,
    }
]

export default EntryManag_Routes