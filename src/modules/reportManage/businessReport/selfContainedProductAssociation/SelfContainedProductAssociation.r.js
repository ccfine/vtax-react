/**
 * author       : chenfeng
 * createTime   : 2018/10/12 11:23
 * description  :
*/

import React, { Component } from "react"
// import { connect } from "react-redux"
import { SearchTable, TableTotal } from "compoments"
// import { composeBotton } from 'utils'
// import createSocket from "../socket"
import TableTitle from "compoments/tableTitleWithTime"
import { fMoney } from 'utils'

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
    label: "认证所属期",
    fieldName: "authMonth",
    type: "monthPicker",
    span: 8,
    formItemStyle,
    componentProps: {
        format: "YYYY-MM"
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
    label: "发票类型",
    fieldName: "invoiceType",
    type: "select",
    span: 8,
    formItemStyle,
    options: [
      {
        text: "增值税专用发票",
        value: "s"
      },
      {
        text: "增值税普通发票",
        value:  "c"
      }
    ]
  },
  {
    label: "发票号码",
    fieldName: "invoiceNum",
    span: 8,
    formItemStyle
  },
  {
    label: "认证标记",
    fieldName: "authStatus",
    type: "select",
    span: 8,
    formItemStyle,
    options: [
      {
        text: "认证成功",
        value: "1"
      },
      {
        text: "未认证",
        value: "2"
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
    dataIndex: "productNum",
    width: "200px"
  },
  {
    title: "产品类型",
    dataIndex: "productType",
    width: "200px"
  },
  {
    title: "发票号码",
    dataIndex: "invoiceNum",
    width: "200px"
  },
  {
    title: "发票代码",
    dataIndex: "invoiceCode",
    width: "200px"
  },
  {
    title: "认证标记",
    dataIndex: "authStatus",
    render: text => {
      let t = ""
      switch (parseInt(text, 0)) {
        case 1: 
          t = "认证成功"
          break
        case 2:
          t = "认证失败"
          break
        case 0:
          t = "无需认证"
          break
        default:  
      }
      return t
    },
    width: "200px"
  },
  {
    title: "认证所属期",
    dataIndex: "authMonth",
    width: "200px"
  },
  {
    title: "拆分前发票号码",
    dataIndex: "splitInvoiceNum",
    width: "200px"
  },
  {
    title: "拆分前发票代码",
    dataIndex: "splitInvoiceCode",
    width: "200px"
  },
  {
    title: "开票日期",
    dataIndex: "month",
    width: "200px"
  },
  {
    title: "发票类型",
    dataIndex: "invoiceType",
    render: text => {
      let t = ""
      switch (text) {
        case "s": 
          t = "增值税专用发票"
          break
        case "c":
          t = "增值税普通发票"
          break
        default:  
      }
      return t
    },
    width: "200px"
  },
  {
    title: "不含税金额",
    dataIndex: "withoutTax",
    render: text => fMoney(text),
    width: "200px",
    className: "table-money",
  },
  {
    title: "税率",
    dataIndex: "taxRate",
    render:text=>text? `${text}%`: text,
    width: "100px",
    className: "table-money",
  },
  {
    title: "进项税额",
    dataIndex: "inTaxAmount",
    render: text => fMoney(text),
    width: "200px",
    className: "table-money",
  },
  {
    title: "价税合计",
    dataIndex: "totalAmount",
    render: text => fMoney(text),
    width: "200px",
    className: "table-money",
  },
  {
    title: "拆分比例",
    dataIndex: "splitProportion",
    render:text=>text? `${text}%`: text,
    width: "200px",
    className: "table-money",
  },
  {
    title: "已拆分金额",
    dataIndex: "splitAmount",
    render: text => fMoney(text),
    width: "200px",
    className: "table-money",
  },
  {
    title: "已拆分税额",
    dataIndex: "splitTaxAmount",
    render: text => fMoney(text),
    width: "200px",
    className: "table-money",
  },
  {
    title: "最新更新日期",
    dataIndex: "updateDate",
    width: "200px"
  }
]

// const apiFields = getFieldValue => [
//   {
//       label: "纳税主体",
//       fieldName: "mainId",
//       type: "taxMain",
//       span: 20,
//       fieldDecoratorOptions: {
//           rules: [{
//               required: true,
//               message: "请选择纳税主体"
//           }]
//       }
//   },
//   {
//       label: "抽取月份",
//       fieldName: "authMonth",
//       type: "monthPicker",
//       span: 20,
//       fieldDecoratorOptions: {
//           rules: [{
//               required: true,
//               message: "请选择抽取月份"
//           }]
//       }
//   }
// ]

export default class SelfContainedProductAssociation extends Component {
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
              title: <TableTitle time={ totalSource && totalSource.extractTime }>自持类产品关联进项发票</TableTitle>
            },
            url: "/ReceiptsInvoiceReport/list",
            extra: <div>
              {/* {
                  composeBotton([{
                      type: "modal",
                      url: "",
                      title: "抽数",
                      icon: "usb",
                      fields: apiFields,
                      userPermissions: [],
                      onSuccess: () => {
                          createSocket(this.props.userid)
                      }
                  }])
              } */}
              <TableTotal type={ 3 } totalSource={ totalSource } data={
                      [
                          {
                              title: "合计",
                              total: [
                                  { title: "已拆分金额", dataIndex: "splitAmount" },
                                  { title: "不含税金额", dataIndex: "withoutTax" },
                                  { title: "进项税", dataIndex: "inTaxAmount" },
                                  { title: "价税合计", dataIndex: "totalAmount" }
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
              x: 4400,
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
// }))(SelfContainedProductAssociation)