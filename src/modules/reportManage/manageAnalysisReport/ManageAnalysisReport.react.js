/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from '../../reportManage/manageAnalysisReport/routes'

class ManageAnalysisReport extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}
export default ManageAnalysisReport