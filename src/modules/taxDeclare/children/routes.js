/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const CreateADeclare =()=><div>创建申报</div>
const SearchDeclare =()=><div>查询申报</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/taxDeclare`

const Children_Routes = [
    {
        path:`${PATH}/createADeclare`,
        component:wrapPage('创建申报',CreateADeclare),
        name:'创建申报',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATH}/searchDeclare`,
        component:wrapPage('查询申报',SearchDeclare),
        name:'查询申报',
        icon:{
            url:`${ICON_URL_PATH}upcomingMatter.svg`,
            backgroundColor:'#F5A544'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/createADeclare`,
    }
]

export default Children_Routes