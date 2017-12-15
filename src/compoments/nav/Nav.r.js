/**
 * author       : liuliyuan
 * createTime   : 2017/12/11 12:11
 * description  :
 */
import React, { Component } from 'react'
import {Avatar,List, Card } from 'antd'
import {Link} from 'react-router-dom'
import './styles.less'

class Nav extends Component {

    render() {
        return (
            <div>
                {/*<h2 style={{padding: '10px 0'}}>{document.title}</h2>*/}
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item>
                            <Card>
                                <Avatar className="IconImg" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                <Link to="/">
                                    {item.title}
                                </Link>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default Nav