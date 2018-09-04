/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
//import LoadAble from 'react-loadable'
import {AsyncComponent} from 'compoments'
import strategies from 'config/routingAuthority.config'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/taxDeclare`
const taxDeclare = strategies['taxDeclare'];

const CreateADeclare = AsyncComponent(() => import('../../taxDeclare/createADeclare'), '创建申报')
const DeclareHandle = AsyncComponent(() => import('../../taxDeclare/declareHandle'), '申报办理')
const SearchDeclare = AsyncComponent(() => import('../../taxDeclare/searchDeclare'), '查询申报')

const Create_LookDeclare = AsyncComponent(() => import('../createADeclare/lookDeclare'), '查看申报')
const Handle_LookDeclare = AsyncComponent(() => import('../declareHandle/lookDeclare'), '查看申报')
const Search_LookDeclare = AsyncComponent(() => import('../searchDeclare/lookDeclare'), '查看申报')
const Handle_HandleDeclare = AsyncComponent(() => import('../declareHandle/handleDeclare'), '申报办理')
const Handle_RevokeDeclare = AsyncComponent(() => import('../declareHandle/revokeDeclare'), '申报撤回')

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
        component:CreateADeclare,
        name:'创建申报',
        icon:{
            url:`${ICON_URL_PATH}createADeclare.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['createADeclare'].options,
        exact:true,
        children:[{
            path:`${PATH}/createADeclare/lookDeclare/:id`,
            component:Create_LookDeclare,
            name:'查看申报',
            exact:true,
        }],
    },{
        path:`${PATH}/declareHandle`,
        component:DeclareHandle,
        name:'申报办理',
        icon:{
            url:`${ICON_URL_PATH}declareHandle.svg`,
            backgroundColor:'#56C7F3'
        },
        authorityInfo:taxDeclare['declareHandle'].options,
        exact:true,
        children:[{
            path:`${PATH}/declareHandle/lookDeclare/:id`,
            component:Handle_LookDeclare,
            name:'查看申报',
            exact:true,
        },{
            path:`${PATH}/declareHandle/handleDeclare/:id`,
            component:Handle_HandleDeclare,
            name:'申报办理',
            exact:true,
        },{
            path:`${PATH}/declareHandle/revokeDeclare/:id`,
            component:Handle_RevokeDeclare,
            name:'申报撤回',
            exact:true,
        }],
    },{
        path:`${PATH}/searchDeclare`,
        component:SearchDeclare,
        name:'查询申报',
        icon:{
            url:`${ICON_URL_PATH}searchDeclare.svg`,
            backgroundColor:'#F5A544'
        },
        authorityInfo:taxDeclare['searchDeclare'].options,
        exact:true,
        children:[{
            path:`${PATH}/searchDeclare/lookDeclare/:id`,
            component:Search_LookDeclare,
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