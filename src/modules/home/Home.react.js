/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 16:21
 * description  : TODO: 可以按需引入的模块列表见 https://github.com/ecomfe/echarts/blob/master/index.js
 */
import React, { Component } from 'react'
import LoadAble from 'react-loadable'
import {LoadingPage} from 'compoments'
import { Layout, Card, Col, Row } from 'antd'
import banner1 from './images/banner1.jpg'
import banner2 from './images/banner2.jpg'
import "react-image-gallery/styles/css/image-gallery.css";
import './index.less'

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

        const Info = ({ title, value, bordered }) => (
            <div className='headerInfo'>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em />}
            </div>
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
                <div style={{ padding: '24px 0'}}>
                    <Card bordered={false} style={{ padding:'24px 32px' }}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title="我的待办" value="8个任务" bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="本周任务平均处理时间" value="32分钟" bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="本周完成任务数" value="24个任务" />
                            </Col>
                        </Row>
                    </Card>
                </div>

            </Layout>
        )
    }
}
export default Home