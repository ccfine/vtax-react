/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from '../../compoments'
import routes from './children/routes'

class TaxDeclare extends Component {

    render() {

        return (
            <NavRouter data={routes} />
        )
    }
}
export default TaxDeclare
