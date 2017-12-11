/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:46
 * description  :
 */
import React,{Component} from 'react'
import { Layout } from 'antd'
import PropTypes from 'prop-types'
import {Switch,Route } from 'react-router-dom';
import {connect} from 'react-redux'
import {RouteWithSubRoutes} from '../compoments'
import {composeMenus} from '../utils'
import Header from './header'
import Sider from './sider'
import BreadCrumb from './breadcrumb/Breadcrumb'
import routes from '../modules/routes'
import {logout} from '../redux/ducks/user'

const { Content } = Layout;

class Web extends Component {

    state = {
        collapsed:false
    }

    static propTypes = {
        history:PropTypes.object.isRequired
    }

    checkLoggedIn= props =>{
        const {isAuthed,history} = props;
        if(!isAuthed){
            history.replace('/login');
        }
    }
    //给其它组件传数据
    changeCollapsed=collapsed=>{
        this.setState({
            collapsed
        })
    }

    componentDidMount() {

    }

    componentWillMount(){
        this.checkLoggedIn(this.props)
    }

    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps)
    }

    renderNormal() {
        return (
            <Layout>
                <Sider collapsed={this.state.collapsed} menusData={composeMenus(routes)}  />
                <Layout>
                    <Header logout={()=>this.props.logout()} changeCollapsed={this.changeCollapsed.bind(this)} />
                    <div>
                        {/*<BreadCrumb location={this.props.location} routes={routes} />*/}
                        <Content style={{ margin: '24px 16px', padding: 24,background: '#fff',}}>
                            <Switch>
                                {routes.map((route, i) => (
                                    <RouteWithSubRoutes key={i} {...route}/>
                                ))}
                                <Route path="*" component={()=><div>no match</div>} />
                            </Switch>
                        </Content>
                    </div>
                </Layout>
            </Layout>
        )
    }

    render() {
        return (
            <div>
                {
                    this.renderNormal()
                }
            </div>
        )
    }
}

export default connect(state=>({
    isAuthed:state.user.get('isAuthed')
}),dispatch=>({
    logout:logout(dispatch)
}))(Web)