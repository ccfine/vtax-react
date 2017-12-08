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
                //collapsed={true}
                style={{background:'#fff'}}
            >
                <Menu
                    //mode="inline"
                    style={{ height: '100%', borderRight: 0 }}
                    className="vtax-sider-menu"
                    selectedKeys={[this.state.selectedPath]}
                    onClick={
                        ({item,key,selectedKeys})=>{
                            //this.props.history.replace(key)
                            if(key!=='/dashboard/admin/user' &&  key!=='/dashboard/admin/role'){
                                this.props.history.replace(key)
                            }else{
                                window.location.href=`http://${window.location.host}${key}`
                            }
                        }
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