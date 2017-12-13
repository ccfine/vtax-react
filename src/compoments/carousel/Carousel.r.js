/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:09
 * description  :
 */
import React, { Component } from 'react'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import './styles.less'

class VTaxCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images:props.banner
        }
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }


    render() {
        const setting = {
            infinite:true,
            autoPlay:true,
            showBullets:true,
            slideInterval:3000,
            slideDuration:500,
            lazyLoad:false,
            showNav:false,
            thumbnailPosition:'bottom',
            showFullscreenButton:false,
            useBrowserFullscreen:false,
            showPlayButton:false,
            useTranslate3D:false,
            showThumbnails:false,
        }


        return (
            <div>
                <ImageGallery {...setting} items={this.state.images} />
            </div>
        )
    }
}

export default VTaxCarousel