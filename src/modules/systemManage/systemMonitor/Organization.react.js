/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from '../../systemManage/systemMonitor/routes'

class Organization extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}
export default Organization