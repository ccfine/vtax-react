/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {Layout} from 'antd'
import {Nav} from '../../../compoments/index'

class EntryTaxAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    title: '进项税额明细台账',
                    icon: '',
                }, {
                    title: '进项税额结构台账',
                    icon: '',
                }, {
                    title: '固定资产进项税额台账',
                    icon: '',
                }, {
                    title: '跨期合同进项税额转出台账',
                    icon: '',
                }, {
                    title: '其他业务进项税额转出台账',
                    icon: '',
                }
            ]
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
export default EntryTaxAccount