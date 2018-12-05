/**
 * author       : zhouzhe
 * createTime   : 2018/12/3 22:29
 * description  : 首页公告中心组件
 */
import React, { Component } from 'react'
import { message, Spin } from 'antd'
import {request} from 'utils'
import {getNoticeNum} from '../../redux/ducks/user'
import {connect} from 'react-redux'
import {withRouter,Link} from 'react-router-dom';
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
        }
    }

    getSysDictId = (type) => {
        if (parseInt(type, 0) === 1) {
            return '集团公告'
        } else if (parseInt(type, 0) === 2) {
            return '区域公告'
        } else if (parseInt(type, 0) === 3) {
            return '其他公告'
        }
    }

    htmlToText = (text) => {
        const re = /<(?:.|\s)*?>/g;
        return text.replace(re, "");
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
                    this.props.getNoticeNum(resData.notReadCount)
                }else {
                    this.setState({loading: false})
                }
            })
            .catch(err => {
                this.setState({loading: false})
                message.error(err.message)
            })
    }

    render() {
        const { listData, loading } = this.state;
        return (
            <div className="home-message">
                <div className="home-title">
                    <span>公告中心</span>
                    <a href='/web/message' target="_blank">更多>></a>
                </div>
                <Spin spinning={loading}>
                    <div className="home-message-content">
                        {
                            listData.length > 0 ? listData.map((item, key) => {
                                return (
                                    <div key={key} className="home-message-page">
                                        <Link to={`/messageDetail?id=${item.id}&readStatus=${item.readStatus}`} target="_blank"><div className="message-page-header"><span>{this.getLevel(item.level)}</span><span>{item.title}</span></div></Link>
                                        <div className="message-page-info"><span>{`公告时间：${item.publishDate}`}</span><span>{`发布人：${item.publishBy}`}</span><span>{`公告类型：${this.getSysDictId(item.sysDictId)}`}</span></div>
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

export default withRouter(connect(state=>({
    noticeNum:state.user.getIn(['personal','noticeNum']),
}),dispatch=>( {
    getNoticeNum:getNoticeNum(dispatch)
}))(homeMessage))