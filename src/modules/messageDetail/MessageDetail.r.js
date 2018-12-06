/**
 * author       : zhouzhe
 * createTime   : 2018/12/3 20:18
 * description  : 公告详情页
 */

import React, { Component } from 'react'
import { Layout, message, Spin } from 'antd'
import {request,getUrlParam} from 'utils'
import { FileExport } from 'compoments'
import logo from '../sider/images/logo.png'
import './index.less'

const { Header, Content } = Layout

class MessageDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: undefined,
            loading: true,
            flieList: []
        }
    }

    componentDidMount() {
        const id = getUrlParam('id')
        let reqData = {
            readStatus: getUrlParam('readStatus')
        }
        this.fetchData(id, reqData)
        this.fetchFileData(id)
    }

    fetchData = (id, data) => {
        request.get(`/sysNotice/find/${id}`, {
            params: data
        })
            .then(({data}) => {
                if(data.code===200){
                    this.setState({data: data.data, loading: false})
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    fetchFileData = (id) => {
        request.get(`/sysNotice/accessoryList?id=${id}`)
            .then(({data}) => {
                if (data.code === 200) {
                    let reqData = data.data || [];
                    this.setState({flieList: reqData})
                }
            })
    }

    getLevel = (type) => {
        if (parseInt(type, 0) === 1) {
            return '紧急公告'
        } else if (parseInt(type, 0) === 2) {
            return '重要公告'
        } else if (parseInt(type, 0) === 3) {
            return '普通公告'
        } else {
            return ''
        }
    }

    getSysDictId = (type) => {
        if (parseInt(type, 0) === 1) {
            return '集团税务公告'
        } else if (parseInt(type, 0) === 2) {
            return '税务政策解读'
        } else if (parseInt(type, 0) === 3) {
            return '平台更新公告'
        } else if (parseInt(type, 0) === 4) {
            return '其他公告'
        } else {
            return ''
        }
    }

    render() {
        const { data, loading } = this.state
        return (
            <Layout className="layout">
                <Header>
                    <div className="message-logo">
                        <a href="/web">
                            <img src={logo} alt="logo"/>
                        </a>
                    </div>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="message-detail">
                        <Spin spinning={loading}>
                            <div className="message-header">
                                <span style={{marginRight: 20}}>{(data && this.getLevel(data.level)) || ''}</span>
                                <span>{(data && data.title) || ''}</span>
                            </div>
                            <div className="message-info">
                                <span style={{marginRight: 20}}>{`公告时间：${(data && data.publishDateStr) || ''}`}</span>
                                <span style={{marginRight: 20}}>{`发布人：${(data && data.publishBy) || ''}`}</span>
                                <span>{`公告类型：${(data && this.getSysDictId(data.sysDictId)) || ''}`}</span>
                            </div>
                            <div className="message-content" dangerouslySetInnerHTML={{ __html: data && data.content }} />
                            <ul className="fileList">
                                {
                                    this.state.flieList.map((item, key) => {
                                        return (
                                            <li key={key}>
                                                <span>{item.srcFileName}</span>
                                                <FileExport url={`/sysNotice/download`} params={{uuid:item.fileUuid}} size='small' title='下载' />
                                            </li> 
                                        )
                                    })
                                }
                            </ul>
                        </Spin>
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default MessageDetail