/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:11
 * description  :
 */
import React, { Component } from 'react'
import {Row,Col,Icon} from 'antd'
import {Link} from 'react-router-dom'
import './styles.less'

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav:props.nav
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

    render() {
        console.log(parseInt((24/this.state.nav.length),0))
        return (
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
        )
    }
}

export default Nav