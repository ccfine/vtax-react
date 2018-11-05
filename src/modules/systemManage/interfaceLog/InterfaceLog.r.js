/**
 * Created by liuliyuan on 2018/11/5.
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from './routes'

export default class InterfaceLog extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}