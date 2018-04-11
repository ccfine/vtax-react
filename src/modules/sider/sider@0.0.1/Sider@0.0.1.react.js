/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:17
 * description  : TODO: 实现三级导航全部在左侧
 */
import React, { Component } from 'react';
import { Layout, Menu,Icon} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import logo from '../images/logo.png'
import '../styles.less'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
class VTaxSider extends Component {

    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            selectedPath:props.history.location.pathname,
            openKeys: [],
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

            if (!item.name  || item.path === '/web' ) {
                return null;
            }

            if (item.children && item.children.some(child => child.name)) {
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
                        {
                            item.children.map((child)=>{

                                if(child.children){
                                    return (
                                        <SubMenu key={child.key || child.path} title={child.name}>
                                            {this.getNavMenuItems(child.children)}
                                        </SubMenu>
                                    )
                                }else{
                                    return !child.to && this.getMenuItem(child)

                                }


                            })
                        }

                    </SubMenu>
                );
            }
            return this.getMenuItem(item)
        });
    }

    getMenuItem=(item)=>{
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
        )
    }

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.props.menusData.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    handleClick = (e) => {
        this.setState({
            selectedPath: e.key,
        });
    }

    componentWillReceiveProps(nextProps){
        let path = nextProps.history.location.pathname,
            openKeys = [`/${path.split(/\//)[1]}`],
            url_two = path.split(/\//)[2],
            url_three = path.split(/\//)[3];

        if(nextProps.collapsed){
            this.setState({
                openKeys:[]
            });
        }else{
            if(url_two){
                openKeys=[`${openKeys}/${url_two}`]
            }
            if(url_three){
                openKeys =[...openKeys,`${openKeys}/${url_three}`]
            }
            this.setState({
                openKeys,
                selectedPath:path,
            });
        }
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
                        {/*<h1>碧桂园增值税管理系统</h1>*/}
                    </Link>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={this.handleClick}
                    onOpenChange={this.onOpenChange}
                    selectedKeys={[this.state.selectedPath]}
                    openKeys={this.state.openKeys}
                    style={{ marginTop: '16px', width: '100%' }}
                >
                    {
                        this.getNavMenuItems(this.props.menusData)
                    }
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(VTaxSider)