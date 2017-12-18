/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'

import AubjectOfTaxPayment from './aubjectOfTaxPayment'
import TaxIncentives from './taxIncentives'
import DeclareParameter from './declareParameter'


const PATHS = '/web/basisManage/basicInfo';

const BasicInfo_Routes = [
    {
        path:`${PATHS}/aubjectOfTaxPayment`,
        component:wrapPage('纳税主体',AubjectOfTaxPayment),
        name:'纳税主体',
        exact:true,
    },{
        path:`${PATHS}/taxIncentives`,
        component:wrapPage('税收优惠',TaxIncentives),
        name:'税收优惠',
        exact:true,
    },{
        path:`${PATHS}/declareParameter`,
        component:wrapPage('申报参数',DeclareParameter),
        name:'申报参数',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/aubjectOfTaxPayment`,
    }
]

export default BasicInfo_Routes