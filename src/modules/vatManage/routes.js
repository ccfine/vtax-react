/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {AsyncComponent} from 'compoments'

/*import SalesTaxAccount from './salesTaxAccount'
import EntryTaxAccount from './entryTaxAccount'*/

import SalesManag_Routes from './salesManag/routes'
import EntryManag_Routes from './entryManag/routes'
import LandPrice_Routes from './landPrice/routes'
/*import SalesTax_Routes from './salesTaxAccount/routes'
import EntryTax_Routes from './entryTaxAccount/routes'*/
import OtherAccount_Routes from './otherAccount/routes'
import { getChildOptions } from 'config/routingAuthority.config'

const SalesManag = AsyncComponent(() => import('./salesManag'), '销项管理')
const EntryManag = AsyncComponent(() => import('./entryManag'), '进项管理')
const LandPrice = AsyncComponent(() => import('./landPrice'), '土地价款')
const OtherAccount = AsyncComponent(() => import('./otherAccount'), '其他台账')

const PATH = '/web/vatManage';

const VatManage_Routes = [
            {
                path:`${PATH}/salesManag`,
                component:SalesManag,
                name:'销项管理',
                exact:true,
                children:SalesManag_Routes,
                authorityInfo:getChildOptions('vatManage','salesManag'),
            },{
                path:`${PATH}/entryManag`,
                component:EntryManag,
                name:'进项管理',
                exact:true,
                children:EntryManag_Routes,
                authorityInfo:getChildOptions('vatManage','entryManag'),
            },{
                path:`${PATH}/landPrice`,
                component:LandPrice,
                name:'土地价款',
                exact:true,
                children:LandPrice_Routes,
                authorityInfo:getChildOptions('vatManage','landPrice'),
            /*},{
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
                children:EntryTax_Routes*/
            },{
                path:`${PATH}/otherAccount`,
                component:OtherAccount,
                name:'其他台账',
                exact:true,
                children:OtherAccount_Routes,
                authorityInfo:getChildOptions('vatManage','otherAccount'),
            },{
                path:`${PATH}`,
                redirect:true,
                to:`${PATH}/salesManag`,
            }
        ]


export default VatManage_Routes