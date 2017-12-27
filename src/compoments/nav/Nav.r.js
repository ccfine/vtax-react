/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:11
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Avatar,List, Card } from 'antd'
import {Link} from 'react-router-dom'
import './styles.less'

const { Meta } = Card;

class NavRouter extends Component {

    composeNav=(routes)=>{
        return routes.map((item,i)=>{
            if(item && !item.to){
                return {
                    path:item.path,
                    name:item.name,
                    icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' //`icon_${i}`,
                }
            }
            return null;
        }).filter(item=>item);
    }

    render() {
        return (
            <Layout style={{background: 'transparent'}}>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
                    dataSource={this.composeNav(this.props.data)}
                    renderItem={item => (
                        <List.Item>
                            <Card className="card">
                                    <Meta
                                        avatar={<Avatar className="IconImg" src={item.icon} />}
                                        //title={item.name}
                                        description={<Link to={item.path}>
                                            {item.name}
                                        </Link>}
                                    />
                            </Card>
                        </List.Item>
                    )}
                />
            </Layout>
        )
    }
}



export default NavRouter