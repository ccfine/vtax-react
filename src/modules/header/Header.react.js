/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:21
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Menu,Row,Col,Avatar,Icon,Modal} from 'antd'
import {withRouter,Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Message from './Message.react'
import SelectSearch from './SelectSearch.react'

import './header.less'

const { Header} = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;


class WimsHeader extends Component {

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        },()=>{
            this.props.changeCollapsed(this.state.collapsed);
            setTimeout(()=>{
                this.onResize();
            },300)
        });
    }

    onResize=()=>{
        // 创建事件
        let event = document.createEvent('Event');
        // 定义事件名为'build'.
        event.initEvent('resize', true, true);
        // 触发对象可以是任何元素或其他事件目标
        document.dispatchEvent(event);
    }

    handlerClick = ({item, key, keyPath})=>{
        if(key==='exit') {
            confirm({
                title: '系统提示',
                content: '确定要退出吗',
                onOk: () => this.props.logout(),
                onCancel() {
                },
            });
        }else if(key === 'admin') {
            this.props.history.push(`/${key}`)
        }else if(key === 'message'){
            return false
        }else{
            this.props.history.push(`/web/${key}`)
        }
    }
    componentDidMount(){

    }
    componentWillUnmount(){
    }

    render() {
        return (
            <Header className="vtax-custom-trigger" style={{ background: '#fff', padding: 0 }}>
                <Row>
                    <Col span={10}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Col>
                    <Col span={8}>
                        <SelectSearch />
                    </Col>
                    <Col span={6} style={{justifyContent:'flex-end'}}>
                        <Menu
                            theme="light"
                            mode="horizontal"
                            onClick={this.handlerClick}
                            defaultSelectedKeys={['bus']}
                            style={{ lineHeight: '64px' }}
                            className="vtax-menu-root vtax-menu-right"
                        >
                            <Menu.Item key="message">
                                <Message />
                            </Menu.Item>
                            <SubMenu
                                title={
                                    <span>
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ verticalAlign:'middle',marginRight:'10px' }} />
                                        { this.props.realName }
                                    </span>}>
                                <Menu.Item key="admin">
                                    <span>
                                        <Icon type="user" />
                                        个人资料
                                    </span>
                                </Menu.Item>
                                <Menu.Item key="exit" >
                                    <Icon type="poweroff" />退出
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default withRouter(connect(state=>{
    return {
        realName:state.user.getIn(['personal','realname'])
    }
})(WimsHeader))