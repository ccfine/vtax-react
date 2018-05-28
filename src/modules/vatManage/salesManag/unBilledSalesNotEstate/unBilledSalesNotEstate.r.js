/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-28 15:40:37
 */
import React, { Component } from "react";
import {connect} from 'react-redux'
import { message, Modal } from "antd";
import { SearchTable, TableTotal } from "compoments";
import { request, fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import moment from "moment";
import PopModal from "./popModal";

const getFields = (disabled,declare) => getFieldValue => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            span:6,
            fieldName: "mainId",
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && declare.mainId) || undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择纳税主体"
                    }
                ]
            }
        },
        {
            label: '期间',
            fieldName: "authMonth",
            type: "monthPicker",
            span:6,
            componentProps: {
                format: "YYYY-MM",
                disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                    (disabled && moment(declare.authMonth,"YYYY-MM")) || undefined,
                rules: [
                    {
                        required: true,
                        message: `请选择查询月份`
                    }
                ]
            }
        },
        {
            label: "项目名称",
            fieldName: "projectId",
            type: "asyncSelect",
            span:6,
            componentProps: {
                fieldTextName: "itemName",
                fieldValueName: "id",
                doNotFetchDidMount: true,
                fetchAble: getFieldValue("mainId"),
                url: `/project/list/${getFieldValue("mainId")}`
            }
        },
        {
            label: "项目分期",
            fieldName: "stagesId",
            type: "asyncSelect",
            span:6,
            componentProps: {
                fieldTextName: "itemName",
                fieldValueName: "id",
                doNotFetchDidMount: true,
                fetchAble: getFieldValue("projectId"),
                url: `/project/stages/${getFieldValue("projectId") ||
                    ""}`
            }
        }
    ];
};
const getColumns = (context,hasOperate) => {
    let operates = hasOperate?[{
        title: "操作",
        className: "text-center",
        render(text, record, index) {
            return composeBotton([{
                type:'action',
                icon:'edit',
                title:'编辑',
                userPermissions:[],
                onSuccess:() => {
                    context.setState({
                        visible: true,
                        action: "modify",
                        opid: record.id
                    });
                }
            },{
                type:'action',
                icon:'delete',
                title:'删除',
                style:{color: "#f5222d"},
                userPermissions:[],
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
                    })
                }
            }])
        },
        fixed: "left",
        width: "50px",
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
        }
    },
    {
        title: "项目名称",
        dataIndex: "projectName"
    },
    {
        title: "项目分期代码",
        dataIndex: "stagesId"
    },
    {
        title: "项目分期名称",
        dataIndex: "stagesName"
    },
    {
        title: "科目代码",
        dataIndex: "creditSubjectCode"
    },
    {
        title: "科目名称",
        dataIndex: "creditSubjectName"
    },
    {
        title: "金额",
        dataIndex: "creditAmount",
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        render: text => `${text}${text ? "%" : ""}`
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className: "table-money"
    }
];
}

class UnBilledSalesNotEstate extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        statusParam: {},
        filters: undefined,
    };
    hideModal() {
        this.setState({ visible: false });
    }
    deleteRecord = (id, cb) => {
        request
            .delete(`/account/notInvoiceUnSale/realty/delete/${id}`)
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
        this.setState({ filters: values });
        requestResultStatus('/account/notInvoiceUnSale/realty/listMain',values,result=>{
            this.setState({
                statusParam: result,
            })
        })
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    render() {
        let { updateKey, filters={}, statusParam={},totalSource } = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            noSubmit = parseInt(statusParam.status,10)!==2;
        return (
            <div>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    tableOption={{
                        key: updateKey,
                        url: "/account/notInvoiceUnSale/realty/list",
                        pagination: true,
                        columns: getColumns(this, noSubmit && disabled && declare.decAction==='edit'),
                        rowKey: "id",
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        onSuccess:this.updateStatus,
                        cardProps: {
                            title: "未开票销售台账-非地产",
                            extra: (
                                <div>
                                    {listMainResultStatus(statusParam)}
                                    {
                                        (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'add',
                                            userPermissions:[],
                                            onClick: () => {
                                                this.setState({
                                                    visible: true,
                                                    action: "add",
                                                    opid: undefined
                                                });
                                            }
                                        },{
                                            type:'reset',
                                            url:'/account/notInvoiceUnSale/realty/reset',
                                            params:filters,
                                            userPermissions:[],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'submit',
                                            url:'/account/notInvoiceUnSale/realty/submit',
                                            params:filters,
                                            userPermissions:[],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            url:'/account/notInvoiceUnSale/realty/revoke',
                                            params:filters,
                                            userPermissions:[],
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
                                                        title: "金额",
                                                        dataIndex:
                                                            "pageCreditAmount"
                                                    },
                                                    {
                                                        title: "税额",
                                                        dataIndex:
                                                            "pageTaxAmount"
                                                    },
                                                    {
                                                        title: "价税合计",
                                                        dataIndex:
                                                            "pageTotalAmount"
                                                    }
                                                ]
                                            },
                                            {
                                                title: "总计",
                                                total: [
                                                    {
                                                        title:
                                                            "非地产财务系统未开票收入金额",
                                                        dataIndex:
                                                            "allunAmount"
                                                    },
                                                    {
                                                        title:
                                                            "非地产开票销售收入金额",
                                                        dataIndex:
                                                            "allamount"
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
}))(UnBilledSalesNotEstate)
