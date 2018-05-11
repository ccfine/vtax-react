/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 14:46
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Icon} from 'antd'
import PropTypes from 'prop-types'
import {withRouter,Switch,Route} from 'react-router-dom';
import {connect} from 'react-redux'
import {RouteWithSubRoutes} from 'compoments'
import {composeMenus} from 'utils'
import Header from './header'
import Sider from './sider'
import BreadCrumb from './breadcrumb/Breadcrumb'
import routes from '../modules/routes'
import {logout} from '../redux/ducks/user'
//import strategies from 'config/routingAuthority.config'

const { Content,Footer } = Layout;

/*const returnAuthority = (authority) => {
    const new_routes = composeMenus(routes);
    let list = [];
    Object.keys(new_routes).forEach((item) => {
        Object.keys(authority).forEach((ele) => {
            if(!new_routes[item].to) {
                if(new_routes[item].name === authority[ele].name){
                    list.push({...new_routes[item], authority:authority[ele].authorityInfo})
                    return;
                }
            }
        })

    })
    let newList = [];
    let data =  {...new_routes,...list}
    for(let item in data){
        newList.push(data[item])
    }
    return newList;
}
const routesData = returnAuthority(strategies);*/

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
        const {isAuthed,history} = props;
        if(!isAuthed){
            history.replace('/login');
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

    componentDidMount() {
        //console.log(routesData)
        //this.returnAuthority(strategies)
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


    render() {
        //console.log(routesData)
        const copyright = <div>Copyright <Icon type="copyright" /> 2017 喜盈佳纳税申报平台</div>;
        //const pathname = this.props.history.location.pathname;
        return (
            <Layout key={this.state.refresh}>
                <Sider collapsed={this.state.collapsed} menusData={routes} changeCollapsed={this.changeCollapsed.bind(this)}  />
                <Layout style={{ msFlex:'1 1 auto', msOverflowY: 'hidden',minHeight:'100vh'}}>
                    <Header logout={()=>this.props.logout()} changeCollapsed={this.changeCollapsed.bind(this)} changeRefresh={this.changeRefresh.bind(this)}  />
                    <BreadCrumb location={this.props.location} routes={routes} />
                    <Content style={{ margin: '12px 12px 0'}}>
                        <Switch>
                            {
                                composeMenus(routes).map((route, i) => (
                                    <RouteWithSubRoutes key={i} {...route}/>
                                ))
                            }
                            <Route path="*" component={()=><div>no match</div>} />
                        </Switch>
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
}

export default withRouter(connect(state=>({
    isAuthed:state.user.get('isAuthed'),
    orgId:state.user.get('orgId')
}),dispatch=>({
    logout:logout(dispatch)
}))(Web))