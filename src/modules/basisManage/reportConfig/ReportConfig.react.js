/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {Layout} from 'antd'
import {Nav} from '../../../compoments/index'
import routes from '../../basisManage/reportConfig/routes'

class ReportConfig extends Component {
    render() {
        return (
            <Layout style={{background: 'transparent'}}>
                <div style={{padding: 24}}>
                    <Nav data={routes}/>
                </div>
            </Layout>
        )
    }
}
export default ReportConfig