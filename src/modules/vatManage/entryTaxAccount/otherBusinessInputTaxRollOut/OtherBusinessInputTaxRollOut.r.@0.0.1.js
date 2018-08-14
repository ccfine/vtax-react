/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-11 16:47:47
 */
import React, { Component } from "react";
import {connect} from 'react-redux';
import { message, Modal } from "antd";
import {SearchTable,TableTotal} from "compoments";
import { request, fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import moment from "moment";
import PopModal from "./popModal";
const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const getFields = (disabled,declare) => [
    {
        label: "纳税主体",
        type: "taxMain",
        span:8,
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
        label: `查询月份`,
        fieldName: "authMonth",
        type: "monthPicker",
        span:8,
        componentProps: {
            format: "YYYY-MM",
            disabled
        },
        fieldDecoratorOptions: {
            initialValue:
                (disabled && moment(declare["authMonth"], "YYYY-MM")) ||
                undefined,
            rules: [
                {
                    required: true,
                    message: `请选择查询月份`
                }
            ]
        }
    }
];

const getColumns = (context,hasOperate) => {
    let operates = hasOperate?[
        {
            title: "操作",
            className:'text-center',
            render(text, record, index) {
                return composeBotton([{
                    type:'action',
                    title:'编辑',
                    icon:'edit',
                    userPermissions:['1401004'],
                    onSuccess:() => {
                        context.setState({
                            visible: true,
                            action: "modify",
                            opid: record.id
                        })
                    }
                },{
                    type:'action',
                    title:'删除',
                    icon:'delete',
                    userPermissions:['1401008'],
                    style:{color: "#f5222d"},
                    onSuccess:() => {
                        const modalRef = Modal.confirm({
                            title: "友情提醒",
                            content: "该删除后将不可恢复，是否删除？",
                            okText: "确定",
                            okType: "danger",
                            cancelText: "取消",
                            onOk: () => {
                                context.deleteRecord(record.id, () => {
                                    modalRef && modalRef.destroy();
                                    context.refreshTable();
                                });
                            },
                            onCancel() {
                                modalRef.destroy();
                            }
                        });
                    }
                }])
            },
            fixed: "left",
            width: "75px",
            dataIndex: "action"
        }]:[]
    return [
    ...operates
    ,
    {
        title: "纳税主体",
        dataIndex: "mainName",
        render: (text, record) => (
            <span
                title="查看详情"
                style={{
                    ...pointerStyle,
                    marginLeft: 5
                }}
                onClick={() => {
                    context.setState({
                        visible: true,
                        action: "look",
                        opid: record.id
                    });
                }}
            >
                {text}
            </span>
        ),
    },
    {
        title: "应税项目",
        dataIndex: "taxableItemName",
        width:'16%',
    },
    {
        title: "计税方法",
        dataIndex: "taxMethod",
        render(text, record, index) {
            let res = "";
            switch (parseInt(text, 10)) {
                case 1:
                    res = "一般计税方法";
                    break;
                case 2:
                    res = "简易计税方法";
                    break;
                default:
            }
            return res;
        },
        width:80,
    },
    {
        title: "转出项目",
        dataIndex: "outProjectName",
        width:'16%',
    },
    {
        title: "凭证号",
        dataIndex: "voucherNum",
        width:'15%',
    },
    {
        title: "期间",
        dataIndex: "taxDate",
        width:75,
    },
    {
        title: "转出税额",
        dataIndex: "outTaxAmount",
        render: text => fMoney(text),
        className: "table-money",
        width:'10%',
    }
];
}

class OtherBusinessInputTaxRollOut extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        statusParam: undefined,
        filters: {},
    };
    hideModal() {
        this.setState({ visible: false });
    }
    deleteRecord = (id, cb) => {
        request
            .delete(`/account/income/taxout/delete/${id}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    message.success("删除成功", 4);
                    cb && cb();
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    };
    updateStatus = (values) => {
        requestResultStatus('/account/income/taxout/listMain',values,result=>{
            this.setState({
                statusParam: result,
            })
        })
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    render() {
        const { totalSource } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        
        let { filters, statusParam } = this.state;
        const disabled1 = statusParam && parseInt(statusParam.status, 0) === 2;
        return (
            <div>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    tableOption={{
                        key: this.state.updateKey,
                        url: "/account/income/taxout/list",
                        // pagination: true,
                        columns: getColumns(this,!disabled1 && disabled && declare.decAction==='edit'),
                        rowKey: "id",
                        onSuccess:params=>{
                          this.setState({
                              filters:params
                          });  
                          this.updateStatus(params);
                        },
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-380,
                        },
                        cardProps: {
                            title: "其他类型进项税额转出台账",
                            extra: (
                                <div>
                                    {listMainResultStatus(statusParam)}
                                    {
                                         (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'add',
                                            icon:'plus',
                                            userPermissions:['1401003'],
                                            onClick: () => {
                                            this.setState({
                                                visible: true,
                                                action: "add",
                                                opid: undefined
                                            });
                                            }
                                        },{
                                            type:'submit',
                                            url:'/account/income/taxout/submit',
                                            // monthFieldName:"authMonth",
                                            params:filters,
                                            userPermissions:['1401010'],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            // monthFieldName:"authMonth",
                                            url:'/account/income/taxout/revoke',
                                            params:filters,
                                            userPermissions:['1401011'],
                                            onSuccess:this.refreshTable,
                                        }],statusParam)
                                    }
                                    <TableTotal
                                        type={3}
                                        totalSource={totalSource}
                                        data={[
                                            {
                                                title: "本页合计",
                                                total: [
                                                    {
                                                        title: "转出税额",
                                                        dataIndex:
                                                            "pageOutTaxAmount"
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                </div>
                            )
                        }
                    }}
                    searchOption={{
                        fields: getFields(disabled,declare)
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

export default connect(state=>({
    declare:state.user.get('declare')
  }))(OtherBusinessInputTaxRollOut);
