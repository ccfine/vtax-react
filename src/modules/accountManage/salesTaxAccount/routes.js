/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import BillingSalesAccount from './billingSalesAccount'
import UnbilledAalesAccount from './unbilledAalesAccount'
import OtherTaxAdjustmentAccount from './otherTaxAdjustmentAccount'
import OutputTaxAccount from './outputTaxAccount'

const salesTax_PATH = `/web/accountManage/salesTaxAccount`;

const SalesTax_routes = [
    {
        path:`${salesTax_PATH}/billingSalesAccount`,
        component:wrapPage('开票销售台账',BillingSalesAccount),
        name:'开票销售台账',
    },{
        path:`${salesTax_PATH}/unbilledAalesAccount`,
        component:wrapPage('未开票销售台账',UnbilledAalesAccount),
        name:'未开票销售台账',
    },{
        path:`${salesTax_PATH}/otherTaxAdjustmentAccount`,
        component:wrapPage('其他涉税调整台账',OtherTaxAdjustmentAccount),
        name:'其他涉税调整台账',
    },{
        path:`${salesTax_PATH}/outputTaxAccount`,
        component:wrapPage('销项税台账',OutputTaxAccount),
        name:'销项税台账',
    }
]

export default SalesTax_routes