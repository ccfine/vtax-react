/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'

import DataDictionaryMaintain from './dataDictionaryMaintain'
import TaxReturnsCustom from './taxReturnsCustom'
import OtherReportsAreCustom from './otherReportsAreCustom'

const PATHS = '/web/systemManage/systemMaintain';

const SystemMaintain_Routes = [
    {
        path:`${PATHS}/taxReturnsCustom`,
        component:wrapPage('纳税申报表自定义',TaxReturnsCustom),
        name:'纳税申报表自定义',
        exact:true,
    },{
        path:`${PATHS}/otherReportsAreCustom`,
        component:wrapPage('其他报表自定义',OtherReportsAreCustom),
        name:'其他报表自定义',
        exact:true,
    },{
        path:`${PATHS}/dataDictionaryMaintain`,
        component:wrapPage('数据字典维护',DataDictionaryMaintain),
        name:'数据字典维护',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/taxReturnsCustom`,
    }
]

export default SystemMaintain_Routes