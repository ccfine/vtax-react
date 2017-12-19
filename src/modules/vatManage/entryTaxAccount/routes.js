/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import InputTaxDetails from './inputTaxDetails'
import InputTaxStructure from './inputTaxStructure'
import InputTaxOnFixedAssets from './inputTaxOnFixedAssets'
import InterimContractInputTaxTransferredOut from './interimContractInputTaxTransferredOut'
import OtherBusinessInputTaxRollOut from './otherBusinessInputTaxRollOut'

const PATH = `/web/vatManage/entryTaxAccount`;

const EntryTax_Routes = [
    {
        path:`${PATH}/inputTaxDetails`,
        component:wrapPage('进项税额明细台账',InputTaxDetails),
        name:'进项税额明细台账',
        exact:true,
    },{
        path:`${PATH}/inputTaxStructure`,
        component:wrapPage('进项税额结构台账',InputTaxStructure),
        name:'进项税额结构台账',
        exact:true,
    },{
        path:`${PATH}/inputTaxOnFixedAssets`,
        component:wrapPage('固定资产进项税额台账',InputTaxOnFixedAssets),
        name:'固定资产进项税额台账',
        exact:true,
    },{
        path:`${PATH}/interimContractInputTaxTransferredOut`,
        component:wrapPage('跨期合同进项税额转出台账',InterimContractInputTaxTransferredOut),
        name:'跨期合同进项税额转出台账',
        exact:true,
    },{
        path:`${PATH}/otherBusinessInputTaxRollOut`,
        component:wrapPage('其他业务进项税额转出台账',OtherBusinessInputTaxRollOut),
        name:'其他业务进项税额转出台账',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/inputTaxDetails`,
    }
]

export default EntryTax_Routes