/*
 * @Author: liuchunxiu 
 * @Date: 2018-04-04 11:35:59 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-19 16:30:57
 */
import React, { Component } from "react";
import { Icon, message, Modal } from "antd";
import {SearchTable,TableTotal} from "compoments";
import { request, fMoney, getUrlParam, listMainResultStatus,composeBotton } from "utils";
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
        this.setState({ filter: values });
        let params = { ...values };
        params.authMonth = moment(params.authMonth).format("YYYY-MM");
        request
            .get("/account/income/taxout/listMain", { params: params })
            .then(({ data }) => {
                if (data.code === 200) {
                    if (data.data) {
                        this.setState({ statusParam: data.data, filter: values });
                    }
                }
            });
    };
    refreshTable = () => {
        this.setState({ updateKey: Date.now() });
    };
    render() {
        const { totalSource } = this.state;
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

        let { filters, statusParam } = this.state;
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
                        cardProps: {
                            title: "其他业务进项税额转出台账",
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
                                            url:'/account/income/taxout/submit',
                                            monthFieldName:"authMonth",
                                            params:filters,
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            monthFieldName:"authMonth",
                                            url:'/account/income/taxout/revoke',
                                            params:filters,
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
