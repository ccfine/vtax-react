/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from './routes'

export default class Business extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}