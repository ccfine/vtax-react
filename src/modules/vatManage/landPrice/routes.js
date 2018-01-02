/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import LandPriceManage from './landPriceManage'

const PATH = `/web/vatManage/landPrice`;

const LandPrice_Routes = [
    {
        path:`${PATH}/landPriceManage`,
        component:wrapPage('土地价款管理',LandPriceManage),
        name:'土地价款管理',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/landPriceManage`,
    }
]

export default LandPrice_Routes