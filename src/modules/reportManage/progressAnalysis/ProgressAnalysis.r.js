/**
 * Created by liuliyuan on 2018/11/15.
 */
import React, { Component } from 'react'
import {NavRouter} from 'compoments'
import routes from './routes'

export default class ProgressAnalysis extends Component {
    render() {
        return (
            <NavRouter data={routes} />
        )
    }
}