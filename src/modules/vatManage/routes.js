/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:09
 * description  :
 */
import {wrapPage} from 'compoments'

import SalesManag from './salesManag'
import EntryManag from './entryManag'
import LandPrice from './landPrice'
/*import SalesTaxAccount from './salesTaxAccount'
import EntryTaxAccount from './entryTaxAccount'*/
import OtherAccount from './otherAccount'

import SalesManag_Routes from './salesManag/routes'
import EntryManag_Routes from './entryManag/routes'
import LandPrice_Routes from './landPrice/routes'
/*import SalesTax_Routes from './salesTaxAccount/routes'
import EntryTax_Routes from './entryTaxAccount/routes'*/
import OtherAccount_Routes from './otherAccount/routes'
import strategies from 'config/routingAuthority.config'


const PATH = '/web/vatManage';
const vatManage = strategies['vatManage'];

const VatManage_Routes = [
            {
                path:`${PATH}/salesManag`,
                component:wrapPage('销项管理',SalesManag),
                name:'销项管理',
                exact:true,
                children:SalesManag_Routes,
                authorityInfo:vatManage['salesManag'].options
            },{
                path:`${PATH}/entryManag`,
                component:wrapPage('进项管理',EntryManag),
                name:'进项管理',
                exact:true,
                children:EntryManag_Routes,
                authorityInfo:vatManage['entryManag'].options
            },{
                path:`${PATH}/landPrice`,
                component:wrapPage('土地价款',LandPrice),
                name:'土地价款',
                exact:true,
                children:LandPrice_Routes,
                authorityInfo:vatManage['landPrice'].options
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
                component:wrapPage('其它台账',OtherAccount),
                name:'其它台账',
                exact:true,
                children:OtherAccount_Routes,
                authorityInfo:vatManage['otherAccount'].options
            },{
                path:`${PATH}`,
                redirect:true,
                to:`${PATH}/salesManag`,
            }
        ]


export default VatManage_Routes