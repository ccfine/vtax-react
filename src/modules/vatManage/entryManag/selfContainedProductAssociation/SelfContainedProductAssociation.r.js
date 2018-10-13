/**
 * author       : chenfeng
 * createTime   : 2018/10/13 12:26
 * description  :
*/

import React, { Component } from "react"
import { connect } from "react-redux"
import { SearchTable, TableTotal } from "compoments"
import { listMainResultStatus, composeBotton } from "util"
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
    label: "查询期间",
    fieldName: "authMonth",
    type: "monthPicker",
    span: 8,
    formItemStyle,
    componentProps: {
        format: "YYYY-MM"
    }
  },
  {
    label: "产品类型",
    fieldName: "productType",
    type: "select",
    span: 8,
    formItemStyle,
    options: [
      {

      }
    ]
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
    label: "发票类型",
    fieldName: "invoiceType",
    type: "select",
    span: 8,
    formItemStyle,
    options: [
      {

      }
    ]
  },
  {
    label: "发票号码",
    fieldName: "invoiceNumber",
    span: 8,
    formItemStyle
  },
  {
    label: "认证标记",
    fieldName: "certificationMark",
    type: "select",
    span: 8,
    formItemStyle,
    options: [
      {
        text: "认证成功",
        value: "0"
      },
      {
        text: "未认证",
        value: "1"
      }
    ]
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
    dataIndex: "productCode",
    width: "200px"
  },
  {
    title: "产品类型",
    dataIndex: "productType",
    width: "200px"
  },
  {
    title: "发票号码",
    dataIndex: "invoiceNumber",
    width: "200px"
  },
  {
    title: "发票代码",
    dataIndex: "invoiceCode",
    width: "200px"
  },
  {
    title: "认证标记",
    dataIndex: "certificationMark",
    width: "200px"
  },
  {
    title: "认证月份",
    dataIndex: "certificationMonth",
    width: "200px"
  },
  {
    title: "拆分前发票号码",
    dataIndex: "boforeInvoiceCode",
    width: "200px"
  },
  {
    title: "开票日期",
    dataIndex: "makeOutInvoiceDate",
    width: "200px"
  },
  {
    title: "发票类型",
    dataIndex: "invoiceType",
    width: "200px"
  },
  {
    title: "不含税金额",
    dataIndex: "noTaxAmount",
    width: "200px"
  },
  {
    title: "税率",
    dataIndex: "rate",
    width: "100px"
  },
  {
    title: "进项税额",
    dataIndex: "inputTax",
    width: "200px"
  },
  {
    title: "价税合计",
    dataIndex: "taxTotal",
    width: "200px"
  },
  {
    title: "拆分比例",
    dataIndex: "splitRatio",
    width: "200px"
  },
  {
    title: "已拆分金额",
    dataIndex: "amountSplit",
    width: "200px"
  },
  {
    title: "最新更新日期",
    dataIndex: "lastUpdateDate",
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
  },
  {
      label: "抽取月份",
      fieldName: "authMonth",
      type: "monthPicker",
      span: 20,
      fieldDecoratorOptions: {
          rules: [{
              required: true,
              message: "请选择抽取月份"
          }]
      }
  }
]

class SelfContainedProductAssociation extends Component {
  constructor () {
    super()
    this.state = {
      filters: {},
      totalSource: undefined,
      statusParam: ""
    }
  }

  render () {
    const { totalSource, statusParam, filters } = this.state
    return (
      <div className="oneline">
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
              title: <TableTitle time={ totalSource && totalSource.extractTime }>自持类产品关联进项的发票</TableTitle>
            },
            url: "",
            extra: <div>
              {
                  listMainResultStatus(statusParam)
              }
              {
                  JSON.stringify(filters) !== "{}" && composeBotton([{
                      type: "fileExport",
                      url: "",
                      params: filters,
                      title: "导出",
                      userPermissions: []
                  }])
              }
              {
                    (disabled && declare.decAction === "edit") &&  composeBotton([{
                        type: "match",
                        icon: "copy",
                        text: "数据匹配",
                        btnType: "default",
                        userPermissions: [],
                        onClick: this.matchData
                    },{
                        type: "submit",
                        url: "",
                        params: filters,
                        userPermissions: [],
                        onSuccess: () => {
                            this.props.refreshTabs()
                        }
                    },{
                        type: "revoke",
                        url: "",
                        params: filters,
                        userPermissions: [""],
                        onSuccess: () => {
                            this.props.refreshTabs()
                        }
                    }], statusParam)
                }
              <TableTotal type={ 3 } totalSource={ totalSource } data={
                      [
                          {
                              title: "合计",
                              total: [
                                  { title: "已拆分金额", dataIndex: "" },
                                  { title: "不含税金额", dataIndex: "" },
                                  { title: "进项税", dataIndex: "" },
                                  { title: "价税合计", dataIndex: "" }
                              ]
                          }
                      ]
                  }
              />
            </div>,
            onTotalSource: totalSource => {
              this.setState({
                  totalSource
              })
            },
            scroll: {
              x: 4000,
              y: window.screen.availHeight - 400
            }
          }}
        />
      </div>
    )
  }
}


export default connect(state => ({
  userid: state.user.getIn(["personal", "id"])
}))(SelfContainedProductAssociation)