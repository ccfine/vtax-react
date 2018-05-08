/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:06
 * description  :
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import Web from './modules/Web.r'
import Login from './modules/login'
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