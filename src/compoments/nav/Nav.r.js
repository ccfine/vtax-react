/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:11
 * description  :
 */
import React, { Component } from 'react'
import {Row,Col,Icon} from 'antd'
import {Link} from 'react-router-dom'
import DescriptionList from '../descriptionList';
const { Description } = DescriptionList;

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
        return (
            <div style={{padding: '40px 0'}}>
                <DescriptionList size="large" col="3">
                    {
                        this.state.nav.map((item,i)=>(
                            <Description key={i}>
                                <div className="sub-nav-title" style={{marginBottom:20,backgroundColor: item.bgColor}}>
                                    {item.title}
                                </div>
                                <Row className="sub-nav-row">
                                    {
                                        this.renderSubNavNodes(item.subNav)
                                    }
                                </Row>
                            </Description>
                        ))
                    }

                </DescriptionList>
            </div>
        )
    }
}

export default Nav