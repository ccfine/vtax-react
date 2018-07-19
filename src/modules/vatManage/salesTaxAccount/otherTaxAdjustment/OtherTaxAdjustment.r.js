/*
 * @Author: liuchunxiu
 * @Date: 2018-04-04 17:52:53
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-19 18:42:36
 */
import React, { Component } from "react";
import { Modal, message } from "antd";
import { SearchTable,TableTotal } from "compoments";
import PopModal from "./popModal";
import {
  request,
  fMoney,
  listMainResultStatus,
  composeBotton,requestResultStatus
} from "utils";
import moment from "moment";

const searchFields = (disabled,declare) => {
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
        initialValue: (disabled && declare["mainId"]) || undefined,
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
          (declare && moment(declare["authMonth"], "YYYY-MM")) ||
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
const getColumns = (context,hasOperate) => {
  let operates = hasOperate?[{
    title: "操作",
    render(text, record, index) {
        return composeBotton([{
          type:'action',
          icon:'edit',
          title:'编辑',
          userPermissions:['1311004'],
          onSuccess:()=>context.setState({
            visible: true,
            action: "modify",
            opid: record.id
          })
      },{
          type:'action',
          icon:'delete',
          title:'删除',
          style:{color: "#f5222d"},
          userPermissions:['1311008'],
          onSuccess:() => {
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
          }
      }])
    },
    fixed: "left",
    width: 75,
    dataIndex: "action"
  }]:[];
  return [
    ...operates
  ,
  {
    title: "纳税主体",
    dataIndex: "mainName",
    render:(text,record)=>{
      return <a title='查看详情' onClick={() => {
                context.setState({
                  visible: true,
                  action: "look",
                  opid: record.id
                });
              }} >
              {text}
            </a>
    },
    width:'12%',
  },
  {
    title: "调整日期",
    dataIndex: "adjustDate",
    width:75,
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
    },
    width:90,
  },
  {
    title: "应税项目",
    dataIndex: "taxableProjectName",
    width:'10%',
  },
  {
    title: "业务类型",
    dataIndex: "taxRateName",
    width:'10%',
  },
  {
    title: "税率",
    dataIndex: "taxRate",
    render: text => (text ? `${text}%` : text),
    width:50,
  },
  {
    title: "销售额（不含税）",
    dataIndex: "amountWithoutTax",
    render: text => fMoney(text),
    className: "table-money",
    width:'7%',
  },
  {
    title: "销项（应纳）税额",
    dataIndex: "taxAmountWithTax",
    render: text => fMoney(text),
    className: "table-money",
    width:'7%',
  },
  {
    title: "服务、不动产和无形资产扣除项目本期实际扣除金额（含税）",
    dataIndex: "deductionAmount",
    render: text => fMoney(text),
    className: "table-money",
    width:'12%',
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
        case "4":
          return "其他涉税调整";
        case "5":
          return "纳税检查调整";
        default:
          return text;
      }
    },
    width:180,
  },
  {
    title: "具体调整说明",
    dataIndex: "adjustDescription"
  }
];
}

class OtherTaxAdjustment extends Component {
  state = {
    visible: false, // 控制Modal是否显示
    opid: "", // 当前操作的记录
    action: "add",
    updateKey: Date.now(),
    filters: undefined,
    statusParam: {},
    totalSource:undefined,
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
    requestResultStatus('/account/output/othertax/listMain',values,result=>{
      this.setState({
          statusParam: result,
      })
    })
  };
  render() {
    const { declare } = this.props;
    let disabled = !!declare;
    let { filters={}, statusParam = {},totalSource } = this.state;
    let noSubmit = parseInt(statusParam.status,10)===1;
    return (
      <div>
        <SearchTable
          doNotFetchDidMount={!disabled}
          searchOption={{
            fields: searchFields(disabled,declare),
            cardProps:{
              style:{borderTop:0}
            }
          }}
          tableOption={{
            scroll: { x: 1500,y:window.screen.availHeight-380-(disabled?50:0) },
            pageSize: 100,
            columns: getColumns(this,disabled && declare.decAction==='edit' && noSubmit),
            key: this.state.updateKey,
            url: "/account/output/othertax/list",
            onSuccess:(params)=>{
              this.setState({ filters: params });
              this.updateStatus(params);
            },
            onTotalSource: totalSource => {
              this.setState({
                  totalSource
              });
            },
            cardProps: {
              title: "其他涉税调整台账",
              extra: (
                <div>
                  {listMainResultStatus(statusParam)}
                  {
                      (disabled && declare.decAction==='edit') && composeBotton([{
                          type:'add',
                          icon:'plus',
                          userPermissions:['1311003'],
                          onClick: () => {
                            this.setState({
                              visible: true,
                              action: "add",
                              opid: undefined
                            });
                          }
                      },{
                          type:'submit',
                          url:'/account/output/othertax/submit',
                          params:filters,
                          userPermissions:['1311010'],
                          onSuccess:this.refreshTable
                      },{
                          type:'revoke',
                          url:'/account/output/othertax/restore',
                          params:filters,
                          userPermissions:['1311011'],
                          onSuccess:this.refreshTable,
                      }],statusParam)
                  }
                  <TableTotal type={3} totalSource={totalSource} data={
                      [
                          {
                              title:'合计',
                              total:[
                                  {title: '销售额（不含税）', dataIndex: 'amount'},
                                  {title: '销项（应纳）税额', dataIndex: 'taxAmount'},
                                  {title: '服务、不动产和无形资产扣除项目本期实际扣除金额（含税）', dataIndex: 'deductionAmount'},
                              ],
                          }
                      ]
                  } />
                </div>
              ),
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
          declare={declare}
        />
      </div>
    );
  }
}

export default OtherTaxAdjustment;
