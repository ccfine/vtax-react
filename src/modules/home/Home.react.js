/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 16:21
 * description  : TODO: 可以按需引入的模块列表见 https://github.com/ecomfe/echarts/blob/master/index.js
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
// import LoadAble from 'react-loadable'
import {withRouter} from 'react-router-dom'
//import {LoadingPage} from 'compoments'
import { Layout, Card} from 'antd'
import { getTowOptions } from 'config/routingAuthority.config'
import checkPermissions from 'compoments/permissible/index'
// import ImageGallery from 'react-image-gallery'
import DeclareHandle from 'modules/taxDeclare/declareHandle'
import HomeMessage from './homeMessage'
// import banner1 from './images/banner1.jpg'
// import banner2 from './images/banner2.jpg'
import "react-image-gallery/styles/css/image-gallery.css";
import './index.less'

const authorityInfo = getTowOptions('taxDeclare','declareHandle');
/*const AsyncImageGallery = LoadAble({
    loader: () => import('react-image-gallery'), //k线图组件
    loading: LoadingPage,
});

const AsyncDeclareHandle = LoadAble({
    loader: () => import('modules/taxDeclare/declareHandle'),
    loading: LoadingPage,
});*/

class Home extends Component {

    state = {
        declareKey: Date.now(),
        newOrgId : undefined,
    }

    /*constructor(props) {
        super(props);
        this.state = {

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
    }*/

    render() {

        // const banner = [{
        //     key:'1',
        //     original: banner1,
        // },{
        //     key:'2',
        //     original: banner2,
        // }]
        let isShow = true;
        if(parseInt(this.props.type, 0) === 1){

            isShow = !!checkPermissions(authorityInfo, this.props.options)
        }

        return (
            <Layout style={{background:'transparent'}} >
                 {/* <ImageGallery
                    infinite={true}
                    autoPlay={true}
                    showBullets={true}
                    slideInterval={3000}
                    slideDuration={500}
                    lazyLoad={true}
                    showNav={false}
                    thumbnailPosition='bottom'
                    showFullscreenButton={false}
                    useBrowserFullscreen={false}
                    showPlayButton={false}
                    //useTranslate3D={false}  这个会影响水印抖动
                    showThumbnails={false}
                    items={banner}
                /> */}
                <HomeMessage />
                {
                    isShow && <div style={{ padding: '24px 0'}}>
                        <Card style={{ padding:'0' }}>
                            <DeclareHandle key={this.state.declareKey} title="待我办理的申报任务" />
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