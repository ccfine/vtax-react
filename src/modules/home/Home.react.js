/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 16:21
 * description  : TODO: 可以按需引入的模块列表见 https://github.com/ecomfe/echarts/blob/master/index.js
 */
import React, { Component } from 'react'
import LoadAble from 'react-loadable'
import {LoadingPage} from 'compoments'
import { Layout, Card, Col, Row,Menu,Icon,Dropdown } from 'antd'
/*import ImageGallery from 'react-image-gallery';*/
import { pieOption, barOption, lineOption, scatterOption, mapOption, radarOption, candlestickOption } from './optionConfig/options'

import banner1 from './images/banner1.jpg'
import banner2 from './images/banner2.jpg'
import "react-image-gallery/styles/css/image-gallery.css";


const AsyncPieReact = LoadAble({
    loader: () => import('./echartsTest/PieReact'),//饼图组件
    loading: LoadingPage,
});
const AsyncBarReact = LoadAble({
    loader: () => import('./echartsTest/BarReact'),//柱状图组件
    loading: LoadingPage,
});
const AsyncLineReact = LoadAble({
    loader: () => import('./echartsTest/LineReact'),//折线图组件
    loading: LoadingPage,
});
const AsyncScatterReact = LoadAble({
    loader: () => import('./echartsTest/ScatterReact'),//散点图组件
    loading: LoadingPage,
});
const AsyncMapReact = LoadAble({
    loader: () => import('./echartsTest/MapReact'),//地图组件
    loading: LoadingPage,
});
const AsyncRadarReact = LoadAble({
    loader: () => import('./echartsTest/RadarReact'),//雷达图组件
    loading: LoadingPage,
});
const AsyncCandlestickReact = LoadAble({
    loader: () => import('./echartsTest/CandlestickReact'), //k线图组件
    loading: LoadingPage,
});
const AsyncImageGallery = LoadAble({
    loader: () => import('react-image-gallery'), //k线图组件
    loading: LoadingPage,
});
class Home extends Component {
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
            banner : [{
                key:'1',
                original: banner1,
            },{
                key:'2',
                original: banner2,
            }]
        }
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="###">1st menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="###">2nd menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="###">3rd menu item</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <Layout style={{background:'transparent'}} >
                 <AsyncImageGallery
                        infinite={true}
                        autoPlay={true}
                        showBullets={true}
                        slideInterval={3000}
                        slideDuration={500}
                        lazyLoad={false}
                        showNav={false}
                        thumbnailPosition='bottom'
                        showFullscreenButton={false}
                        useBrowserFullscreen={false}
                        showPlayButton={false}
                        useTranslate3D={false}
                        showThumbnails={false}
                        items={this.state.banner}
                    />
                <div style={{ padding: '24px'}}>
                    <Row gutter={16} style={{marginBottom:20}}>
                        <Col span={8}>
                            <Card
                                bordered={true}
                                style={{textAlign:'center'}}
                            >
                                待办申报    2
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                bordered={true}
                                style={{textAlign:'center'}}
                            >
                                发票查询
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                bordered={true}
                                style={{textAlign:'center'}}
                            >
                                发票查询
                            </Card>
                        </Col>
                    </Row>

                   <Row gutter={16}>
                        <Col span={12}>
                            <Card
                                title="饼图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncPieReact option={pieOption} />
                            </Card>
                            <br/>
                            <Card
                                title="柱状图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncBarReact option={barOption} />
                            </Card>
                            <br/>
                            <Card
                                title="折线图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncLineReact option={lineOption} />
                            </Card>
                            <br/>
                            <Card
                                title="k线图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncCandlestickReact option={candlestickOption} />
                            </Card>


                        </Col>
                        <Col span={12}>

                            <Card
                                title="散点图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncScatterReact option={scatterOption} />
                            </Card>
                            <br/>
                            <Card
                                title="地图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncMapReact option={mapOption} height="558px" />
                            </Card>
                            <br/>
                            <Card
                                title="雷达图"
                                bordered={true}
                                type="inner"
                                extra={
                                    <Dropdown overlay={menu} placement="bottomRight">
                                        <a className="ant-dropdown-link" href="/">
                                            <Icon type="ellipsis" />
                                        </a>
                                    </Dropdown>
                                }
                            >
                                <AsyncRadarReact option={radarOption} />
                            </Card>

                        </Col>
                    </Row>
                </div>

            </Layout>
        )
    }
}
export default Home