import React from 'react'
import { Layout, Menu } from 'antd';
import user_router from './routes'
import {Switch,Link,withRouter} from 'react-router-dom';
import {RouteWithSubRoutes} from 'compoments'
import './help.less'
import logo from '../sider/images/logo.png'

const { Header, Content } = Layout;

class Help extends React.Component{
  constructor(props){
    super(props)
    this.state={
      selectedKeys:[props.location.pathname],
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.setState({selectedKeys:[nextProps.location.pathname]})
    }
  }
  render(){
    const {selectedKeys} = this.state;
      return <Layout className="layout">
      <Header>
        <div className="help-logo">
          <a href="/web">
            <img src={logo} alt="logo"/>
          </a>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          onSelect={({ item, key, selectedKeys  })=>{
            this.setState({selectedKeys:[key]})
          }}
          style={{ lineHeight: '64px' }}
        >
        {
          user_router.map(router=>{
            return <Menu.Item key={router.path}><Link to={router.path}>{router.name}</Link></Menu.Item>
          })
        }
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280,marginTop:20 }}>
          <Switch>
            {user_router.map((route, index) => (
                <RouteWithSubRoutes key={index} {...route}/>
            ))}
          </Switch>
        </div>
      </Content>
    </Layout>
  }
}

export default withRouter(Help)