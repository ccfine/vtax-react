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
import _ from 'lodash'
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
        let path = nextProps.history.location.pathname;
        this.setState({
            selectedPath:path
        })
        let pathArr = path.split('/');
        let start = _.startsWith(path,'/')?1:0;

        /* 展开项设置 */
        /* 如果Sider处于收起的状态，不用打开 ，并手动关上*/
        if(!nextProps.collapsed && pathArr.length>1+start){
            this.setState({
                openKeys: [`/${pathArr[start]}/${pathArr[start+1]}`],
            });
        }else{
            this.setState({
                openKeys: [],
            });
        }

        /* 选中项设置 */
        if(pathArr.length>2+start){
            this.setState({
                selectedPath: `/${pathArr[start]}/${pathArr[start+1]}/${pathArr[start+2]}`,
            });
        }
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = _.find(openKeys,(path)=>this.state.openKeys.indexOf(path) === -1);
        if(_.findIndex(this.props.menusData,(ele)=>ele.path === latestOpenKey) === -1){
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
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
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.selectedPath]}
                    onOpenChange={this.onOpenChange}
                    openKeys={this.state.openKeys}
                    style={{ margin: '16px 0', width: '100%' }}
                >
                    {this.getNavMenuItems(this.props.menusData)}
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(VTaxSider)