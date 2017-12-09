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

    render() {
        return (
            <Header className="header">
                <Row style={{maxWidth:1500,margin:'0 auto',padding:'0 20px'}}>
                    <Col span={12}>
                        <div style={{overflow:'hidden'}}>
                            <Link to="/web" className="logo">
                                <img src="" alt="logo" />
                                <h1>喜盈佳纳税申报平台</h1>
                            </Link>
                        </div>
                    </Col>
                    <Col span={6}>
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