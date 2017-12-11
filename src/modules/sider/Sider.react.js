/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 15:17
 * description  :
 */
import React, { Component } from 'react';
import { Layout, Menu,Icon} from 'antd';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import './styles.less'

const { Sider } = Layout;

class VTaxSider extends Component {

    //自行包装sider时要加入，为了让layout正确识别
    static __ANT_LAYOUT_SIDER = true
    constructor(props){
        super(props);
        this.state = {
            selectedPath:props.history.location.pathname
        };
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    onResize=()=>{
        // 创建事件
        let event = document.createEvent('Event');
        // 定义事件名为'build'.
        event.initEvent('resize', true, true);
        // 触发对象可以是任何元素或其他事件目标
        document.dispatchEvent(event);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selectedPath:nextProps.history.location.pathname
        })
    }

    render() {

        console.log(this.props)

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                className="vtax-custom-trigger"
            >
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedPath]}
                    onClick={
                        ({item,key,selectedKeys})=>{
                            //this.props.history.replace(key)
                            if(key!=='/dashboard/admin/user' &&  key!=='/dashboard/admin/role'){
                                this.props.history.replace(key)
                            }else{
                                window.location.href=`http://${window.location.host}${key}`
                            }

                        setTimeout(()=>{
                            this.onResize();
                        },300)}
                    }

                >
                    {
                        this.props.menusData.map(item=>{
                            return(
                                <Menu.Item key={item.path}>
                                    <Icon type={item.icon} />
                                    <span style={{fontSize:'14px'}}>{item.name}</span>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(VTaxSider)