/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-17 10:35:27
 */
import React, { Component } from "react";
import { Icon, message, Button, Modal } from "antd";
// import SubmitOrRecall from "compoments/buttonModalWithForm/SubmitOrRecall.r";
import { SearchTable, TableTotal } from "compoments";
import { request, fMoney, getUrlParam, listMainResultStatus,composeBotton } from "utils";
import moment from "moment";
import { withRouter } from "react-router";
import PopModal from "./popModal";
const getColumns = context => [
    {
        title: "操作",
        className: "text-center",
        render(text, record, index) {
            return (
                <span className="table-operate">
                    <a
                        onClick={() => {
                            context.setState({
                                visible: true,
                                action: "look",
                                opid: record.id
                            });
                        }}
                    >
                        <Icon type="search" />
                    </a>
                    <a
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
                        style={{
                            color: "#f5222d"
                        }}
                        onClick={() => {
                            const modalRef = Modal.confirm({
                                title: "友情提醒",
                                content: "该删除后将不可恢复，是否删除？",
                                okText: "确定",
                                okType: "danger",
                                cancelText: "取消",
                                onOk: () => {
                                    context.deleteRecord(record.id, () => {
                                        modalRef && modalRef.destroy();
                                        context.update();
                                    });
                                },
                                onCancel() {
                                    modalRef.destroy();
                                }
                            });
                        }}
                    >
                        <Icon type="delete" />
                    </a>
                </span>
            );
        },
        fixed: "left",
        width: "75px",
        dataIndex: "action"
    },
    {
        title: "纳税主体",
        dataIndex: "mainName"
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

class UnBilledSalesNotEstate extends Component {
    state = {
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        readOnly: false,
        updateKey: Date.now(),
        status: undefined,
        filter: undefined,
        submitLoading: false,
        revokeLoading: false,
        dataSource: []
    };
    hideModal() {
        this.setState({ visible: false });
    }
    deleteRecord = (id, cb) => {
        request
            .delete(`/accountNotInvoiceUnsaleRealty/delete/${id}`)
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
        this.setState({ filter: values });
        let params = { ...values };
        params.authMonth = moment(params.authMonth).format("YYYY-MM");
        request
            .get("/accountNotInvoiceUnsaleRealty/listMain", { params: params })
            .then(({ data }) => {
                if (data.code === 200) {
                    let status = {};
                    if (data.data) {
                        status.status = data.data.status;
                        status.lastModifiedDate = data.data.lastModifiedDate;
                        this.setState({ status: status, filter: values });
                    }
                }else{
                    message.error(data.msg,4);
                }
            }).catch(err=>{
                message.error(err.message,4);
            });
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    render() {
        const { totalSource } = this.state;
        const { search } = this.props.location;
        let disabled = !!search;
        const getFields = (
            context,
            title,
            span,
            formItemStyle,
            record = {}
        ) => getFieldValue => {
            return [
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
                        initialValue:
                            (disabled && getUrlParam("mainId")) || undefined,
                        rules: [
                            {
                                required: true,
                                message: "请选择纳税主体"
                            }
                        ]
                    }
                },
                {
                    label: `期间`,
                    fieldName: "month",
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
                                (!!search &&
                                    moment(
                                        getUrlParam("authMonth"),
                                        "YYYY-MM"
                                    ))) ||
                            undefined,
                        rules: [
                            {
                                required: true,
                                message: `请选择${title}月份`
                            }
                        ]
                    }
                },
                {
                    label: "项目名称",
                    fieldName: "projectId",
                    type: "asyncSelect",
                    span,
                    formItemStyle,
                    componentProps: {
                        fieldTextName: "itemName",
                        fieldValueName: "id",
                        doNotFetchDidMount: false,
                        fetchAble: getFieldValue("mainId"),
                        url: `/project/list/${getFieldValue("mainId")}`
                    }
                },
                {
                    label: "项目分期",
                    fieldName: "stagesId",
                    type: "asyncSelect",
                    span,
                    formItemStyle,
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
        let { filter, status } = this.state,
            // buttonDisabled =
            //     !filter ||
            //     !(dataSource && dataSource.length && dataSource.length > 0),
            isSubmit = status && status.status === 2;

        return (
            <div>
                <SearchTable
                    backCondition={this.updateStatus}
                    doNotFetchDidMount={!search}
                    tableOption={{
                        key: this.state.updateKey,
                        url: "/accountNotInvoiceUnsaleRealty/list",
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
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        },
                        cardProps: {
                            title: "未开票销售台账-非地产",
                            extra: (
                                <div>
                                    {listMainResultStatus(status)}
                                    <Button
                                        size="small"
                                        style={{ marginRight: 5 }}
                                        disabled={isSubmit}
                                        onClick={() => {
                                            this.setState({
                                                visible: true,
                                                action: "add",
                                                opid: undefined
                                            });
                                        }}
                                    >
                                        <Icon type="plus" />新增
                                    </Button>
                                    {
                                        composeBotton([{
                                            type:'reset',
                                            url:'/accountNotInvoiceUnsaleRealty/reset',
                                            params:{...filter,authMonth:filter && filter.month},
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'submit',
                                            url:'/accountNotInvoiceUnsaleRealty/submit',
                                            params:{...filter,taxMonth:filter && filter.month},
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            url:'/accountNotInvoiceUnsaleRealty/revoke',
                                            params:{...filter,taxMonth:filter && filter.month},
                                            onSuccess:this.refreshTable,
                                        }],status)
                                    }
                                    {/* <SubmitOrRecall
                                        type={1}
                                        disabled={buttonDisabled || isSubmit}
                                        url="/accountNotInvoiceUnsaleRealty/submit"
                                        onSuccess={this.refreshTable}
                                        initialValue={{...filter,taxMonth:filter && filter.month}}
                                    />
                                    <SubmitOrRecall
                                        type={2}
                                        disabled={buttonDisabled || !isSubmit}
                                        url="/accountNotInvoiceUnsaleRealty/revoke"
                                        onSuccess={this.refreshTable}
                                        initialValue={{...filter,taxMonth:filter && filter.month}}
                                    /> */}
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
                        fields: getFields(this, "查询", 6)
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
export default withRouter(UnBilledSalesNotEstate);
