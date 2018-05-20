/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 17:52:53 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-20 11:26:04
 */
import React, { Component } from "react";
import { Modal, message,Icon } from "antd";
import { SearchTable } from "compoments";
import PopModal from "./popModal";
import {
  request,
  fMoney,
  getUrlParam,
  listMainResultStatus,
  composeBotton,requestResultStatus
} from "../../../../utils";
import { withRouter } from "react-router";
import moment from "moment";

const searchFields = disabled => {
  return [
    {
      label: "纳税主体",
      type: "taxMain",
      span: 8,
      fieldName: "mainId",
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
      label: "调整日期",
      fieldName: "authMonth",
      type: "monthPicker",
      span: 8,
      componentProps: {
        format: "YYYY-MM",
        disabled
      },
      fieldDecoratorOptions: {
        initialValue:
          (disabled && moment(getUrlParam("authMonth"), "YYYY-MM")) ||
          undefined,
        rules: [
          {
            required: true,
            message: "请选择调整日期"
          }
        ]
      }
    }
  ];
};
const getColumns = context => [
  {
    title: "操作",
    render(text, record, index) {
      return (
        <span className="table-operate">
          <a
            title="编辑"
            onClick={() => {
              context.setState({
                visible: true,
                action: "modify",
                opid: record.id
              });
            }}
          >
              <Icon type="edit" />
          </a>
          <a
            title="删除"
            style={{
                color: "#f5222d"
            }}
            onClick={()=>{
              const modalRef = Modal.confirm({
                  title: '友情提醒',
                  content: '该删除后将不可恢复，是否删除？',
                  okText: '确定',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk:()=>{
                      context.deleteRecord(record.id,()=>{
                          modalRef && modalRef.destroy();
                          context.refreshTable()
                      })
                  },
                  onCancel() {
                      modalRef.destroy()
                  },
              });
            }}
          >
              <Icon type="delete" />
          </a>
      </span>
      );
    },
    fixed: "left",
    width: "50px",
    dataIndex: "action"
  },
  {
    title: "纳税主体",
    dataIndex: "mainName",
    render:(text,record)=>{
      return <a title="查看" onClick={() => {
                context.setState({
                  visible: true,
                  action: "look",
                  opid: record.id
                });
              }} >
              {text}
            </a>
    }
  },
  {
    title: "调整日期",
    dataIndex: "adjustDate"
  },
  {
    title: "项目",
    dataIndex: "project",
    render(text, record, index) {
      switch (text) {
        case "1":
          return "涉税调整";
        case "2":
          return "纳税检查调整";
        default:
          return text;
      }
    }
  },
  {
    title: "应税项目",
    dataIndex: "taxableProjectName"
  },
  {
    title: "业务类型",
    dataIndex: "taxRateName"
  },
  {
    title: "税率",
    dataIndex: "taxRate",
    render: text => (text ? `${text}%` : text),
    width: "50px"
  },
  {
    title: "销售额（不含税）",
    dataIndex: "amountWithoutTax",
    render: text => fMoney(text),
    className: "table-money"
  },
  {
    title: "销项（应纳）税额",
    dataIndex: "taxAmountWithTax",
    render: text => fMoney(text),
    className: "table-money"
  },
  {
    title: "服务、不动产和无形资产扣除项目本期实际扣除金额（含税）",
    dataIndex: "deductionAmount",
    render: text => fMoney(text),
    className: "table-money",
    width: "100px"
  },
  {
    title: "调整原因",
    dataIndex: "adjustReason",
    render(text, record, index) {
      switch (text) {
        case "1":
          return "尾款调整";
        case "2":
          return "非地产业务（租金，水电费等）相关调整";
        case "3":
          return "未开票收入差异调整";
        default:
          return text;
      }
    }
  },
  {
    title: "具体调整说明",
    dataIndex: "adjustDescription"
  }
];

class OtherTaxAdjustment extends Component {
  state = {
    visible: false, // 控制Modal是否显示
    opid: "", // 当前操作的记录
    action: "add",
    updateKey: Date.now(),
    filters: undefined,
    statusParam: {},
  };
  hideModal() {
    this.setState({ visible: false });
  }
  refreshTable = () => {
    this.setState({ updateKey: Date.now() });
  };
  deleteRecord = (id,cb) => {
      request.delete(`/account/output/othertax/delete/${id}`)
          .then(({data})=>{
              if(data.code===200){
                  message.success("删除成功", 4);
                  cb && cb()
              }else{
                  message.error(data.msg, 4);
              }
          })
          .catch(err => {
              message.error(err.message);
          });
  }
  updateStatus = (values) => {
    requestResultStatus('/account/output/othertax/main/listMain',values,result=>{
      this.setState({
          statusParam: result,
      })
    })
  };
  componentDidMount() {
    const { search } = this.props.location;
    if (!!search) {
      this.refreshTable();
    }
  }
  render() {
    const { search } = this.props.location;
    let disabled = !!search;
    let { filters={}, statusParam } = this.state;
    return (
      <div>
        <SearchTable
          doNotFetchDidMount={true}
          searchOption={{
            fields: searchFields(disabled)
          }}
          tableOption={{
            scroll: { x: "150%" },
            pageSize: 10,
            columns: getColumns(this),
            key: this.state.updateKey,
            url: "/account/output/othertax/list",
            onSuccess:(params)=>{
              this.setState({ filters: params });
              this.updateStatus(params);
            },
            cardProps: {
              title: "其他涉税调整台账",
              extra: (
                <div>
                  {listMainResultStatus(statusParam)}
                  {
                      JSON.stringify(filters) !== "{}" && composeBotton([{
                          type:'add',
                          onClick: () => {
                            this.setState({
                              visible: true,
                              action: "add",
                              opid: undefined
                            });
                          }
                      },{
                          type:'submit',
                          url:'/account/output/othertax/main/submit',
                          params:filters,
                          onSuccess:this.refreshTable
                      },{
                          type:'revoke',
                          url:'/account/output/othertax/main/restore',
                          params:filters,
                          onSuccess:this.refreshTable,
                      }],statusParam)
                  }
                </div>
              )
            }
          }}
        />
        <PopModal
          visible={this.state.visible}
          action={this.state.action}
          hideModal={() => {
            this.hideModal();
          }}
          id={this.state.opid}
          update={this.refreshTable}
        />
      </div>
    );
  }
}
export default withRouter(OtherTaxAdjustment);
