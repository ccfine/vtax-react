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
import watermark from '../utils/WaterMark'
import Header from './header'
import Sider from './sider'
/*import BreadCrumb from './breadcrumb/Breadcrumb'*/
import routes from '../modules/routes'
import {logout} from '../redux/ducks/user'
// import getPermission from  './index'
import moment from 'moment';


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
        const {isAuthed,history} = props;
        if(!isAuthed){
            history.replace('/tax2018bgy/login')
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

    componentDidMount(){
        const {isAuthed} = this.props;
        if(isAuthed){
            watermark({ watermark_txt:`${this.props.realName}, ${this.props.username}, ${moment().format('YYYY-MM-DD HH:mm')}`});
        }

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        this.checkLoggedIn(nextProps);

        if(nextProps.personal!==this.props.personal){
            this.setState({refresh: Date.now()})
            this.props.history.replace('/web');
        }
    }

    // componentDidMount(){
    //     getPermission()
    // }

    render() {
        // const copyright = <div>Copyright <Icon type="copyright" /> 2018 碧桂园增值税纳税申报系统</div>;
        //const pathname = this.props.history.location.pathname;
        return (
            <Layout>
                <Sider key={this.state.refresh} collapsed={this.state.collapsed} menusData={routes} changeCollapsed={this.changeCollapsed.bind(this)}  />
                <Layout style={{ msFlex:'1 1 auto', msOverflowY: 'hidden',minHeight:'100vh'}} >
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
    personal:state.user.get('personal'),
    isAuthed:state.user.get('isAuthed'),
    realName:state.user.getIn(['personal','realname']),  //'secUserBasicBO',
    username:state.user.getIn(['personal','username']),
}),dispatch=>({
    logout:logout(dispatch)
}))(Web))