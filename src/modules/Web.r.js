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

    static propTypes = {
        history:PropTypes.object.isRequired
    }

    checkLoggedIn= props =>{
        const {isAuthed,history} = props;
        if(!isAuthed){
            history.replace('/login');
        }
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
                <Header logout={()=>this.props.logout()} />
                <Layout style={{width:'100%', maxWidth:1500,minWidth:1024,padding:'0 20px',margin:'0 auto'}}>
                    <Sider menusData={composeMenus(routes)}  />
                    <Layout style={{ padding: '0 24px', margin: 0}}>
                        {/*<BreadCrumb location={this.props.location} routes={routes} />*/}
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