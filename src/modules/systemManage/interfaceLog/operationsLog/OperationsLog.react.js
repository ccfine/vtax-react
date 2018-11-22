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
            fieldName: "mainName",
            type: "input",
            span: 8,
            formItemStyle
        }, {
            label: "查询期间",
            fieldName: "createTime",
            type: "rangePicker",
            span: 8,
            formItemStyle,
            componentProps: {
                format: "YYYY-MM-DD"
            }
        }, {
            label: "日志类型",
            fieldName: "mainName",
            type: "input",
            span: 8,
            formItemStyle
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
            dataIndex: "createTime",
            width: "200px"
        }, {
            title: "用户姓名",
            dataIndex: "username",
            width: "200px"
        }, {
            title: "日志类型",
            dataIndex: "mainName",
            width: "300px"
        }, {
            title: "请求来源",
            dataIndex: "content",
            width: "200px"
        }, {
            title: "请求模块",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求URL",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求方法名",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求头信息",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求参数",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "响应方法",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求开始时间",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "请求消耗时长",
            dataIndex: "id",
            width: "150px"
        }, {
            title: "异常信息",
            dataIndex: "id",
            width: "150px"
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
            <div className="oneLine">
                <SearchTable
                    doNotFetchDidMount={false}
                    searchOption={{
                    fields: searchFields()
                }}
                    tableOption={{
                    key: this.state.updateKey,
                    pageSize: 100,
                    columns: getColumns(),
                    url: "/sysLog/list",
                    scroll: {
                        y: window.screen.availHeight - 350
                    },
                    cardProps: {
                        title: "操作日志"
                    }
                }}/>
            </div>
        )
    }
}