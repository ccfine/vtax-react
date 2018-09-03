/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:06
 * description  :
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import AsyncComponent from './compoments/asyncComponent';
// import Web from 'modules/Web.r'
// import Login from 'modules/login'
// import Exception403 from 'modules/exception/403'
// import Exception404 from 'modules/exception/404'
// import Exception500 from 'modules/exception/500'
import {RouteWithSubRoutes} from 'compoments'
// import Help from './modules/help'
// import {wrapPage} from 'compoments'
/*const NoMatch = () => <div>no match</div>*/

const Web = AsyncComponent(() => import('modules/Web.r'), '主页')
const Login = AsyncComponent(() => import('modules/login'), '登陆')
const Exception403 = AsyncComponent(() => import('modules/exception/403'), '403')
const Exception404 = AsyncComponent(() => import('modules/exception/404'), '404')
const Exception500 = AsyncComponent(() => import('modules/exception/500'), '500')
const Help = AsyncComponent(() => import('./modules/help'), '帮助中心')

const routes = [
    {
        path:'/web',
        component:Web,
        name:'主页',
    },{
        path:`/help`,
        component:Help, //wrapPage('帮助中心',Help),
        name:'帮助中心',
    },{
        path:'/tax2018bgy/login',
        component:props=><Login {...props} type={1}/>,
        name:'登录'
    },{
        path:'/loginA',
        component:props=><Login {...props} type={2}/>,
        name:'url登录'
    },{
        path:'/403',
        component:Exception403,
        name:'403',
    },{
        path:'/404',
        component:Exception404,
        name:'404',
    },{
        path:'/500',
        component:Exception500,
        name:'500',
    },{
        path:'/web/*',
        redirect:true,
        to:'/web'
    },{
        path:'*',
        redirect:true,
        to:'/404'
    }
]

const MainRoute =(
    <Route render={({location})=>{

        // const homeRoute = () => <Redirect to="/login"/>
        return(
            <Layout>
                {/* <Route exact strict path="/" render={homeRoute} /> */}
                <Switch>
                    {routes.map((route, index) => (
                        <RouteWithSubRoutes key={index} {...route}/>
                    ))}
                </Switch>

            </Layout>
        )
    }} />
)

export default MainRoute