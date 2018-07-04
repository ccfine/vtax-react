/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:46
 * description  :
 */
import React,{Component} from 'react'
import {Layout} from 'antd'
import PropTypes from 'prop-types'
import {withRouter,Switch,Route} from 'react-router-dom';
import {connect} from 'react-redux'
import {RouteWithSubRoutes} from 'compoments'
import {composeMenus} from 'utils'
import Header from './header'
import Sider from './sider'
/*import BreadCrumb from './breadcrumb/Breadcrumb'*/
import routes from '../modules/routes'
import {logout} from '../redux/ducks/user'
// import getPermission from  './index'

const { Content } = Layout;

class Web extends Component {

    state = {
        collapsed:false,
        number:0,
        refresh: Date.now(),
        //routes: routes.reduce((arr, current) => arr.concat(current.children), []),
    }

    static propTypes = {
        history:PropTypes.object.isRequired
    }

    checkLoggedIn= props =>{
        const {isAuthed,history,personal} = props;
        if(!(isAuthed && personal && personal.id && personal.username)){
            history.replace('/403');
        }
    }
    //给其它组件传数据
    changeCollapsed=collapsed=>{
        this.mounted && this.setState({
            collapsed
        })
    }

    changeRefresh = refresh =>{
        this.mounted && this.setState({
            refresh,
        })
    }

    componentWillMount(){
        this.checkLoggedIn(this.props)
    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps);
    }

    // componentDidMount(){
    //     getPermission()
    // }

    render() {
        // const copyright = <div>Copyright <Icon type="copyright" /> 2018 碧桂园增值税纳税申报系统</div>;
        //const pathname = this.props.history.location.pathname;
        return (
            <Layout>
                <Sider  key={this.state.refresh} collapsed={this.state.collapsed} menusData={routes} changeCollapsed={this.changeCollapsed.bind(this)}  />
                <Layout style={{ msFlex:'1 1 auto', msOverflowY: 'hidden',minHeight:'100vh'}}>
                    <Header logout={()=>this.props.logout()} changeCollapsed={this.changeCollapsed.bind(this)} changeRefresh={this.changeRefresh.bind(this)}  />
                    {/*<BreadCrumb location={this.props.location} routes={routes} />*/}
                    <Content style={{ margin: '8px 12px 0'}}  key={this.state.refresh}>
                        <Switch>
                            {
                                composeMenus(routes).map((route, i) => (
                                    <RouteWithSubRoutes key={i} {...route}/>
                                ))
                            }
                            <Route path="*" component={()=><div>no match</div>} />
                        </Switch>
                    </Content>
                    {/* <Footer style={{ textAlign: 'center',padding:'8px 12px'}}>
                        {
                            copyright
                        }
                    </Footer> */}
                </Layout>
            </Layout>
        )
    }
}

export default withRouter(connect(state=>({
    isAuthed:state.user.get('isAuthed'),
    orgId:state.user.get('orgId'),
    personal:state.user.get('personal'),
}),dispatch=>({
    logout:logout(dispatch)
}))(Web))