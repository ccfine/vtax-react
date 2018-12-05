/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:21
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Menu,Avatar,Icon,Modal,Dropdown,Row,Col,Tooltip,Badge} from 'antd'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
//import Message from './Message.react'
import SelectSearch from './SelectSearch.react'
import {request} from 'utils';

import './header.less'

const { Header} = Layout;

class WimsHeader extends Component {

    state = {
        collapsed: false,
        fetchingNotices:false,
        data:[],
        ssoPath:'',
        developVersionName:'',
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        },()=>{
            this.props.changeCollapsed(this.state.collapsed);
        });
    }

    handleMenuCollapse = ({ key })=>{
        const {ssoPath} = this.state;
        if(key==='logout') {
            const modalRef = Modal.confirm({
                title: '系统提示',
                content: '确定要退出吗？',
                //okText:<a rel='noopener noreferrer' target='_self' href={ssoPath}>确定</a>,
                onOk:()=>{
                    modalRef && modalRef.destroy();
                    this.props.logout();
                    setTimeout(()=>{
                        window.location.href=`${ssoPath}`;
                    },200)
                },
                onCancel() {
                    modalRef.destroy()
                },
            });
        }else if(key === 'admin') {
            return false
        }else if(key === 'question'){
            return false
        }else{
            this.props.history.push(`/web/${key}`)
        }
    }
    handleMessageMenu = ({ key }) => {
        this.props.history.push(`/web/${key}`)
    }
    componentDidMount(){
        this.props.isAuthed && request.post('/oauth/loadParameter').then(({data})=>{
            if(data.code === 200){
                const result = data.data;
                this.mounted && this.setState({
                    ssoPath:result.bipPath,
                    developVersionName:result.developVersionName,

                })
            }
        }).catch(err=>{
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render() {
        const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.handleMenuCollapse}>
                {/* <Menu.Item key='admin'>
                    <Link to={`/help`} target='_blank'>
                        <Icon type="info-circle-o" />帮助中心
                    </Link>
                </Menu.Item> 
                <Menu.Divider />*/}
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
                {/* <Menu.Item key="question">
                    <a  rel='noopener noreferrer' target='_blank' href='http://help.countrygarden.com.cn:9000/form.action?&type=VATTDS'><Icon type="question" />我要提问</a>
                </Menu.Item> */}
            </Menu>
        );
        const messageMenu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.handleMessageMenu}>
                <Menu.Item key="adminMessage">管理员消息中心</Menu.Item>
                <Menu.Item key="message">消息中心</Menu.Item>
            </Menu>
        );
        return (
            <Header className="header">
                <Row>
                    <Col xs={2} sm={4} lg={8}>
                        <h2 style={{overflow:'hidden',whiteSpace:'nowrap'}}>
                            <Icon
                                className='trigger'
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            增值税纳税申报系统 {this.state.developVersionName && <span style={{color:'red',fontSize:'14px',paddingLeft:10}}>{this.state.developVersionName}</span>}
                        </h2>
                    </Col>
                    {/*<Col xs={20} sm={16} lg={14}>

                    </Col>*/}
                    <Col xs={20} sm={16} lg={16}>
                        <div className='right'>
                            <span className='action search' style={{float:'left'}}>
                                {this.props.isAuthed && <SelectSearch changeRefresh={this.props.changeRefresh.bind(this)} />}
                            </span>

                            <Tooltip placement="bottom" title='我要提问'>
                                <a className='action'
                                   rel='noopener noreferrer' target='_blank' href='http://help.countrygarden.com.cn:9000/form.action?&type=VATTDS'>
                                    <Icon type="question-circle-o" />
                                </a>
                            </Tooltip>
                            {
                                parseInt(this.props.type, 0) === 1 ? (
                                    <Tooltip placement="bottom" title='消息'>
                                        <a className='action'
                                        rel='noopener noreferrer' target='_blank' href='/web/message'>
                                            <Badge count={this.props.noticeNum}>
                                                <div style={{position:"relative",top:2}}>
                                                    <Icon type='bell' style={{fontSize:16,padding:4}} />
                                                </div>
                                            </Badge>
                                        </a>
                                    </Tooltip>
                                ) : (
                                    <Dropdown overlay={messageMenu} placement="bottomRight" trigger={['click']}>
                                        <a className="action" href="javascript();">
                                        <Badge count={this.props.noticeNum}>
                                                <Icon type='bell' style={{fontSize:16,padding:4}} />
                                        </Badge>
                                        </a>
                                    </Dropdown>
                                )
                            }

                            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                                {
                                    <Tooltip placement="left" title={this.props.realName && this.props.realName}>
                                        <span className='action account'>
                                            <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                                            {/* <span className='name'>{(`${this.props.realName && this.props.realName.substr(0,8)}...`) || '欢迎您'}</span> */}
                                        </span>
                                    </Tooltip>
                                }
                            </Dropdown>

                            {/*{this.props.realName ? (
                                <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                                <span className='action account'>
                                    <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                                    src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                                    <span className='name'>{this.props.realName}</span>
                                </span>
                                </Dropdown>
                            ) : (
                                <Spin size="small" style={{ marginLeft: 8 }} />
                            )}*/}
                        </div>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default withRouter(connect(state=>{
    return {
        isAuthed:state.user.get('isAuthed'),
        realName:state.user.getIn(['personal','realname']),  //'secUserBasicBO',
        org: state.user.get("org"),
        type: state.user.getIn(['personal','type']),
        noticeNum:state.user.get('noticeNum'),
        // id: state.user.getIn(["personal",'id']),
    }
})(WimsHeader))