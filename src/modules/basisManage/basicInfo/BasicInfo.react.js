/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../../compoments'
import routes from '../../basisManage/basicInfo/routes'

class BasicInfo extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}
export default BasicInfo