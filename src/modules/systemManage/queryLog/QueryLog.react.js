/**
 * author       : chenfeng
 * createTime   : 2018/9/25 11:06
 * description  :
*/

import React, { Component } from "react"
import { SearchTable } from "compoments"

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
      label: "查询期间",
      fieldName: "createTime",
      type: "rangePicker",
      span: 8,
      formItemStyle,
      componentProps: {
        format:"YYYY-MM-DD"
      }
    },
    {
      label: "用户名",
      fieldName: "username",
      span: 8,
      formItemStyle
    },
    {
      label: "纳税主体",
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
      title: "时间",
      dataIndex: "createTime",
      width: "200px"
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: "200px"
    },
    {
      title: "纳税主体",
      dataIndex: "mainName",
      width: "300px"
    },
    {
      title: "内容",
      dataIndex: "content",
      width: "200px"
    }
  ]
}

export default class QueryLog extends Component {
  constructor () {
    super()
    this.state = {
      updateKey: Date.now()
    }
  }

  render () {
    return (
      <div className="oneline">
        <SearchTable
          doNotFetchDidMount={ false }
          searchOption={{
            fields: searchFields()
          }}
          tableOption={{
            key: this.state.updateKey,
            pageSize: 100,
            columns: getColumns(),
            url: "/sysLog/list",
            cardProps: {
              title: "登入日志"
            }
          }}
        />
      </div>
    )
  }
}