/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../../compoments/index'
import routes from './routes'

class SalesTaxAccount extends Component {

    render() {

        return (
            <NavRouter data={routes} />
        )
    }
}
export default SalesTaxAccount