/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import {Layout} from 'antd'
import {Nav} from '../../compoments'
import routes from './children/routes'

class TaxDeclare extends Component {

    render() {

        return (
            <Layout style={{background: 'transparent'}}>
                <div style={{padding: 24}}>
                    <Nav data={routes}/>
                </div>
            </Layout>
        )
    }
}
export default TaxDeclare


/*
import React, { Component } from 'react'
import {withRouter,Switch,Route} from 'react-router-dom';
import {RouteWithSubRoutes} from '../../compoments'
import {composeMenus} from '../../utils'
import routes from './children/routes'

class TaxDeclare extends Component {

    render() {

        return (
            <Switch>
                {
                    composeMenus(routes).map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route}/>
                    ))
                }
                <Route path="*" component={()=><div>no match</div>} />
            </Switch>
        )
    }
}
export default TaxDeclare*/
