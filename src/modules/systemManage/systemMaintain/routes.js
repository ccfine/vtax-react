/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'

/*import TaxReturnsCustom from './taxReturnsCustom'
import OtherReportsAreCustom from './otherReportsAreCustom'*/

const DataDictionaryMaintain = AsyncComponent(() => import('./dataDictionaryMaintain'), '数据字典维护')
const TaxClassificationCode = AsyncComponent(() => import('./taxClassificationCode'), '税收分类编码')
const TaxableItems = AsyncComponent(() => import('./taxableItems'), '应税项目')
const SubjectRateRela = AsyncComponent(() => import('./subjectRateRela'), '科目税率对应表')

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
        component:DataDictionaryMaintain,
        name:'数据字典维护',
        icon:{
            url:`${ICON_URL_PATH}dataDictionaryMaintain.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATHS}/taxClassificationCode`,
        component:TaxClassificationCode,
        name:'税收分类编码',
        icon:{
            url:`${ICON_URL_PATH}taxClassificationCode.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATHS}/taxableItems`,
        component:TaxableItems,
        name:'应税项目',
        icon:{
            url:`${ICON_URL_PATH}taxableItems.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },
    {
        path:`${PATHS}/subjectRateRela`,
        component:SubjectRateRela,
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