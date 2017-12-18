/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 16:21
 * description  :
 */
import React, { Component } from 'react'
import { Layout, Card, Col, Row,Icon,Menu, Dropdown } from 'antd'
import G2 from '@antv/g2'
import { DataSet } from '@antv/data-set'
import {Carousel} from '../../compoments'

import banner1 from './images/banner1.png'
import banner2 from './images/banner2.png'

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
            banner: [{
                original: banner1,
            },{
                original: banner2,
            }]
        }
    }

    init=()=>{
        const { DataView } = DataSet;
        const data = [
            { item: '事例一', count: 40 },
            { item: '事例二', count: 21 },
            { item: '事例三', count: 17 },
            { item: '事例四', count: 13 },
            { item: '事例五', count: 9 }
        ];
        const dv = new DataView();
        dv.source(data).transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
        });
        const chart = new G2.Chart({
            container: this.refs.example,
            forceFit: true,
            height: window.innerHeight,
        });
        chart.source(dv, {
            percent: {
                formatter: val => {
                    val = (val * 100) + '%';
                    return val;
                }
            }
        });
        chart.coord('theta', {
            radius: 0.75
        });
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        chart.intervalStack()
            .position('percent')
            .color('item')
            .label('percent', {
                formatter: (val, item) => {
                    return item.point.item + ': ' + val;
                }
            })
            .tooltip('item*percent', (item, percent) => {
                percent = percent * 100 + '%';
                return {
                    name: item,
                    value: percent
                };
            })
            .style({
                lineWidth: 1,
                stroke: '#fff'
            });
        chart.render();
    }

    componentDidMount(){
        setTimeout(()=>{
            this.init();
        },200)
    }

    componentWillMount(){

    }
    componentWillReceiveProps(nextProps){

    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="/">1st menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="/">2nd menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="/">3rd menu item</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Layout style={{background:'transparent'}} >
                <Carousel banner={this.state.banner} />

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
                                申报管理
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
                                title="本年同比纳税趋势图"
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
                                Card content
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title="本年累计已缴税金分布图"
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
                                <div ref="example"> </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </Layout>
        )
    }
}
export default Home