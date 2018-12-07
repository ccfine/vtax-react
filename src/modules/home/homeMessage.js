/**
 * author       : zhouzhe
 * createTime   : 2018/12/3 22:29
 * description  : 首页公告中心组件
 */
import React, { Component } from 'react'
import { message, Spin } from 'antd'
import {request} from 'utils'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchNoticeNum} from '../../redux/ducks/user'
import './homeMessage.less'

class homeMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listData: [],
            loading: false
        }
    }
    componentDidMount() {
        this.fetchMessageList()
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

    htmlToText = (text) => {
        const re = /<(?:.|\s)*?>/g;
        const content = text.replace(re, "");
        return content.length > 130 ? `${content.substr(0,130)}...` : content;
    }

    fetchMessageList = () => {
        this.setState({loading: true})
        request.get(`/sysNotice/upList`, {
            params: {size: 3}
        })
            .then(({data}) => {
                if(data.code===200){
                    let resData = data.data
                    this.setState({listData: resData.page.records, loading: false})
                }else {
                    this.setState({loading: false})
                }
            })
            .catch(err => {
                this.setState({loading: false})
                message.error(err.message)
            })
    }

    fetchData = (id, data, callback) => {
        request.get(`/sysNotice/find/${id}`, {
            params: data
        })
            .then(({data}) => {
                if(data.code===200){
                    callback && callback()
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    handleGo = (record) => {
        const id = record.id;
        let reqData = {
            readStatus: record.readStatus
        }
        if (parseInt(record.readStatus,0) === 2) {
            this.fetchData(id, reqData, () => {
                this.props.fetchNoticeNum()
            })
        }
    }

    render() {
        const { listData, loading } = this.state;
        return (
            <div className="home-message">
                <div className="home-title">
                    <span>公告中心</span>
                    <a href='/web/message'>更多>></a>
                </div>
                <Spin spinning={loading}>
                    <div className="home-message-content">
                        {
                            listData.length > 0 ? listData.map((item, key) => {
                                return (
                                    <div key={key} className="home-message-page">
                                        <a href={`/messageDetail?id=${item.id}&readStatus=${item.readStatus}`} target="_blank" onClick={() => this.handleGo(item)}><div className="message-page-header"><span>{this.getLevel(item.level)}</span><span>{item.title}</span></div></a>
                                        <div className="message-page-info"><span>{`公告时间：${item.publishDateStr}`}</span><span>{`发布人：${item.publishBy}`}</span><span>{`公告类型：${this.getSysDictId(item.sysDictId)}`}</span></div>
                                        <div className="message-page-text">{this.htmlToText(item.content)}</div>
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                </Spin>
            </div>
        )
    }
}

export default withRouter(connect((state)=>({
    noticeNum:state.user.get('noticeNum'),
}),dispatch=>({
    fetchNoticeNum:fetchNoticeNum(dispatch)
}))(homeMessage))