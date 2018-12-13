/**
 * author       : zhouzhe
 * createTime   : 2018/11/22 16:06
 * description  :
*/

import React, {Component} from "react"
import {SearchTable} from "compoments"

const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const searchFields = () => {
    return [
        {
            label: "用户名",
            fieldName: "username",
            span: 8,
            formItemStyle
        }, {
            label: "请求来源",
            fieldName: "remoteAddr",
            type: "input",
            span: 8,
            formItemStyle
        }, {
            label: "查询期间",
            fieldName: "date", 
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format: "YYYY-MM-DD"
            }
        }, {
            label: "日志类型",
            fieldName: "type",
            type: "select",
            span: 8,
            formItemStyle,
            options: [
                {
                    text: "正常",
                    value: "info"
                },
                {
                    text: "异常",
                    value: "error"
                }
            ]
        }
    ]
}

const getColumns = () => {
    return [
        {
            title: "用户ID",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "用户名",
            dataIndex: "username",
            width: "100px"
        }, {
            title: "用户姓名",
            dataIndex: "realName",
            width: "100px"
        }, {
            title: "日志类型",
            dataIndex: "type",
            width: "100px",
            render: (text, record) => {
                return record.type === 'info' ? <span style={{color: '#87d068'}}>正常</span> : <span style={{color: '#f5222d'}}>异常</span>
            }
        }, {
            title: "请求来源",
            dataIndex: "remoteAddr",
            width: "100px"
        }, {
            title: "请求模块",
            dataIndex: "title",
            width: "100px"
        }, {
            title: "请求URL",
            dataIndex: "requestURL",
            width: "150px"
        }, {
            title: "请求方法名",
            dataIndex: "method",
            width: "50px"
        }, 
        // {
        //     title: "请求头信息",
        //     dataIndex: "requestHeader",
        //     width: "150px"
        // }, 
        {
            title: "请求参数",
            dataIndex: "requestParams",
            width: "150px"
        }, {
            title: "响应方法",
            dataIndex: "declaringTypeName",
            width: "150px"
        }, {
            title: "请求开始时间",
            dataIndex: "dateStart",
            width: "100px"
        }, {
            title: "请求消耗时长",
            dataIndex: "duration",
            width: "100px"
        }, {
            title: "异常信息",
            dataIndex: "exceptionInfo",
            width: "100px"
        }
    ]
}

export default class OperationsLog extends Component {
    constructor() {
        super()
        this.state = {
            updateKey: Date.now()
        }
    }

    render() {
        return (
                <SearchTable
                    doNotFetchDidMount={false}
                    searchOption={{
                    fields: searchFields()
                }}
                    tableOption={{
                    key: this.state.updateKey,
                    pageSize: 100,
                    columns: getColumns(),
                    url: "/sysLog/opt/list",
                    scroll: {
                        x: 3000,
                        y: window.screen.availHeight - 400
                    },
                    cardProps: {
                        title: "操作日志"
                    }
                }}/>
        )
    }
}