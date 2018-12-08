/*
 * @Author: liuchunxiu
 * @Date: 2018-04-04 17:52:53
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-08 11:13:21
 */
import React, { Component } from "react";
import { Modal, message } from "antd";
// import {connect} from 'react-redux';
import { SearchTable } from "compoments";
import PopModal from "./popModal";
import {
  request,
  fMoney,
  composeBotton,requestResultStatus
} from "utils";
import moment from "moment";

const searchFields = (disabled,declare) => {
  return [
    {
      label: "纳税主体",
      type: "taxMain",
      span: 8,
      fieldName: "main",
      componentProps: {
          labelInValue:true,
          disabled
      },
      fieldDecoratorOptions: {
        initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
        rules: [
          {
            required: true,
            message: "请选择纳税主体"
          }
        ]
      }
    },
    {
      label: "调整月份",
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
            message: "请选择调整月份"
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
          userPermissions:['1941004'],
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
          userPermissions:['1941008'],
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
    width: '75px',
    className:'text-center',
    dataIndex: "action"
  }]:[];
  return [
    ...operates
  ,
  {
    title: "利润中心",
    dataIndex: "profitCenterName",
    width:'200px',
  },
  {
    title: "项目分期",
    dataIndex: "stagesName",
    width:'200px',
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
  },
  {
    title: "调整事项",
    dataIndex: "revisionName",
    width:'150px',
  },
  // {
  //   title: "调整日期",
  //   dataIndex: "month",
  //   width:'100px',
  // },
  {
    title: "调整说明",
    dataIndex: "directions",
  },
  {
    title: "金额/税额",
    dataIndex: "amount",
    render: text => fMoney(text),
    className: "table-money",
    width:'100px',
  }];
}

class OtherRevision extends Component {
  state = {
    visible: false, // 控制Modal是否显示
    opid: "", // 当前操作的记录
    action: "add",
    updateKey: Date.now(),
    filters: undefined,
    statusParam: {},
    // totalSource:undefined,
  };
  hideModal() {
    this.setState({ visible: false });
  }
  refreshTable = () => {
    this.setState({ updateKey: Date.now() });
  };
  deleteRecord = (id,cb) => {
      request.delete(`/accountOtherRevision/delete/${id}`)
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
    requestResultStatus('',values,result=>{
      this.setState({
          statusParam: result,
      })
    })
  };
  render() {
    const { declare } = this.props;
    let disabled = !!declare;
    let handle = declare.decAction==='edit';
    let { filters={}, statusParam = {} } = this.state;
    let noSubmit = parseInt(statusParam.status,10)===1;
    return (
        <SearchTable
          doNotFetchDidMount={!disabled}
          searchOption={{
            fields: searchFields(disabled,declare),
            cardProps:{
              style:{borderTop:0}
            }
          }}
          backCondition={(filters) => {
              this.setState({
                  filters,
              },() => {
                this.updateStatus(filters);
              });
          }}
          tableOption={{
            scroll: {y:window.screen.availHeight-380-(disabled?50:0)},
            pageSize: 100,
            columns: getColumns(this,disabled && declare.decAction==='edit' && noSubmit),
            key: this.state.updateKey,
            url: `/accountOtherRevision/list${handle ? '?handle=true' : ''}`,
            cardProps: {
              title: "其他事项调整台账",
              extra: (
                <div>
                    {
                        JSON.stringify(filters)!=='{}' && composeBotton([{
                            type:'fileExport',
                            url:'accountOtherRevision/export',
                            params:filters,
                            title:'导出',
                            userPermissions:['1941007'],
                        }])
                    }
                  {
                      (disabled && declare.decAction==='edit') && composeBotton([{
                          type:'add',
                          icon:'plus',
                          userPermissions:['1941003'],
                          onClick: () => {
                            this.setState({
                              visible: true,
                              action: "add",
                              opid: undefined
                            });
                          }
                      }],statusParam)
                  }
                  {/* <TableTotal type={3} totalSource={totalSource} data={
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
                  } /> */}
                </div>
              ),
            }
          }}
        >
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
      </SearchTable>
    );
  }
}

export default OtherRevision;
