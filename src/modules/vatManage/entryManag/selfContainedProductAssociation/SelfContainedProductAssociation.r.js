/**
 * author       : chenfeng
 * createTime   : 2018/10/13 12:26
 * description  :
*/

import React, { Component } from "react"
import { connect } from "react-redux"
import { message, Modal } from "antd"
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
    fieldName: "mainId",
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
        fetchAble: (getFieldValue('mainId') && getFieldValue('mainId').key) || false,
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

const getColumns = (context, disabled) => {
  let operates = (disabled && parseInt(context.state.statusParam.status,0) ===1 )?[{
      title: "操作",
      key: "actions",
      fixed: true,
      className: "text-center",
      width: "50px",
      render: (text, record) => composeBotton([{
              type: "action",
              title: "解除匹配",
              icon: "disconnect",
              style: { color: "#f5222d"},
              userPermissions: ["2055003"],
              onSuccess: () => {
                  const modalRef = Modal.confirm({
                      title: "友情提醒",
                      content: "是否要解除匹配？",
                      okText: "确定",
                      okType: "danger",
                      cancelText: "取消",
                      onOk: () => {
                          context.deleteRecord(record.id, () => {
                              modalRef && modalRef.destroy()
                              context.props.refreshTabs()
                          })
                      },
                      onCancel () {
                          modalRef.destroy()
                      }
                  })
              }}])
  }]:[]
  return [...operates,
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
      title: "开票日期",
      dataIndex: "billingDate",
      width: "200px"
    },
    {
      title: "发票类型",
      dataIndex: "invoiceType",
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
      title: "最新更新日期",
      dataIndex: "updateDate",
      width: "200px"
    }   
  ]
}

class SelfContainedProductAssociation extends Component {
  constructor () {
    super()
    this.state = {
      tableKey: Date.now(),
      filters: {},
      totalSource: undefined,
      statusParam: ""
    }
  }

  refreshTable = () => {
    this.setState({
        tableKey: Date.now()
    })
  }

  fetchResultStatus = () => {
    requestResultStatus("", this.state.filters,result => {
        this.setState({
            statusParam: result,
        })
    })
  }

  deleteRecord = (id, cb) => {
    request.delete("")
        .then(({data}) => {
            if (data.code === 200) {
                message.success('解除成功!')
                cb && cb()
            } else {
                message.error(`解除匹配失败:${data.msg}`)
            }
        })
        .catch(err => {
            message.error(err.message)
        })
  }

  matchData = () => {
    const { filters } = this.state
    request.put("/accountReceiptsInvoice/automatic", filters)
        .then(({data}) => {
            if (data.code === 200) {
                message.success(data.msg);
                this.props.refreshTabs()
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
            columns: getColumns(this, disabled),
            cardProps: {
              title: <TableTitle time={ totalSource && totalSource.extractTime }>自持类产品关联进项的发票</TableTitle>
            },
            url: "/accountReceiptsInvoice/list",
            extra: <div>
              {
                  listMainResultStatus(statusParam)
              }
              {
                  JSON.stringify(filters) !== "{}" && composeBotton([{
                      type: "fileExport",
                      url: "/accountReceiptsInvoice/export",
                      params: filters,
                      title: "导出",
                      userPermissions: ["2051007"]
                  }])
              }
              {
                    (disabled && declare.decAction === "edit") &&  composeBotton([{
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
                            this.props.refreshTabs()
                        }
                    },{
                        type: "revoke",
                        url: "/accountReceiptsInvoice/revoke",
                        params: filters,
                        userPermissions: ["2051011"],
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
              x: 4000,
              y: window.screen.availHeight - 480 - (disabled? 50: 0) 
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