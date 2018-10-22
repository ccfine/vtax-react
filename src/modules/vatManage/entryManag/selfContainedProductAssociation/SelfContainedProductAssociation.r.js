/**
 * author       : chenfeng
 * createTime   : 2018/10/13 12:26
 * description  :
*/

import React, { Component } from "react"
import { message } from "antd"
import { SearchTable, TableTotal } from "compoments"
import moment from "moment"
import { listMainResultStatus, composeBotton, request, requestResultStatus } from "utils"
import TableTitle from "compoments/tableTitleWithTime"

const formItemStyle = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const searchFields =  (disabled,declare) => (getFieldValue) => [
  {
    label: "纳税主体",
    fieldName: "main",
    type: "taxMain",
    span: 8,
    formItemStyle,
    componentProps:{
      labelInValue:true,
      disabled
    },
    fieldDecoratorOptions: {
        initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
        format: "YYYY-MM",
        disabled
    },
    fieldDecoratorOptions: {
      initialValue: (disabled && moment(declare["authMonth"], "YYYY-MM")) || undefined,
      rules: [
          {
              required: true,
              message: '请选择查询期间'
          }
      ]
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
        fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
        url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
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
      title: "认证月份",
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
      dataIndex: "billingDate",
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
      width: "200px"
    },
    {
      title: "税率",
      dataIndex: "taxRate",
      width: "100px"
    },
    {
      title: "进项税额",
      dataIndex: "inTaxAmount",
      width: "200px"
    },
    {
      title: "价税合计",
      dataIndex: "totalAmount",
      width: "200px"
    },
    {
      title: "拆分比例",
      dataIndex: "splitProportion",
      width: "200px"
    },
    {
      title: "已拆分金额",
      dataIndex: "splitAmount",
      width: "200px"
    },
    {
      title: "已拆分税额",
      dataIndex: "splitTaxAmount",
      width: "200px"
    },
    {
      title: "最新更新日期",
      dataIndex: "updateDate",
      width: "200px"
    },
    {
      title: "匹配的不动产类型",
      dataIndex: "matchingStatus",
      render: text => {
        let t = ""
        switch (parseInt(text, 0)) {
          case 0: 
            t = "未匹配"
            break
          case 1:
            t = "单独新建"
            break
          case 2:
            t = "自建转自用"
            break
          default:  
        }
        return t
      },
      width: "200px"
    }   
]

export default class SelfContainedProductAssociation extends Component {
  constructor () {
    super()
    this.state = {
      tableKey: Date.now(),
      filters: {},
      totalSource: undefined,
      statusParam: {}
    }
  }

  refreshTabs = () => {
    this.setState({
        tableKey: Date.now()
    })
  }

  fetchResultStatus = () => {
    requestResultStatus("/accountReceiptsInvoice/listMain", this.state.filters,result => {
        this.setState({
            statusParam: result,
        })
    })
  }

  // deleteRecord = (id, cb) => {
  //   request.delete("")
  //       .then(({data}) => {
  //           if (data.code === 200) {
  //               message.success('解除成功!')
  //               cb && cb()
  //           } else {
  //               message.error(`解除匹配失败:${data.msg}`)
  //           }
  //       })
  //       .catch(err => {
  //           message.error(err.message)
  //       })
  // }

  matchData = () => {
    const { filters } = this.state
    request.put("/accountReceiptsInvoice/automatic", filters)
        .then(({data}) => {
            if (data.code === 200) {
                message.success(data.data);
                this.refreshTabs()
            } else {
                message.error(`数据匹配失败:${data.msg}`)
            }
        })
        .catch(err => {
            message.error(err.message)
        })
  }

  render () {
    const { tableKey, totalSource, statusParam, filters } = this.state
    const { declare } = this.props
    let disabled = !!declare 
    return (
      <div className="oneline">
        <SearchTable 
          doNotFetchDidMount={ !disabled }
          searchOption={{
            fields: searchFields(disabled, declare)
          }}
          backCondition={ filters => {
            this.setState({
                filters,
            }, () => {
                this.fetchResultStatus()
            })
          }}
          tableOption={{
            key: tableKey,
            pageSize: 100,
            columns,
            cardProps: {
              title: <TableTitle time={ totalSource && totalSource.extractTime }>自持类产品关联进项发票</TableTitle>
            },
            url: "/accountReceiptsInvoice/list",
            extra: <div>
              {
                  listMainResultStatus(statusParam)
              }
              {
                  JSON.stringify(filters) !== "{}" && composeBotton([{
                      type: "fileExport",
                      url: "accountReceiptsInvoice/export",
                      params: filters,
                      title: "导出",
                      userPermissions: ["2051007"]
                  }])
              }
              {
                    (disabled && declare.decAction === "edit") &&  composeBotton([
                    {
                        type:'reset',
                        url:'/accountReceiptsInvoice/reset',
                        params:filters,
                        userPermissions:["2051009"],
                        onSuccess:this.refreshTabs,
                    },
                    {
                        type: "match",
                        icon: "copy",
                        text: "数据匹配",
                        btnType: "default",
                        userPermissions: ["2055002"],
                        onClick: this.matchData
                    },{
                        type: "submit",
                        url: "/accountReceiptsInvoice/submit",
                        params: filters,
                        userPermissions: ["2051010"],
                        onSuccess: () => {
                            this.refreshTabs()
                        }
                    },{
                        type: "revoke",
                        url: "/accountReceiptsInvoice/revoke",
                        params: filters,
                        userPermissions: ["2051011"],
                        onSuccess: () => {
                            this.refreshTabs()
                        }
                    }], statusParam)
                }
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
              x: 4600,
              y: window.screen.availHeight - 480 - (disabled? 50: 0) 
            }
          }}
        />
      </div>
    )
  }
}
