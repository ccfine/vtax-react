/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
//import LoadAble from 'react-loadable'
import {wrapPage} from 'compoments'
import strategies from 'config/routingAuthority.config'

import CreateADeclare from '../../taxDeclare/createADeclare'
import SearchDeclare from '../../taxDeclare/searchDeclare'
import DeclareHandle from '../../taxDeclare/declareHandle'
import Create_LookDeclare from '../createADeclare/lookDeclare'
import Handle_LookDeclare from '../declareHandle/lookDeclare'
import Search_LookDeclare from '../searchDeclare/lookDeclare'
import Handle_HandleDeclare from '../declareHandle/handleDeclare'
import Handle_RevokeDeclare from '../declareHandle/revokeDeclare'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/taxDeclare`
const taxDeclare = strategies['taxDeclare'];

/*const AsyncCreateADeclare = LoadAble({
    loader: () => import('../../taxDeclare/createADeclare'),
    loading: LoadingPage,
});

const AsyncSearchDeclare = LoadAble({
    loader: () => import('../../taxDeclare/searchDeclare'),
    loading: LoadingPage,
});

const AsyncDeclareHandle = LoadAble({
    loader: () => import('../../taxDeclare/declareHandle'),
    loading: LoadingPage,
});*/

const Children_Routes = [
    {
        path:`${PATH}/createADeclare`,
        component:wrapPage('创建申报',CreateADeclare),
        name:'创建申报',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['createADeclare'].options,
        exact:true,
        children:[{
            path:`${PATH}/createADeclare/lookDeclare/:id`,
            component:wrapPage('查看申报',Create_LookDeclare),
            name:'查看申报',
            exact:true,
        }],
    },{
        path:`${PATH}/declareHandle`,
        component:wrapPage('申报办理',DeclareHandle),
        name:'申报办理',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['declareHandle'].options,
        exact:true,
        children:[{
            path:`${PATH}/declareHandle/lookDeclare/:id`,
            component:wrapPage('查看申报',Handle_LookDeclare),
            name:'查看申报',
            exact:true,
        },{
            path:`${PATH}/declareHandle/handleDeclare/:id`,
            component:wrapPage('申报办理',Handle_HandleDeclare),
            name:'申报办理',
            exact:true,
        },{
            path:`${PATH}/declareHandle/revokeDeclare/:id`,
            component:wrapPage('申报撤回',Handle_RevokeDeclare),
            name:'申报撤回',
            exact:true,
        }],
    },{
        path:`${PATH}/searchDeclare`,
        component:wrapPage('查询申报',SearchDeclare),
        name:'查询申报',
        icon:{
            url:`${ICON_URL_PATH}upcomingMatter.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:taxDeclare['searchDeclare'].options,
        exact:true,
        children:[{
            path:`${PATH}/searchDeclare/lookDeclare/:id`,
            component:wrapPage('查看申报',Search_LookDeclare),
            name:'查看申报',
            exact:true,
        }],
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/createADeclare`,
    }
]

export default Children_Routes