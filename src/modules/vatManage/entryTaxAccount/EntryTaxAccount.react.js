/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../../compoments/index'
import routes from '../../vatManage/entryTaxAccount/routes'

class EntryTaxAccount extends Component {

    render() {

        return (
            <NavRouter data={routes} />
        )

    }
}
export default EntryTaxAccount