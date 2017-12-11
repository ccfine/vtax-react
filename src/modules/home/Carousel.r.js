/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:09
 * description  :
 */
import React, { Component } from 'react'
import {Carousel} from 'antd'
import {Link} from 'react-router-dom'
import './styles.less'

class VTaxCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTime:false,
            banner:props.banner
        }
    }

    componentDidMount(){
        this.timer = setTimeout(()=>{
            this.setState({
                isTime: true
            })
        },0)
    }

    componentWillUnmount(){
        clearTimeout(this.timer)
    }


    render() {
        const settings = {
            autoplay: true,
            autoplaySpeed: 5000,
        };
        return (
            <div>
                {
                    this.props.banner && this.state.isTime && <div className='container'>
                        <Carousel {...settings}>
                            {
                                this.state.banner.map((b,i)=>(
                                    <div key={i}>
                                        <img width='100%' src={b.src} alt={b.alt} style={{width: '100%'}} />
                                    </div>
                                ))
                            }
                        </Carousel>
                    </div>
                }
            </div>
        )
    }
}

export default VTaxCarousel