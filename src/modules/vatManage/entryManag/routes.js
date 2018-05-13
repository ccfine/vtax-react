/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
import InvoiceCollection from './invoiceCollection'
import OtherDeductibleInputTaxDetails from './otherDeductibleInputTaxDetails'
import InputTaxDetails from '../entryTaxAccount/inputTaxDetails'
/*
import InputTaxStructure from '../entryTaxAccount/inputTaxStructure'
 import InvoiceMatching from './invoiceMatching'
* */
import InputTaxOnFixedAssets from '../entryTaxAccount/inputTaxOnFixedAssets'
import InterimContractInputTaxTransferredOut from '../entryTaxAccount/interimContractInputTaxTransferredOut'
import OtherBusinessInputTaxRollOut from '../entryTaxAccount/otherBusinessInputTaxRollOut'
/*import SimpleTaxInputTaxTransferredToTheAccount from '../entryTaxAccount/simpleTaxInputTaxTransferredToTheAccount'*/
import strategies from 'config/routingAuthority.config'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/entryManag`;
const entryManag = strategies['vatManage']['entryManag'];

const EntryManag_Routes = [
    {
        path:`${PATH}/invoiceCollection`,
        component:wrapPage('进项发票采集',InvoiceCollection),
        name:'进项发票采集',
        icon:{
            url:`${ICON_URL_PATH}invoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        authorityInfo:entryManag['invoiceCollection'].options,
        exact:true,
    },{
        path:`${PATH}/otherDeductibleInputTaxDetails`,
        component:wrapPage('其他可抵扣进项税明细',OtherDeductibleInputTaxDetails),
        name:'其他可抵扣进项税明细',
        icon:{
            url:`${ICON_URL_PATH}invoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        authorityInfo:entryManag['otherDeductibleInputTaxDetails'].options,
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
        component:wrapPage('进项税额明细台账',InputTaxDetails),
        name:'进项税额明细台账',
        icon:{
            url:`${ICON_URL_PATH}inputTaxDetails.svg`,
            backgroundColor:'#307173'
        },
        authorityInfo:entryManag['inputTaxDetails'].options,
        exact:true,
  /*},{
        path:`${PATH}/inputTaxStructure`,
        component:wrapPage('进项税额结构台账',InputTaxStructure),
        name:'进项税额结构台账',
        icon:{
            url:`${ICON_URL_PATH}inputTaxStructure.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,*/
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
        exact:true,
    },{
        path:`${PATH}/otherBusinessInputTaxRollOut`,
        component:wrapPage('其他业务进项税额转出台账',OtherBusinessInputTaxRollOut),
        name:'其他业务进项税额转出台账',
        icon:{
            url:`${ICON_URL_PATH}otherBusinessInputTaxRollOut.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['otherBusinessInputTaxRollOut'].options,
        exact:true,
/*    },{
        path:`${PATH}/simpleTaxInputTaxTransferredToTheAccount`,
        component:wrapPage('简易计税进项税额转出台账',SimpleTaxInputTaxTransferredToTheAccount),
        name:'简易计税进项税额转出台账',
        icon:{
            url:`${ICON_URL_PATH}otherBusinessInputTaxRollOut.svg`,
            backgroundColor:'#3B4A83'
        },
        authorityInfo:entryManag['simpleTaxInputTaxTransferredToTheAccount'].options,
        exact:true,*/
    },{
        exact:true,
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/invoiceCollection`,
    }
]

export default EntryManag_Routes