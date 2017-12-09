/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import { Layout,Carousel,Row,Col,Icon} from 'antd'
import {Link} from 'react-router-dom'
import banner1 from './images/banner1.png'
import banner2 from './images/banner2.png'
import './styles.less'

class AccountManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTime:false,
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
                    src:require('./images/banner1.png')

                },{
                    alt:'banner2',
                    src:require('./images/banner2.png')
                }]
        }
    }

    renderSubNavNodes = data => {
        return data.map((item,i) => {
            return (
                <Col span={24} key={i} className="sub-nav-col">
                    <Icon type="caret-right" style={{marginRight:10}} />
                    <Link to={item.subUrl}>{item.subTitle}</Link>
                </Col>
            );
        });
    }

    componentDidMount(){
        this.timer = setTimeout(()=>{
            this.setState({
               isTime: true
           })
        },0)
    }

    //mount=true
    componentWillUnmount(){
        //this.mount=null;
        clearTimeout(this.timer)
    }


    render() {
        const settings = {
            autoplay: true,
            autoplaySpeed: 5000,
        };
        return (
            <Layout style={{background:'transparent'}} >

                {
                    this.state.isTime && <div className='container'>
                        <Carousel {...settings}>
                            <div>
                                <img width='100%' src={banner1} alt="banner1" style={{width: '100%'}} />
                            </div>
                            <div>
                                <img width='100%' src={banner2} alt="banner2" style={{width: '100%'}} />
                            </div>
                        </Carousel>
                    </div>
                }
                <Row gutter={16} style={{padding: '40px 0'}}>
                    {
                        this.state.nav.map((item,i)=>(
                            <Col span={8} key={i}>
                                <div className="sub-nav-title" style={{marginBottom:20,backgroundColor: item.bgColor}}>
                                    {item.title}
                                </div>
                                <Row className="sub-nav-row">
                                    {
                                        this.renderSubNavNodes(item.subNav)
                                    }
                                </Row>

                            </Col>
                        ))
                    }

                </Row>

            </Layout>
        )
    }
}
export default AccountManage