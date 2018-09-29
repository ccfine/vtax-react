/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {AsyncComponent} from 'compoments'
/*import LandArea from './landArea'*/
import strategies from 'config/routingAuthority.config'


const LandPriceManage = AsyncComponent(() => import('./landPriceManage'), '土地价款管理')
const LandPriceDeductionDetails = AsyncComponent(() => import('./landPriceDeductionDetails'), '土地价款扣除明细台账')
const OtherTaxableItemsDeduct = AsyncComponent(() => import('./otherTaxableItemsDeduct'), '其他应税项目扣除台账')

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/landPrice`;
const landPrice = strategies['vatManage']['landPrice'];

const LandPrice_Routes = [
    {
        path:`${PATH}/landPriceManage`,
        component:LandPriceManage,
        name:'土地价款管理',
        icon:{
            url:`${ICON_URL_PATH}landPriceManage.svg`,
            backgroundColor:'#904C27'
        },
        authorityInfo:landPrice['landPriceManage'].options,
        exact:true,
    /*},{
        path:`${PATH}/LandArea`,
        component:wrapPage('分期可售土地面积',LandArea),
        name:'分期可售土地面积',
        icon:{
            url:`${ICON_URL_PATH}landPriceManage.svg`,
            backgroundColor:'#904C27'
        },
        authorityInfo:landPrice['LandArea'].options,
        exact:true,*/
    },{
        path:`${PATH}/landPriceDeductionDetails`,
        component:LandPriceDeductionDetails,
        name:'土地价款扣除明细台账',
        icon:{
            url:`${ICON_URL_PATH}landPriceDeductionDetails.svg`,
            backgroundColor:'#9A572C'
        },
        authorityInfo:landPrice['landPriceDeductionDetails'].options,
        exact:true,
    },{
        path:`${PATH}/otherTaxableItemsDeduct`,
        component:OtherTaxableItemsDeduct,
        name:'其他应税项目扣除台账',
        icon:{
            url:`${ICON_URL_PATH}otherTaxableItemsDeduct.svg`,
            backgroundColor:'#904C27'
        },
        authorityInfo:landPrice['otherTaxableItemsDeduct'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/landPriceManage`,
    }
]

export default LandPrice_Routes