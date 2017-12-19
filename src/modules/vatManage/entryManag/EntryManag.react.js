/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {Layout} from 'antd'
import {Nav} from '../../../compoments'
import routes from '../../vatManage/entryManag/routes'

class EntryManag extends Component {

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
export default EntryManag