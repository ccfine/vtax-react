/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-04-08 10:18:52
 */
import React, { Component } from "react";
import { Icon, message, Button, Card } from "antd";
import {
  FileImportModal,
  FileExport,
  CardSearch,
  FetchTable
} from "../../../../compoments";
import {
  request,
  fMoney,
  getUrlParam,
  listMainResultStatus
} from "../../../../utils";
import moment from "moment";
import { withRouter } from "react-router";
const buttonStyle = {
  marginLeft: 5
};

const getColumns = context => [
  {
    title: "纳税主体",
    dataIndex: "mainName"
  },
  {
    title: "应税项目",
    dataIndex: "taxableItem"
  },
  {
    title: "计税方法",
    dataIndex: "taxMethod",
    render(text, record, index) {
      switch (text) {
        case "1":
          return "一般计税方法";
        case "2":
          return "简易计税方法";
        default:
          return text;
      }
    }
  },
  {
    title: "转出项目",
    dataIndex: "outProjectItem"
  },
  {
    title: "凭证号",
    dataIndex: "voucherNum"
  },
  {
    title: "日期",
    dataIndex: "taxDate"
  },
  {
    title: "转出税额",
    dataIndex: "outTaxAmount",
    render: text => fMoney(text),
    className: "table-money"
  }
];

class OtherBusinessInputTaxRollOut extends Component {
  state = {
    visible: false, // 控制Modal是否显示
    opid: "", // 当前操作的记录
    readOnly: false,
    updateKey: Date.now(),
    status: undefined,
    filter: undefined,
    // buttonDisabled:true,
    submitLoading: false,
    revokeLoading: false,
    dataSource: []
  };
  hideModal() {
    this.setState({ visible: false });
  }
  updateStatus = (values = this.state.filter) => {
    this.setState({ filter: values });
    let params = { ...values };
    params.authMonth = moment(params.authMonth).format("YYYY-MM");
    request
      .get("/account/income/taxout/listMain", { params: params })
      .then(({ data }) => {
        if (data.code === 200) {
          let status = {};
          if (data.data) {
            status.status = data.data.status;
            status.lastModifiedDate = data.data.lastModifiedDate;
            this.setState({ status: status, filter: values });
          }
        }
      });
  };
  commonSubmit = (url, params, action, messageInfo) => {
    this.setState({ [`${action}Loading`]: true });
    request
      .post(url, params)
      .then(({ data }) => {
        if (data.code === 200) {
          message.success(messageInfo, 4);
          this.setState({ [`${action}Loading`]: false });
          this.updateStatus();
        } else {
          message.error(data.msg, 4);
          this.setState({ [`${action}Loading`]: false });
        }
      })
      .catch(err => {
        message.error(err.message);
        this.setState({ [`${action}Loading`]: false });
      });
  };
  submit = () => {
    let params = { ...this.state.filter };
    params.authMonth = moment(params.authMonth).format("YYYY-MM");
    this.commonSubmit(
      "/account/income/taxout/submit",
      params,
      "submit",
      "提交成功"
    );
  };
  revoke = () => {
    let params = { ...this.state.filter };
    params.authMonth = moment(params.authMonth).format("YYYY-MM");
    this.commonSubmit(
      "/account/income/taxout/revoke",
      params,
      "revoke",
      "撤回提交成功"
    );
  };
  filterChange = values => {
    this.setState({ updateKey: Date.now(), filters: values });
    this.updateStatus(values);
  };
  render() {
    const { dataSource } = this.state;
    const { search } = this.props.location;
    let disabled = !!search;
    const getFields = (title, span, formItemStyle, record = {}) => [
      {
        label: "纳税主体",
        type: "taxMain",
        span,
        fieldName: "mainId",
        formItemStyle,
        componentProps: {
          disabled
        },
        fieldDecoratorOptions: {
          initialValue: (disabled && getUrlParam("mainId")) || undefined,
          rules: [
            {
              required: true,
              message: "请选择纳税主体"
            }
          ]
        }
      },
      {
        label: `${title}月份`,
        fieldName: "authMonth",
        type: "monthPicker",
        span,
        formItemStyle,
        componentProps: {
          format: "YYYY-MM",
          disabled
        },
        fieldDecoratorOptions: {
          initialValue:
            (disabled &&
              (!!search && moment(getUrlParam("authMonth"), "YYYY-MM"))) ||
            undefined,
          rules: [
            {
              required: true,
              message: `请选择${title}月份`
            }
          ]
        }
      }
    ];

    let { filter, status } = this.state,
      buttonDisabled =
        !filter || !(dataSource && dataSource.length && dataSource.length > 0),
      isSubmit = status && status.status === 2;

    // 查询参数
    let params = { ...filter };
    params.authMonth = moment(params.authMonth).format("YYYY-MM");
    return (
      <div>
        <CardSearch
          doNotSubmitDidMount={!search}
          feilds={getFields("查询", 8)}
          feildvalue={filter}
          buttonSpan={8}
          filterChange={this.filterChange}
        />
        <Card
          title="其他业务进项税额转出台账"
          extra={
            <div>
              {dataSource.length > 0 && listMainResultStatus(status)}
              <FileImportModal
                style={buttonStyle}
                url="/account/income/taxout/upload"
                title="导入"
                fields={getFields("导入", 24, {
                  labelCol: {
                    span: 6
                  },
                  wrapperCol: {
                    span: 11
                  }
                })}
                disabled={isSubmit}
                onSuccess={() => {
                  this.setState({ updateKey: Date.now() });
                }}
              />
              <FileExport
                url={`account/income/taxout/download`}
                title="下载模板"
                size="small"
                setButtonStyle={buttonStyle}
                disabled={isSubmit}
              />
              <Button
                size="small"
                style={{ marginLeft: 5 }}
                disabled={buttonDisabled || isSubmit}
                onClick={this.submit}
                loading={this.state.submitLoading}
              >
                <Icon type="check" />
                提交
              </Button>
              <Button
                size="small"
                style={{ marginLeft: 5 }}
                disabled={buttonDisabled || !isSubmit}
                onClick={this.revoke}
                loading={this.state.revokeLoading}
              >
                <Icon type="rollback" />
                撤回提交
              </Button>
            </div>
          }
          style={{ marginTop: 10 }}
        >
          <FetchTable
            doNotFetchDidMount={true}
            url="/account/income/taxout/list"
            updateKey={this.state.updateKey}
            tableProps={{
              pagination: true,
              columns: getColumns(this),
              rowKey: "id",
              onDataChange: data => {
                let hasData = data && data.length > 0;
                this.setState({
                  buttonDisabled: !hasData,
                  dataSource: data
                });
              },
              renderCount: data => {
                if (
                  data.page &&
                  data.page.records &&
                  data.page.records.length > 0
                ) {
                  return [
                    {
                      mainName: "本页合计：",
                      outTaxAmount: fMoney(data.pageOutTaxAmount),
                      id: -1
                    }
                  ];
                }
              }
            }}
            filters={params}
          />
        </Card>
      </div>
    );
  }
}
export default withRouter(OtherBusinessInputTaxRollOut);
