/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import { Layout} from 'antd'
import {Carousel,Nav} from '../home'
import banner1 from './images/banner1.png'
import banner2 from './images/banner2.png'

class AccountManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav:[
                {
                    title: '销项税台账',
                    bgColor:'#f56a00',
                    subNav: [{
                        subTitle: '开票销售台账',
                        subUrl: '',
                    }, {
                        subTitle: '未开票销售台账',
                        subUrl: '',
                    }, {
                        subTitle: '其他涉税调整台账',
                        subUrl: '',
                    }]
                },{
                    title:'进项税台账',
                    bgColor:'#7265e6',
                    subNav:[{
                        subTitle: '进项税额明细台账',
                        subUrl: '',
                    },{
                        subTitle:'进项税额结构台账',
                        subUrl:'',
                    },{
                        subTitle:'固定资产进项税额台账',
                        subUrl:'',
                    },{
                        subTitle:'跨期合同进项税额转出台账',
                        subUrl:'',
                    },{
                        subTitle:'其他业务进项税额转出台账',
                        subUrl:'',
                    }]
                },{
                    title:'其他台账',
                    bgColor:'#ffbf00',
                    subNav:[{
                        subTitle: '售房预缴台账',
                        subUrl: '',
                    },{
                        subTitle:'预缴税款台账',
                        subUrl:'',
                    },{
                        subTitle:'土地价款扣除明细台账',
                        subUrl:'',
                    },{
                        subTitle:'扣除项目税款台账',
                        subUrl:'',
                    },{
                        subTitle:'减免税明细台账',
                        subUrl:'',
                    }]
                }
            ],
            banner:[{
                alt:'banner1',
                src:banner1

            },{
                alt:'banner2',
                src:banner2
            }]
        }
    }

    render() {

        return (
            <Layout style={{background:'transparent'}} >
                <Carousel banner={this.state.banner} />
                <Nav nav={this.state.nav} />
            </Layout>
        )
    }
}
export default AccountManage