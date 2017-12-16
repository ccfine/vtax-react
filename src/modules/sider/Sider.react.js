/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:17
 * description  :
 */
import React, { Component } from 'react';
import { Layout, Menu,Icon} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import logo from './images/logo.png'
import './styles.less'

const { Sider } = Layout;
const { SubMenu } = Menu;

class VTaxSider extends Component {

    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            selectedPath:props.history.location.pathname,
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    getNavMenuItems=(menusData)=>{
        if (!menusData) {
            return [];
        }
        return menusData.map((item) => {

            if (!item.name || item.to || item.path === '/web' ) {
                return null;
            }

            if (item.permissions && item.children && item.children.some(child => child.name)) {
                return (
                    <SubMenu
                        title={
                            item.icon ? (
                                <span>
                              <Icon type={item.icon} />
                              <span>{item.name}</span>
                            </span>
                            ) : item.name
                        }
                        key={item.key || item.path}
                    >
                        {this.getNavMenuItems(item.children)}
                    </SubMenu>
                );
            }

            const icon = item.icon && <Icon type={item.icon} />;
            return (
                <Menu.Item key={item.key || item.path}>
                    <Link
                        to={item.path}
                        target={item.target}
                        replace={item.path === this.props.location.pathname}
                    >
                        {icon}<span>{item.name}</span>
                    </Link>
                </Menu.Item>
            );


        });
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selectedPath:nextProps.history.location.pathname
        })
    }

    render() {

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                className="vtax-custom-trigger"
            >
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>喜盈佳纳税申报平台</h1>
                    </Link>
                </div>
                <Menu
                    id="clickTrigger"
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.selectedPath]}
                    style={{ margin: '16px 0', width: '100%' }}
                >
                    {this.getNavMenuItems(this.props.menusData)}
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(VTaxSider)