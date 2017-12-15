/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'
import SalesTax_routes from './salesTaxAccount/routes'

import SalesTaxAccount from './salesTaxAccount'
import EntryTaxAccount from './entryTaxAccount'
import OtherAccount from './otherAccount'


const AccountManage_PATH = `/web/accountManage`;
const AccountManage_routes = [
    {
        path:`${AccountManage_PATH}/salesTaxAccount`,
        component:wrapPage('销项税台账',SalesTaxAccount),
        name:'销项税台账',
        children:SalesTax_routes
    },{
        path:`${AccountManage_PATH}/entryTaxAccount`,
        component:wrapPage('进项税台账',EntryTaxAccount),
        name:'进项税台账'
    },{
        path:`${AccountManage_PATH}/otherAccount`,
        component:wrapPage('其它台账',OtherAccount),
        name:'其它台账'
    },{
        path:`${AccountManage_PATH}`,
        redirect:true,
        to:`${AccountManage_PATH}/salesTaxAccount`,
    }
]

export default AccountManage_routes