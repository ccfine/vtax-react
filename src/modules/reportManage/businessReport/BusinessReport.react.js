/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from '../../reportManage/businessReport/routes'

class BusinessReport extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}
export default BusinessReport