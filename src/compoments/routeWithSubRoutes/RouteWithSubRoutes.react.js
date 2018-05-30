
/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:35
 * description  :
 */

import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const RouteWithSubRoutes = (route) => {

    return route.redirect ? <Redirect from={route.from} to={route.to}/> :
        <Route path={route.path} render={props => (
            // pass the sub-routes down to keep nesting
            <route.component {...props} routes={route.routes}/>
        )}/>
}

export default RouteWithSubRoutes