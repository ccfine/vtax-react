/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import BillingSales from './billingSales'
import UnbilledAales from './unbilledAales'
import OtherTaxAdjustment from './otherTaxAdjustment'

const PATHS = '/web/vatManage/salesTaxAccount';

const SalesTax_Routes = [
    {
        path:`${PATHS}/billingSales`,
        component:wrapPage('开票销售台账',BillingSales),
        name:'开票销售台账',
        exact:true,
    },{
        path:`${PATHS}/unbilledAales`,
        component:wrapPage('未开票销售台账',UnbilledAales),
        name:'未开票销售台账',
        exact:true,
    },{
        path:`${PATHS}/otherTaxAdjustment`,
        component:wrapPage('其他涉税调整台账',OtherTaxAdjustment),
        name:'其他涉税调整台账',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/billingSales`,
    }
]

export default SalesTax_Routes