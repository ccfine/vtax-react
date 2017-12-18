/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:09
 * description  :
 */
import React, { Component } from 'react'
import {Layout} from 'antd'
import {Nav} from '../../../compoments/index'

class OtherAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [ ]
        }
    }

    render() {

        return (
            <Layout style={{background: 'transparent'}}>
                <div style={{padding: 24}}>
                    <Nav data={this.state.data}/>
                </div>
            </Layout>
        )

    }
}
export default OtherAccount