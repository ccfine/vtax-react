/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import { Layout} from 'antd'
import {Nav} from '../../../compoments/index'

class SalesTaxAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [
                {
                    title: '开票销售台账',
                    href:'',
                    icon:'',
                },{
                    title: '未开票销售台账',
                    icon:'',
                },{
                    title: '其他涉税调整台账',
                    icon:'',
                },{
                    title: '销项税台账',
                    icon:'',
                }
            ]
        }
    }

    render() {

        return (
            <Layout style={{background:'transparent'}} >
                <div style={{ padding: 24}}>
                    <Nav data={this.state.data} />
                </div>
            </Layout>
        )
    }
}
export default SalesTaxAccount