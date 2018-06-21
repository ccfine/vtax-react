
/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:35
 * description  :
 */

import React from 'react'
import {Route, Redirect, Link} from 'react-router-dom'
import { getLookPermissible } from 'config/routingAuthority.config';
import PermissibleRender from 'compoments/permissible/PermissibleRender.r';
import Exception from 'compoments/exception';

const NotAllowedComponent = (
    <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);

const RestrictedComponent =(route) =>(
    <Route path={route.path} render={props =>
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes}/>
    }/>
);

const RouteWithSubRoutes = (route) => {
    if(route.redirect){
        return <Redirect from={route.from} to={route.to}/>
    }else{
        //TODO：前提条件 -- 判断是否有查看权限，如果没有就直接重定向到403页面
        if(route.authorityInfo){
            return <PermissibleRender
                        userPermissions={route.authorityInfo}
                        requiredPermissions={getLookPermissible}
                        renderOtherwise={NotAllowedComponent}
                    >
                        {
                            RestrictedComponent(route)
                        }
                    </PermissibleRender>

        }else{
            return RestrictedComponent(route)
        }
    }
}

export default RouteWithSubRoutes