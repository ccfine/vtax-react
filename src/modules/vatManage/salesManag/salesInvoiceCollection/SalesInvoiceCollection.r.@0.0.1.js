/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from "react";
import { Modal, message } from "antd";
import { SearchTable, TableTotal } from "compoments";
import { request, fMoney, getUrlParam, listMainResultStatus,composeBotton } from "utils";
import PopModal from "./popModal";
import { withRouter } from "react-router";
import moment from "moment";

const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const formItemStyle = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const fields=[
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:11
            }
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }
];
const searchFields = disabled => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            fieldName: "mainId",
            span: 6,
            componentProps: {
                disabled
            },
            formItemStyle,
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
            label: "开票月份",
            type: "monthPicker",
            formItemStyle,
            span: 6,
            fieldName: "billingDate",
            componentProps: {
                disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                    (disabled && moment(getUrlParam("authMonth"), "YYYY-MM")) ||
                    undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择开票月份"
                    }
                ]
            }
        },
        {
            label: "发票号码",
            type: "input",
            fieldName: "invoiceNum",
            span: 6,
            formItemStyle,
            fieldDecoratorOptions: {},
            componentProps: {}
        },
        {
            label: "税率",
            type: "numeric",
            span: 6,
            formItemStyle,
            fieldName: "taxRate",
            componentProps: {
                valueType: "int"
            },
            fieldDecoratorOptions: {}
        },
        {
            label: "发票类型",
            fieldName: "invoiceType",
            span: 6,
            formItemStyle,
            type: "select",
            options: [
                {
                    text: "专票",
                    value: "s"
                },
                {
                    text: "普票",
                    value: "c"
                }
            ]
        }
    ];
};
const getColumns = context => [
    {
        title: "操作",
        key: "actions",
        render: (text, record) => (
            <span>
                {
                    parseInt(context.state.dataStatus, 0) === 1 && (
                        <span
                            style={pointerStyle}
                            onClick={() => {
                                const type = parseInt(record.sourceType, 0);
                                if (type !== 1) {
                                    Modal.warning({
                                        title: "友情提示",
                                        content: "只能修改手工新增的数据"
                                    });
                                    return false;
                                }

                                context.setState(
                                    {
                                        modalConfig: {
                                            type: "edit",
                                            id: record.id
                                        }
                                    },
                                    () => {
                                        context.toggleModalVisible(true);
                                    }
                                );
                            }}
                        >
                                    编辑
                                </span>
                    )
                }
        </span>
        ),
        fixed: "left",
        width: "70px",
        className:'text-center'
    },
    {
        title: "纳税主体",
        dataIndex: "mainName",
        render: (text, record) => (
            <span
                style={{
                    ...pointerStyle,
                    marginLeft: 5
                }}
                onClick={() => {
                    context.setState(
                        {
                            modalConfig: {
                                type: "view",
                                id: record.id
                            }
                        },
                        () => {
                            context.toggleModalVisible(true);
                        }
                    );
                }}
            >
                {text}
            </span>
        ),
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目名称</p>
                <p className="apply-form-list-p2">项目编码</p>
            </div>
        ),
        dataIndex: "projectNum",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.projecName}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票类型</p>
                <p className="apply-form-list-p2">发票代码</p>
            </div>
        ),
        dataIndex: "invoiceType",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票号码</p>
                <p className="apply-form-list-p2">发票明细号</p>
            </div>
        ),
        dataIndex: "invoiceNum",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceDetailNum}</p>
            </div>
        )
    },
    {
        title: '金额',
        dataIndex: "amount",
        className:'table-money',
        render: (text, record) => fMoney(text)
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">购货单位</p>
                <p className="apply-form-list-p2">购方税号</p>
            </div>
        ),
        dataIndex: "purchaseName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.purchaseTaxNum}</p>
            </div>
        )
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width: "75px"
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
    },
    {
        title: "数据来源",
        dataIndex: "sourceType",
        width: "60px",
        render: text => {
            text = parseInt(text, 0);
            if (text === 1) {
                return "手工采集";
            }
            if (text === 2) {
                return "外部导入";
            }
            return text;
        }
    }
];
class SalesInvoiceCollection extends Component {
    state = {
        visible: false,
        modalConfig: {
            type: ""
        },
        tableKey: Date.now(),
        filters: {},
        dataSource: [],
        /**
         *修改状态和时间
         * */
        statusParam: {},
        hasData: false,
        totalSource: undefined
    };
    fetchResultStatus = () => {
        request
            .get("/output/invoice/collection/listMain", {
                params: this.state.filters
            })
            .then(({ data }) => {
                if (data.code === 200) {
                    this.setState({
                        statusParam: data.data
                    });
                } else {
                    message.error(`列表主信息查询失败:${data.msg}`);
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    };
    toggleModalVisible = visible => {
        this.setState({
            visible
        });
    };
    showModal = type => {
        this.toggleModalVisible(true);
        this.setState({
            modalConfig: {
                type: type
            }
        });
    };
    refreshTable = () => {
        this.setState({
            tableKey: Date.now()
        });
    };

    componentDidMount() {
        const { search } = this.props.location;
        if (!!search) {
            this.refreshTable();
        }
    }
    render() {
        const {
            visible,
            modalConfig,
            tableKey,
            totalSource,
            statusParam,
            filters={}
        } = this.state;
        const { search } = this.props.location;
            // {mainId,billingDate} = filters;
        let disabled = !!search,
        submitDefaultValue = {...filters,taxMonth:filters.billingDate};
        // const disabled1 = dataSource.length===0 || !!(
        //     mainId &&
        //     billingDate &&
        //     (statusParam && parseInt(statusParam.status, 0) === 1)
        // );
        // const disabled2 = dataSource.length===0 || (statusParam && parseInt(statusParam.status, 0) === 2);
        return (
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields: searchFields(disabled),
                    cardProps: {
                        className: ""
                    }
                }}
                tableOption={{
                    key: tableKey,
                    pageSize: 10,
                    columns: getColumns(this),
                    url: "/output/invoice/collection/list",
                    onSuccess: (params, data) => {
                        this.setState(
                            {
                                filters: params,
                                hasData: data.length !== 0
                            },
                            () => {
                                this.fetchResultStatus();
                            }
                        );
                    },
                    cardProps: {
                        title: "销项发票采集列表",
                        extra: (
                            <div>
                                {listMainResultStatus(statusParam)}
                                {
                                    composeBotton([{
                                        type:'fileExport',
                                        url:'output/invoice/collection/download',
                                        onSuccess:this.refreshTable
                                    }],statusParam)
                                }
                                {
                                    JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                        type:'fileImport',
                                        url:'/output/invoice/collection/upload/',
                                        onSuccess:this.refreshTable,
                                        fields:fields
                                    },{
                                        type:'submit',
                                        url:'/output/invoice/collection/submit',
                                        params:{...submitDefaultValue},
                                        onSuccess:this.refreshTable
                                    },{
                                        type:'revoke',
                                        url:'/output/invoice/collection/revoke',
                                        params:{...submitDefaultValue},
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                                }
                                <TableTotal totalSource={totalSource} />
                            </div>
                        )
                    },
                    /*scroll:{
                        x:'180%'
                    },*/
                    onDataChange: dataSource => {
                        this.setState({
                            dataSource
                        });
                    },
                    onTotalSource: totalSource => {
                        this.setState({
                            totalSource
                        });
                    }
                }}
            >
                <PopModal
                    refreshTable={this.refreshTable}
                    visible={visible}
                    modalConfig={modalConfig}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </SearchTable>
        );
    }
}
export default withRouter(SalesInvoiceCollection);
