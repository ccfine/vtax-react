/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:21
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Menu,Avatar,Icon,Modal} from 'antd'
import {withRouter} from 'react-router-dom'
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
        });
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
            <Header className="vtax-header-trigger" style={{ background: '#fff', padding: 0 }}>
                <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div style={{float:'right'}}>
                    <div style={{float:'right'}}>
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
                                        { this.props.userName }
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
                    </div>
                    <div className="set-search-width">
                        <SelectSearch changeRefresh={this.props.changeRefresh.bind(this)} />
                    </div>
                </div>


                {/*<Row>
                    <Col span={8}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Col>
                    <Col span={8}>
                        <SelectSearch />
                    </Col>
                    <Col span={8} style={{justifyContent:'flex-end'}}>
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
                </Row>*/}
            </Header>
        )
    }
}

export default withRouter(connect(state=>{
    return {
        userName:state.user.getIn(['personal','username'])
    }
})(WimsHeader))