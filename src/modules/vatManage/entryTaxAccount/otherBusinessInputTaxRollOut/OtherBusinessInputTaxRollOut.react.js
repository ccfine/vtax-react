/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-15 10:38:41
 */
import React, { Component } from "react";
import { Icon, message, Button, Modal } from "antd";
import SubmitOrRecall from "compoments/buttonModalWithForm/SubmitOrRecall.r";
import {
    SearchTable,
    TableTotal
} from "compoments";
import { request, fMoney, getUrlParam, listMainResultStatus } from "utils";
import moment from "moment";
import { withRouter } from "react-router";
import PopModal from "./popModal";
const getColumns = context => [
    {
        title: "操作",
        className:'text-center',
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
                            color: "#f5222d",
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
        title: "应税项目",
        dataIndex: "taxableItemName"
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
        dataIndex: "outProjectName"
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
    update = () => {
        this.setState({ updateKey: Date.now() });
    };
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
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    filterChange = values => {
        this.setState({ updateKey: Date.now(), filters: values });
        this.updateStatus(values);
    };
    render() {
        const { dataSource, totalSource } = this.state;
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
                            (!!search &&
                                moment(getUrlParam("authMonth"), "YYYY-MM"))) ||
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
                !filter ||
                !(dataSource && dataSource.length && dataSource.length > 0),
            isSubmit = status && status.status === 2;

        // 查询参数
        let params = { ...filter };
        params.authMonth = moment(params.authMonth).format("YYYY-MM");
        return (
            <div>
                <SearchTable
                    backCondition={this.updateStatus}
                    doNotFetchDidMount={!search}
                    tableOption={{
                        key: this.state.updateKey,
                        url: "/account/income/taxout/list",
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
                            title: "其他业务进项税额转出台账",
                            extra: (
                                <div>
                                    {dataSource.length > 0 &&
                                        listMainResultStatus(status)}
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
                                    <SubmitOrRecall
                                        type={1}
                                        disabled={buttonDisabled || isSubmit}
                                        url="/account/income/taxout/submit"
                                        onSuccess={this.refreshTable}
                                        monthFieldName="authMonth"
                                        initialValue={filter}
                                    />
                                    <SubmitOrRecall
                                        type={2}
                                        disabled={buttonDisabled || !isSubmit}
                                        url="/account/income/taxout/revoke"
                                        onSuccess={this.refreshTable}
                                        monthFieldName="authMonth"
                                        initialValue={filter}
                                    />
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
                        fields: getFields("查询", 8)
                    }}
                />
                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => {
                        this.hideModal();
                    }}
                    id={this.state.opid}
                    update={this.update}
                />
            </div>
        );
    }
}
export default withRouter(OtherBusinessInputTaxRollOut);
