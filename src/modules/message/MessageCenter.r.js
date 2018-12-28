/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 18:08
 * description  : 公告中心查询页
 */

import React, { Component } from 'react'
import { message, Icon } from 'antd'
import { SearchTable } from "compoments"
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchNoticeNum} from '../../redux/ducks/user'
import {request,composeBotton} from 'utils'
import './index.less'

const getSearchFields = [
    {
        label: "公告标题",
        fieldName: "title",
        span: 8,
    },
    {
        label: "公告类型",
        fieldName: "sysDictId",
        type: "asyncSelect",
        span: 8,
        componentProps:{
            fieldTextName: "name",
            fieldValueName: "id",
            doNotFetchDidMount: false,
            url: `/sys/dict/listBaseInfo/gglglx`
        }
    },
    {
        label: "公告级别",
        fieldName: "level",
        type: "select",
        span: 8,
        options: [
            {
                text: "紧急公告",
                value: "1"
            },
            {
                text: "重要公告",
                value:  "2"
            },
            {
                text: "普通公告",
                value: "3"
            }
        ]
    },
    {
        label: "生效日期",
        fieldName: "takeDate",
        type: "datePicker",
        span: 8,
        componentProps:{
            format:'YYYY-MM-DD'
        }
    },
    {
        label: "发布日期",
        fieldName: "publishDate",
        type: "datePicker",
        span: 8,
        componentProps:{
            format:'YYYY-MM-DD'
        }
    },
    {
        label: "阅读状态",
        fieldName: "readStatus",
        type: "select",
        span: 8,
        options: [
            {
                text: "已阅读",
                value: "1"
            },
            {
                text: "未阅读",
                value:  "2"
            }
        ]
    },
    {
        label: "发布人",
        fieldName: "publishBy",
        span: 8,
    },
]

const getColumns = context => [
    {
        title: "公告标题",
        dataIndex: "title",
        width:'13%',
        render: (text) => {
            return `标题：${text}`
        }
    },
    {
        title: "公告类型",
        dataIndex: "sysDictName",
        width:'13%',
    },
    {
        title: "公告级别",
        dataIndex: "level",
        width:'13%',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '紧急公告'
            } else if (parseInt(text,0) === 2) {
                return '重要公告'
            } else if (parseInt(text,0 === 3)) {
                return '普通公告'
            } else {
                return ''
            }
        }
    },
    {
        title: "生效日期",
        dataIndex: "takeDate",
        width:'13%',
    },
    {
        title: "发布时间",
        dataIndex: "publishDateStr",
        width:'13%',
    },
    {
        title: "阅读状态",
        dataIndex: "readStatus",
        width:'13%',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '已阅读'
            } else if (parseInt(text,0) === 2) {
                return '未阅读'
            } else {
                return '————'
            }
        }
    },
    {
        title: "发布人",
        dataIndex: "publishBy",
        width:'13%',
    },
    {
        title: "操作",
        dataIndex: "taxableProject9",
        width:'9%',
        render(text, record, index) {
            return composeBotton([{
                type:'action',
                icon:'search',
                title:'查看',
                onSuccess:()=>{
                    context.handleGo(record);
                    window.open(`/messageDetail?id=${record.id}&readStatus=${record.readStatus}`)
                }
            }])
        },
    },
]

class MessageCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableUpDateKey: Date.now(),
        }
    }

    refreshTable = () => {
        this.setState({
            tableUpDateKey: Date.now(),
        });
    };

    toggleModalVisible = visible => {
        this.setState({
            visible
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
                this.refreshTable()
                this.props.fetchNoticeNum()
            })
        }
    }

    handleReturn = () => {
        window.history.back()
    }

    render() {
        const { tableUpDateKey } = this.state;
        return (
            <div className="message-center">
                <div style={{ margin: "0px 0 6px 6px" }} onClick={this.handleReturn}>
					<span style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12}}>
						<Icon type="left" /><span>返回</span>
					</span>
				</div>
                <div className="title">公告中心</div>
                <SearchTable
                    searchOption={{
                        fields: getSearchFields,
                        cardProps:{
                            style:{borderTop:0}
                        }
                    }}
                    tableOption={{
                        columns: getColumns(this),
                        url: "/sysNotice/list",
                        key: tableUpDateKey,
                        scroll: { x: 1200, y:window.screen.availHeight-500},
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}

export default withRouter(connect(state=>({
    noticeNum:state.user.get('noticeNum'),
}),dispatch=>({
    fetchNoticeNum:fetchNoticeNum(dispatch)
}))(MessageCenter))