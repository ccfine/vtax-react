/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:46
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Icon} from 'antd'
import PropTypes from 'prop-types'
import {withRouter,Switch,Route,Link} from 'react-router-dom';
import {connect} from 'react-redux'
import {RouteWithSubRoutes,Exception} from '../compoments'
import {composeMenus} from '../utils'
import Header from './header'
import Sider from './sider'
import BreadCrumb from './breadcrumb/Breadcrumb'
import routes from '../modules/routes'
import {logout} from '../redux/ducks/user'

const { Content,Footer } = Layout;

class Web extends Component {

    state = {
        collapsed:false,
        number:0,
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
        const copyright = <div>Copyright <Icon type="copyright" /> 2017 喜盈佳纳税申报平台</div>;
        //const pathname = this.props.history.location.pathname;
        return (
            <Layout>
                <Sider collapsed={this.state.collapsed} menusData={composeMenus(routes)}  />
                <Layout>
                    <Header logout={()=>this.props.logout()} changeCollapsed={this.changeCollapsed.bind(this)} />

                    {/*
                        <BreadCrumb location={this.props.location} routes={routes} />
                        ,padding: pathname ==='/web' ? 0 : 20
                    */}
                    <Content style={{ margin: '24px 24px 0', height: '100%',background: '#fff'}}>
                        <div style={{ minHeight: 'calc(100vh - 260px)' }}>
                            <Switch>
                                {routes.map((route, i) => (
                                    <RouteWithSubRoutes key={i} {...route}/>
                                ))}
                                <Route path="*" component={()=><div>no match</div>} />
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        {
                            copyright
                        }
                    </Footer>
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

export default withRouter(connect(state=>({
    isAuthed:state.user.get('isAuthed')
}),dispatch=>({
    logout:logout(dispatch)
}))(Web))