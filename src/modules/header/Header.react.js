/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:21
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Menu,Avatar,Icon,Modal,Dropdown,Spin,message} from 'antd'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
//import Message from './Message.react'
import SelectSearch from './SelectSearch.react'

import './header.less'

const { Header} = Layout;
const confirm = Modal.confirm;

class WimsHeader extends Component {

    state = {
        collapsed: false,
        fetchingNotices:false,
        data:[],
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        },()=>{
            this.props.changeCollapsed(this.state.collapsed);
        });
    }
    handleMenuCollapse = ({ key })=>{
        if(key==='logout') {
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
        const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.handleMenuCollapse}>
                <Menu.Item key='admin' disabled>
                    <Icon type="user" />个人中心
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
            </Menu>
        );

        return (
            <Header className="header">
                <Icon
                    className='trigger'
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div style={{display: 'inline-block'}}>
                    <h1>碧桂园纳税申报系统</h1>
                </div>
                <div className='right'>

                    <div style={{float: 'left',width: '328px',padding:'0 12px'}}>
                        {this.props.isAuthed && <SelectSearch changeRefresh={this.props.changeRefresh.bind(this)} />}
                    </div>

                    {/*<Message />*/}


                    {this.props.userName ? (
                        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                          <span className='action account'>
                            <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                              {/*src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}*/}
                              <span className='name'>{this.props.userName}</span>
                          </span>
                        </Dropdown>
                    ) : (
                        <Spin size="small" style={{ marginLeft: 8 }} />
                    )}
                </div>
            </Header>
        )
    }
}

export default withRouter(connect(state=>{
    return {
        isAuthed:state.user.get('isAuthed'),
        userName:state.user.getIn(['personal','username'])  //'secUserBasicBO',
    }
})(WimsHeader))