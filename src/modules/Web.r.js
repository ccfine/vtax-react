/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:46
 * description  :
 */
import React,{Component} from 'react'
import { Layout } from 'antd'
import {Switch,Route } from 'react-router-dom';
import {connect} from 'react-redux'
import {RouteWithSubRoutes} from '../compoments'
import {composeMenus} from '../utils'
import WimsHeader from './header'
import Sider from './sider'
import BreadCrumb from './breadcrumb/Breadcrumb'
import routes from '../modules/routes'

const { Content } = Layout;

class Web extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //routes: ''  //用来获取redux里面存储的权限来判断显示那些导航
        }
    }
    componentWillReceiveProps(nextProps){
        /*if(this.props.roleType!== nextProps.roleType){
            let isAdmin = parseInt(nextProps.roleType,0)===2;
            this.setState({
                routes: getRoutesByIndex([0,1,2,3,isAdmin ? 4 : null,isAdmin ? 5 : null])
            })
        }*/
    }

    render() {
        return (
            <Layout>
                <WimsHeader />
                <Layout style={{width:'100%', maxWidth:1500,minWidth:1024,padding:'0 20px',margin:'0 auto'}}>
                    <Sider menusData={composeMenus(routes)}  />
                    <Layout style={{ padding: '0 24px', margin: 0}}>
                        <BreadCrumb location={this.props.location} routes={routes} />
                        <Content style={{background: '#fff', margin: 0}}>
                            <Switch>
                                {routes.map((route, i) => (
                                    <RouteWithSubRoutes key={i} {...route}/>
                                ))}
                                <Route path="*" component={()=><div>no match</div>} />
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default connect(state=>({
}))(Web)