/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 16:21
 * description  : TODO: 可以按需引入的模块列表见 https://github.com/ecomfe/echarts/blob/master/index.js
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import LoadAble from 'react-loadable'
import {withRouter,Link} from 'react-router-dom'
import {LoadingPage} from 'compoments'
import { Layout, Card, Col, Row } from 'antd'
import { getTowOptions } from 'config/routingAuthority.config'
import checkPermissions from 'compoments/permissible/index'
import banner1 from './images/banner1.jpg'
import banner2 from './images/banner2.jpg'
import "react-image-gallery/styles/css/image-gallery.css";
import './index.less'

const authorityInfo = getTowOptions('taxDeclare','declareHandle');
const AsyncImageGallery = LoadAble({
    loader: () => import('react-image-gallery'), //k线图组件
    loading: LoadingPage,
});
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner : [],
        }
    }

    componentDidMount() {
        this.mounted && this.setState({
            banner:[{
                key:'1',
                original: banner1,
            },{
                key:'2',
                original: banner2,
            }]
        })
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    render() {

        const Info = ({ title, value, bordered }) => (
            <div className='headerInfo'>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em />}
            </div>
        );

        let isShow = true;
        if(parseInt(this.props.type, 0) === 1){
            isShow = !!checkPermissions(authorityInfo, this.props.options)
        }

        return (
            <Layout style={{background:'transparent'}} >
                 <AsyncImageGallery
                    key={new Date()}
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
                {
                    isShow  &&  <div style={{ padding: '24px 0'}}>
                        <Card bordered={false} style={{ padding:'24px 32px' }}>
                            <Row>
                                <Col sm={24} xs={24}>
                                    <Link
                                        title="我的待办"
                                        to='web/taxDeclare/declareHandle'
                                    >
                                        <Info title="我的待办" value="申报办理" />
                                    </Link>

                                </Col>
                                {/*<Col sm={8} xs={24}>
                                 <Info title="本周任务平均处理时间" value="32分钟" bordered />
                                 </Col>
                                 <Col sm={8} xs={24}>
                                 <Info title="本周完成任务数" value="24个任务" />
                                 </Col>*/}
                            </Row>
                        </Card>
                    </div>
                }


            </Layout>
        )
    }
}
export default withRouter(connect(state=>({
    options:state.user.getIn(['personal','options']),
    type:state.user.getIn(['personal','type']),
}))(Home))