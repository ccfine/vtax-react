/**
 * author       : liuliyuan
 * createTime   : 2017/12/18 15:17
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../../compoments'
import routes from '../../systemManage/systemMaintain/routes'

class SystemMaintain extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}
export default SystemMaintain