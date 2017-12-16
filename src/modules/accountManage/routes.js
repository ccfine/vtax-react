/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from '../../compoments'

import SalesTaxAccount from './salesTaxAccount'
import EntryTaxAccount from './entryTaxAccount'
import OtherAccount from './otherAccount'

import SalesTax_Routes from './salesTaxAccount/routes'
import EntryTax_Routes from './entryTaxAccount/routes'


const PATH = '/web/accountManage';
const AccountManage_Routes = [
            {
                path:`${PATH}/salesTaxAccount`,
                component:wrapPage('销项税台账',SalesTaxAccount),
                name:'销项税台账',
                exact:true,
                children:SalesTax_Routes
            },{
                path:`${PATH}/entryTaxAccount`,
                component:wrapPage('进项税台账',EntryTaxAccount),
                name:'进项税台账',
                exact:true,
                children:EntryTax_Routes
            },{
                path:`${PATH}/otherAccount`,
                component:wrapPage('其它台账',OtherAccount),
                name:'其它台账',
                exact:true,
            },{
                path:`${PATH}`,
                redirect:true,
                to:`${PATH}/salesTaxAccount`,
            }
        ]


export default AccountManage_Routes