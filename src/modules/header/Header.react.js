/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:21
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Menu,Avatar,Icon,Modal,Dropdown,Row,Col,Tooltip} from 'antd'
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
    componentDidMount(){
        request.post('/oauth/loginOut').then(({data})=>{
            if(data.code === 200){
                this.setState({ssoPath:data.data})
            }
        }).catch(err=>{
        })
    }

    render() {
        const menu = (
            <Menu className='menu' selectedKeys={[]} onClick={this.handleMenuCollapse}>
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
                {/* <Menu.Divider />
                <Menu.Item key='admin'>
                    <Link to={`/web/systemManage/userPermissions/userManage/${this.props.orgId}~${this.props.id}`}>
                        <Icon type="user" />个人中心
                    </Link>
                </Menu.Item>
                <Menu.Item key="question">
                    <a  rel='noopener noreferrer' target='_blank' href='http://help.countrygarden.com.cn:9000/form.action?&type=VATTDS'><Icon type="question" />我要提问</a>
                </Menu.Item> */}
            </Menu>
        );

        return (
            <Header className="header">
                <Row>
                    <Col xs={0} sm={4} lg={6}>
                        <h2 style={{overflow:'hidden',whiteSpace:'nowrap'}}>
                            <Icon
                                className='trigger'
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            增值税纳税申报系统
                        </h2>
                    </Col>
                    {/*<Col xs={20} sm={16} lg={14}>

                    </Col>*/}
                    <Col xs={20} sm={16} lg={18}>
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

                            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                                <span className='action account'>
                                    <Avatar size="small" className='avatar' icon="user"  style={{ backgroundColor: '#87d068',color:'#fff'}} />
                                    {/*src={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}*/}
                                    <span className='name'>{(this.props.realName && this.props.realName) || '欢迎您'}</span>
                                </span>
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
        orgId: state.user.get("orgId"),
        // id: state.user.getIn(["personal",'id']),
    }
})(WimsHeader))