/**
 * author       : zhouzhe
 * createTime   : 2018/11/29 18:08
 * description  : 公告中心查询页
 */

import React, { Component } from 'react'
import { SearchTable } from "compoments"
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
        type: "select",
        span: 8,
        options: [
            {
                text: "集团公告",
                value: "1"
            },
            {
                text: "区域公告",
                value:  "2"
            },
            {
                text: "其他公告",
                value: "3"
            }
        ]
    },
    {
        label: "公告级别",
        fieldName: "level",
        type: "select",
        span: 8,
        options: [
            {
                text: "紧急",
                value: "1"
            },
            {
                text: "重要",
                value:  "2"
            },
            {
                text: "普通",
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
        fieldName: "createBy",
        span: 8,
    },
]

const getColumns = context => [
    {
        title: "公告标题",
        dataIndex: "title",
        width:'100px',
        render: (text) => {
            return `标题：${text}`
        }
    },
    {
        title: "公告类型",
        dataIndex: "sysDictId",
        width:'100px',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '集团公告'
            } else if (parseInt(text,0) === 2) {
                return '区域公告'
            } else if (parseInt(text,0 === 3)) {
                return '其他公告'
            } else {
                return ''
            }
        }
    },
    {
        title: "公告级别",
        dataIndex: "level",
        width:'100px',
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
        width:'100px',
    },
    {
        title: "发布时间",
        dataIndex: "publishDate",
        width:'100px',
    },
    {
        title: "阅读状态",
        dataIndex: "readStatus",
        width:'100px',
        render: (text) => {
            if (parseInt(text,0) === 1) {
                return '已阅读'
            } else if (parseInt(text,0) === 0) {
                return '未阅读'
            } else {
                return '————'
            }
        }
    },
    {
        title: "发布人",
        dataIndex: "publishBy",
        width:'100px',
    },
    {
        title: "操作",
        dataIndex: "taxableProject9",
        width:'100px',
        render(text, record, index) {
            return <a href={`/messageDetail?id=${record.id}&readStatus=${record.readStatus}`} target="_blank">查看</a>
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

    render() {
        const { tableUpDateKey } = this.state;
        return (
            <div className="message-center">
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
                        scroll: { x: 1000, y:window.screen.availHeight-380},
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}

export default MessageCenter