/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:17
 * description  :
 */
import React, { Component } from 'react';
import { Layout, Menu,Icon} from 'antd';
import {withRouter,Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import checkPermissions from 'compoments/permissible/index'
/*import intersection from 'lodash/intersection'; //取数组的交集 _.initial([1, 2, 3]); => [1, 2]*/
import {saveDeclare} from 'redux/ducks/user'
import {menuPermissions} from 'config/routingAuthority.config'

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
            if (!item.name  || item.path === '/web'|| item.isProd) {
                return null;
            }
            //系统管理员 ： 8192  如果是管理员用户直接给系统管理员权限
            if(parseInt(this.props.type, 0) !== 8192 && item.name === '系统管理'){
                return null;
            }

            //菜单权限  纳税申报-'1005000'  增值税管理-'1005001'  报表管理-'1005002'
            if(this.props.options && this.props.options.length > -1 && parseInt(this.props.type, 0) !== 8192){

                menuPermissions.forEach((t,i)=>{
                    switch (i) {
                        case 0:
                            if(this.props.options.indexOf(t) < 0 && item.name === '纳税申报'){
                                return null
                            }
                            break;
                        case 1:
                            if(this.props.options.indexOf(t) < 0 && item.name === '增值税管理'){
                                return null
                            }
                            break;
                        case 2:
                            if(this.props.options.indexOf(t) < 0 && item.name === '报表管理'){
                                return null
                            }
                            break;
                        default:
                            break;
                    }
                })
            }
            if (item.permissions && item.children && item.children.some(child => child.name)) {
                const componentSbu = (
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
                )

                //当权限是普通用户的时候直接放行  普通用户： 1
                if(parseInt(this.props.type, 0) ===1){
                    return checkPermissions(item.authorityInfo, this.props.options) &&  componentSbu
                }
                return componentSbu
            }

            const icon = item.icon && <Icon type={item.icon} />;

            const componentParent = (
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

            //当权限是管理员的时候直接放行
            if(parseInt(this.props.type, 0) ===1){
                return checkPermissions(item.authorityInfo, this.props.options) &&  componentParent
            }
            return  componentParent

        });
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (openKeys.indexOf(latestOpenKey) === -1) {
            this.setState({
                openKeys
            });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    handleClick = (e) => {
        //设置saveDeclare默认为初始值 为了判断看用户是从纳税申报进还是路由
        const { saveDeclare } = this.props;
        saveDeclare(null)
        //const { saveDeclare, options } = this.props;
        //intersection(['1005000','1071002','1081002','1931002'], options).length>0 && saveDeclare(null)

        this.setState({
            selectedPath: e.key,
        });
    }
    // 根据地址显示左侧的展开和选中导航
    resetSelectedNav = (props)=>{
        let path = props.history.location.pathname,
            openKeys = [`/${path.split(/\//)[1]}`],
            url_two = path.split(/\//)[2],
            url_three = path.split(/\//)[3];

        if(url_two){
            openKeys=[`${openKeys}/${url_two}`]
        }
        if(url_three){
            openKeys =[...openKeys,`${openKeys}/${url_three}`]
        }
        this.setState({
            openKeys,
            selectedPath: path.indexOf('web/taxDeclare') === -1 ? openKeys[1] : openKeys[0]
        });
    }
    componentDidMount(){
        // 刷新时根据地址显示导航
        this.resetSelectedNav(this.props)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.collapsed){
            this.setState({
                openKeys:[]
            });
        }else{
            // 通过非导航跳转，根据新的地址显示导航
            this.resetSelectedNav(nextProps)
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
                    <Link to="/web">
                        <img src={logo} alt="logo" style={{width: `${this.props.collapsed ? 56 : 145}px`}} />
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
                    {this.getNavMenuItems(this.props.menusData)}
                </Menu>
            </Sider>
        )
    }
}
export default withRouter(connect(state=>({
    options:state.user.getIn(['personal','options']),
    type:state.user.getIn(['personal','type']),
}),dispatch=>({
    saveDeclare:saveDeclare(dispatch),
}))(VTaxSider))