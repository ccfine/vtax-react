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
            data: [
                {
                    title: '售房预缴台账',
                    icon: '',
                }, {
                    title: '预缴税款台账',
                    icon: '',
                }, {
                    title: '土地价款扣除明细台账',
                    icon: '',
                }, {
                    title: '扣除项目税款台账',
                    icon: '',
                }, {
                    title: '减免税明细台账',
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
export default OtherAccount