/**
 * author       : chenfeng
 * createTime   : 2018/10/12 11:23
 * description  :
*/

import React, { Component } from "react"
import { SearchTable } from "compoments"
import { composeBotton } from 'utils'
import TableTitle from "compoments/tableTitleWithTime"

const formItemStyle = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const searchFields = getFieldValue => [
  {
    label: "纳税主体",
    fieldName: "mainId",
    type: "taxMain",
    span: 8,
    formItemStyle,
    fieldDecoratorOptions: {
        rules: [{
            required: true,
            message: "请选择纳税主体"
        }]
    }
  },
  {
    label: "利润中心",
    fieldName: "profitCenterId",
    type: "asyncSelect",
    span: 8,
    formItemStyle,
    componentProps: {
        fieldTextName: "profitName",
        fieldValueName: "id",
        doNotFetchDidMount: false,
        fetchAble: getFieldValue("mainId") || false,
        url: `/taxsubject/profitCenterList/${getFieldValue("mainId")}`
    }
  },
  {
    label: "项目分期",
    fieldName: "stagesId",
    type: "asyncSelect",
    span: 8,
    formItemStyle,
    componentProps:{
        fieldTextName: "itemName",
        fieldValueName: "id",
        doNotFetchDidMount: true,
        fetchAble: getFieldValue("profitCenterId") || getFieldValue("projectId") || false,
        url: `/project/stages/${getFieldValue("profitCenterId") || ""}?size=1000`
    }
  },
  {
    label: "产品名称",
    fieldName: "productName",
    span: 8,
    formItemStyle
  },
  {
    label: "产品编码",
    fieldName: "productNum",
    span: 8,
    formItemStyle
  }
]

const columns = [
  {
    title: "利润中心",
    dataIndex: "profitCenterName",
    width: "200px"
  },
  {
    title: "项目分期名称",
    dataIndex: "stagesName",
    width: "200px"
  },
  {
    title: "产品名称",
    dataIndex: "productName",
    width: "200px"
  },
  {
    title: "产品编码",
    dataIndex: "productNum",
    width: "200px"
  },
  {
    title: "产品类型",
    dataIndex: "productType",
    width: "200px"
  },
  {
    title: "建筑面积",
    dataIndex: "coveredArea",
    width: "200px"
  },
  {
    title: "最新更新时间",
    dataIndex: "lastModifiedDate",
    width: "200px"
  }
]

const apiFields = getFieldValue => [
  {
      label: "纳税主体",
      fieldName: "mainId",
      type: "taxMain",
      span: 20,
      fieldDecoratorOptions: {
          rules: [{
              required: true,
              message: "请选择纳税主体"
          }]
      }
  }
]

export default class SelfContainedProductList extends Component {
  constructor () {
    super()
    this.state = {
      filters: {},
      totalSource: undefined
    }
  }

  render () {
    const { totalSource } = this.state
    return (
      <div className="oneLine">
        <SearchTable 
          doNotFetchDidMount={ true }
          searchOption={{
            fields: searchFields
          }}
          tableOption={{
            pageSize: 100,
            columns,
            onSuccess: params => {
              this.setState({
                  filters: params
              })
            },
            cardProps: {
              title: <TableTitle time={ totalSource && totalSource.extractTime }>自持类产品清单</TableTitle>
            },
            url: "/interProductList/list",
            extra: <div>
              {
                  composeBotton([{
                      type: "modal",
                      url: "/interProductList/sendApi",
                      title: "抽数",
                      icon: "usb",
                      fields: apiFields,
                      userPermissions: ['2065001'],
                  }])
              }
            </div>,
            onTotalSource: totalSource => {
              this.setState({
                  totalSource
              })
            },
            scroll: {
              x: 1500,
              y: window.screen.availHeight - 400
            }
          }}
        />
      </div>
    )
  }
}
 
// export default connect(state => ({
//   userid: state.user.getIn(["personal", "id"])
// }))(SelfContainedProductList)