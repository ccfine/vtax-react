/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../../compoments'
import routes from '../../vatManage/salesManag/routes'

class SalesManag extends Component {
    render() {

        return (
            <NavRouter data={routes} />
        )

    }
}
export default SalesManag