/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from '../../vatManage/landPrice/routes'

class LandPrice extends Component {
    render() {

        return (
            <NavRouter data={routes} />
        )

    }
}
export default LandPrice