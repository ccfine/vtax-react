/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'

import DataDictionaryMaintain from './dataDictionaryMaintain'
/*import TaxReturnsCustom from './taxReturnsCustom'
import OtherReportsAreCustom from './otherReportsAreCustom'*/
import TaxClassificationCode from './taxClassificationCode'
import TaxableItems from './taxableItems'
import SubjectRateRela from './subjectRateRela'

const ICON_URL_PATH = '/assets/routes_avatar/';
const PATHS = '/web/systemManage/systemMaintain';

const SystemMaintain_Routes = [
    {
    /*    path:`${PATHS}/taxReturnsCustom`,
        component:wrapPage('纳税申报表自定义',TaxReturnsCustom),
        name:'纳税申报表自定义',
        icon:{
            url:`${ICON_URL_PATH}taxReturnsCustom.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:systemMaintain['taxReturnsCustom'].options,
        exact:true,
    },{
        path:`${PATHS}/otherReportsAreCustom`,
        component:wrapPage('其他报表自定义',OtherReportsAreCustom),
        name:'其他报表自定义',
        icon:{
            url:`${ICON_URL_PATH}otherReportsAreCustom.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:systemMaintain['otherReportsAreCustom'].options,
        exact:true,
    },{*/
        path:`${PATHS}/dataDictionaryMaintain`,
        component:wrapPage('数据字典维护',DataDictionaryMaintain),
        name:'数据字典维护',
        icon:{
            url:`${ICON_URL_PATH}dataDictionaryMaintain.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATHS}/taxClassificationCode`,
        component:wrapPage('税收分类编码',TaxClassificationCode),
        name:'税收分类编码',
        icon:{
            url:`${ICON_URL_PATH}taxClassificationCode.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATHS}/taxableItems`,
        component:wrapPage('应税项目',TaxableItems),
        name:'应税项目',
        icon:{
            url:`${ICON_URL_PATH}taxableItems.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },
    {
        path:`${PATHS}/subjectRateRela`,
        component:wrapPage('科目税率对应表',SubjectRateRela),
        name:'科目税率对应表',
        icon:{
            url:`${ICON_URL_PATH}subjectRateRela.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/taxReturnsCustom`,
    }
]

export default SystemMaintain_Routes