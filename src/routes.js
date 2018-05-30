/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:06
 * description  :
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import Web from 'modules/Web.r'
import Login from 'modules/login'
import Exception403 from 'modules/exception/403'
import Exception404 from 'modules/exception/404'
import Exception500 from 'modules/exception/500'
import {RouteWithSubRoutes} from 'compoments'
/*const NoMatch = () => <div>no match</div>*/


const routes = [
    {
        path:'/web',
        component:Web,
        name:'主页',
    },{
        path:'/login',
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
        path:'*',
        redirect:true,
        to:'/web'
    /*},{
        path:'*',
        component:NoMatch*/
    }
]

const MainRoute =(
    <Route render={({location})=>{

        const homeRoute = () => <Redirect to="/login"/>
        return(
            <Layout>
                <Route exact strict path="/" render={homeRoute} />
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