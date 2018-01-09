/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const CreateAMatter =()=><div>创建事项</div>
const UpcomingMatter =()=><div>待办事项</div>
const AlreadyMatter =()=><div>已办事项</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/taxDeclare`

const Children_Routes = [
    {
        path:`${PATH}/createAMatter`,
        component:wrapPage('创建事项',CreateAMatter),
        name:'创建事项',
        icon:{
            url:`${ICON_URL_PATH}createAMatter.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATH}/upcomingMatter`,
        component:wrapPage('待办事项',UpcomingMatter),
        name:'待办事项',
        icon:{
            url:`${ICON_URL_PATH}upcomingMatter.svg`,
            backgroundColor:'#F5A544'
        },
        exact:true,
    },{
        path:`${PATH}/alreadyMatter`,
        component:wrapPage('已办事项',AlreadyMatter),
        name:'已办事项',
        icon:{
            url:`${ICON_URL_PATH}alreadyMatter.svg`,
            backgroundColor:'#7FD62F'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/createAMatter`,
    }
]

export default Children_Routes