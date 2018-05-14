/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import LoadAble from 'react-loadable'
import {wrapPage,LoadingPage} from 'compoments'
import strategies from 'config/routingAuthority.config'

/*import CreateADeclare from '../../taxDeclare/createADeclare'*/
/*import SearchDeclare from '../../taxDeclare/searchDeclare'*/

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/taxDeclare`
const taxDeclare = strategies['taxDeclare'];

const AsyncCreateADeclare = LoadAble({
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
});
const Children_Routes = [
    {
        path:`${PATH}/createADeclare`,
        component:wrapPage('创建申报',AsyncCreateADeclare),
        name:'创建申报',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['createADeclare'].options,
        exact:true,
    },{
        path:`${PATH}/declareHandle`,
        component:wrapPage('申报办理',AsyncDeclareHandle),
        name:'申报办理',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['declareHandle'].options,
        exact:true,
    },{
        path:`${PATH}/searchDeclare`,
        component:wrapPage('查询申报',AsyncSearchDeclare),
        name:'查询申报',
        icon:{
            url:`${ICON_URL_PATH}upcomingMatter.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:taxDeclare['searchDeclare'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/createADeclare`,
    }
]

export default Children_Routes