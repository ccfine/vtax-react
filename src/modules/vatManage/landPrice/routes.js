/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from 'compoments'
import LandPriceManage from './landPriceManage'
/*import LandArea from './landArea'*/
import OtherTaxableItemsDeduct from './otherTaxableItemsDeduct'
import strategies from 'config/routingAuthority.config'
import LandPriceDeductionDetails from './landPriceDeductionDetails'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/landPrice`;
const landPrice = strategies['vatManage']['landPrice'];

const LandPrice_Routes = [
    {
        path:`${PATH}/landPriceManage`,
        component:wrapPage('土地价款管理',LandPriceManage),
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
        component:wrapPage('土地价款扣除明细台账',LandPriceDeductionDetails),
        name:'土地价款扣除明细台账',
        icon:{
            url:`${ICON_URL_PATH}landPriceDeductionDetails.svg`,
            backgroundColor:'#9A572C'
        },
        authorityInfo:landPrice['landPriceDeductionDetails'].options,
        exact:true,
    },{
        path:`${PATH}/otherTaxableItemsDeduct`,
        component:wrapPage('其他应税项目扣除台账',OtherTaxableItemsDeduct),
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