/**
 * Created by liurunbin on 2017/12/21.
 */
import React, { Component } from "react";
import { Button, Modal, Form, Row, Col, Spin, message, Card } from "antd";
import { request, getFields, regRules, fMoney } from "../../../../../utils";
import moment from "moment";
import {SynchronizeTable} from 'compoments'
const confirm = Modal.confirm;
const formItemStyle = {
    labelCol: {
        span: 9
    },
    wrapperCol: {
        span: 15
    }
};
const columns = [{
    title: '货物或应税劳务代码',
    dataIndex: 'itemCode',
}, {
    title: '货物或应税劳务名称',
    dataIndex: 'itemName',
},{
    title:'规格型号',
    dataIndex:'spec'
},{
    title: '单位',
    dataIndex: 'unit',
},{
    title: '数量',
    dataIndex: 'quantity',
},{
    title: '单价',
    dataIndex: 'unitPrice',
    render:text=>fMoney(text),
},{
    title: '金额',
    dataIndex: 'amountWithoutTax',
    render:text=>fMoney(text),
},{
    title: '税率',
    dataIndex: 'taxRate',
    render:text=>text? `${text}%`: text,
},{
    title: '税额',
    dataIndex: 'taxAmount',
    render:text=>fMoney(text),
}];
class PopModal extends Component {
    static defaultProps = {
        type: "edit",
        visible: true,
        tableUpDateKey:Date.now(),
    };
    state = {
        initData: {},
        loaded: false
    };

    toggleLoaded = loaded => this.setState({ loaded });
    fetchReportById = (id, props) => {
        this.toggleLoaded(false);
        request
            .get(`/output/invoice/collection/get/${id}`)
            .then(({ data }) => {
                this.toggleLoaded(true);
                if (data.code === 200) {
                    this.setState(
                        {
                            initData: data.data
                        }
                    );
                }
            })
            .catch(err => {
                message.error(err.message);
                this.toggleLoaded(true);
            });
    };
    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData: {}
            });
        }
        if (nextProps.modalConfig.type === "add") {
            this.setState({
                loaded: true
            });
        }
        if (
            this.props.visible !== nextProps.visible &&
            !this.props.visible &&
            nextProps.modalConfig.type !== "add"
        ) {
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.fetchReportById(nextProps.modalConfig.id, nextProps);
        }
    }
    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    handleSubmit = e => {
        e && e.preventDefault();
    };

    render() {
        const props = this.props;
        const { loaded,tableUpDateKey } = this.state,
            {
                outputInvCollectionDO: initData = {},
                list: dataSource = []
            } = this.state.initData;

        const { getFieldValue, setFieldsValue } = this.props.form;
        let title = "";
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type) {
            case "add":
                title = "新增";
                break;
            case "edit":
                title = "编辑";
                break;
            case "view":
                title = "查看";
                disabled = true;
                break;
            default:
            //no default
        }
        let shouldShowDefaultData = false;
        if ((type === "edit" || type === "view") && loaded) {
            shouldShowDefaultData = true;
        }
        if (type === "type") {
            disabled = true;
        }

        const taxRateValue = getFieldValue("taxRate"),
            amountValue = getFieldValue("amount");
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => props.toggleModalVisible(false)}
                width={900}
                style={{
                    maxWidth: "90%",
                    top:'5%'
                }}
                visible={props.visible}
                bodyStyle={{maxHeight:500,overflow:'auto'}}
                footer={
                    type !== "view" ? (
                        <Row>
                            <Col span={12} />
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    loading={!loaded}
                                    onClick={this.handleSubmit}
                                >
                                    确定
                                </Button>
                                <Button
                                    onClick={() =>
                                        props.toggleModalVisible(false)
                                    }
                                >
                                    取消
                                </Button>
                                {type === "edit" && (
                                    <Button
                                        onClick={() => {
                                            if (
                                                parseInt(
                                                    initData["sourceType"],
                                                    0
                                                ) !== 1
                                            ) {
                                                message.error(
                                                    "只能删除手工新增的数据"
                                                );
                                                return false;
                                            }
                                            confirm({
                                                title: "友情提醒",
                                                content:
                                                    "该删除后将不可恢复，是否删除？",
                                                okText: "确定",
                                                okType: "danger",
                                                cancelText: "取消",
                                                onOk: () => {
                                                    this.toggleLoaded(false);
                                                    this.deleteRecord(
                                                        initData["id"]
                                                    );
                                                },
                                                onCancel() {}
                                            });
                                        }}
                                        type="danger"
                                    >
                                        删除
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ) : null
                }
                title={title}
            >
                <Spin spinning={!loaded}>
                    <Card>
                        <Form>
                            <Row>
                                {getFields(props.form, [
                                    {
                                        label: "纳税主体",
                                        fieldName: "mainId",
                                        type: "taxMain",
                                        fieldDecoratorOptions: {
                                            initialValue: initData["mainName"],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择纳税主体"
                                                }
                                            ]
                                        },
                                        formItemStyle,
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "项目名称",
                                        fieldName: "projectName",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["projectName"],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请输入项目名称"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "项目编码",
                                        fieldName: "projectNum",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["projectNum"],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请输入项目编码"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "计税方法",
                                        fieldName: "taxMethod",
                                        type: "select",
                                        options: [
                                            {
                                                text: "一般计税方法",
                                                value: "1"
                                            },
                                            {
                                                text: "简易计税方法",
                                                value: "2"
                                            }
                                        ],
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["taxMethod"],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择计税方法"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                            onSelect: value => {
                                                let rateValue = getFieldValue(
                                                    "taxClassificationCoding"
                                                );
                                                if (rateValue) {
                                                    if (
                                                        parseInt(value, 0) === 1
                                                    ) {
                                                        rateValue = getFieldValue(
                                                            "taxClassificationCoding"
                                                        ).commonlyTaxRate;
                                                    }
                                                    if (
                                                        parseInt(value, 0) === 2
                                                    ) {
                                                        rateValue = getFieldValue(
                                                            "taxClassificationCoding"
                                                        ).simpleTaxRate;
                                                    }
                                                    setFieldsValue({
                                                        taxRate: rateValue
                                                    });

                                                    if (amountValue) {
                                                        let taxAmount =
                                                            parseFloat(
                                                                amountValue
                                                            ) *
                                                            parseFloat(
                                                                rateValue
                                                            ) /
                                                            100;
                                                        setFieldsValue({
                                                            taxAmount: fMoney(
                                                                taxAmount
                                                            ),
                                                            totalAmount: fMoney(
                                                                parseFloat(
                                                                    amountValue
                                                                ) + taxAmount
                                                            )
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        label: "发票类型",
                                        fieldName: "invoiceType",
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
                                        ],
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["invoiceType"],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择发票类型"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "应税项目",
                                        fieldName: "taxableProjectName",
                                        type: "input",
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["taxableProjectName"]
                                        },
                                        formItemStyle,
                                        componentProps: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        label: "发票号码",
                                        fieldName: "invoiceNum",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["invoiceNum"],
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message: "请输入发票号码"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "发票代码",
                                        fieldName: "invoiceCode",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["invoiceCode"],
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message: "请输入发票代码"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                            onChange: e => {
                                                setFieldsValue({
                                                    invoiceDetailNum:
                                                    e.target.value
                                                });
                                            }
                                        }
                                    },
                                    {
                                        label: "发票明细号",
                                        fieldName: "invoiceDetailNum",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["invoiceDetailNum"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        label: "开票日期",
                                        fieldName: "billingDate",
                                        type: "datePicker",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: shouldShowDefaultData
                                                ? moment(
                                                    `${
                                                        initData[
                                                            "billingDate"
                                                            ]
                                                        }`,
                                                    "YYYY-MM-DD"
                                                )
                                                : undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择开票日期"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            format: "YYYY-MM-DD",
                                            disabled
                                        }
                                    },
                                    {
                                        label: "购货单位名称",
                                        fieldName: "purchaseName",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["purchaseName"],
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message:
                                                        "请输入购货单位名称"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "购方税号",
                                        fieldName: "purchaseTaxNum",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                                initData["purchaseTaxNum"],
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message: "请输入购方税号"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "地址",
                                        fieldName: "address",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["address"],
                                            rules: [regRules.input_length_50]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "电话",
                                        fieldName: "phone",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["phone"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "开户行",
                                        fieldName: "bank",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["bank"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "帐号",
                                        fieldName: "account",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["account"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "金额",
                                        fieldName: "amount",
                                        type: "numeric",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["amount"]
                                                ? disabled
                                                    ? `${fMoney(
                                                        initData["amount"]
                                                    )}`
                                                    : `${initData["amount"]}`
                                                : undefined,
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message: "请输入金额"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled,
                                            onChange: value => {
                                                if (taxRateValue && value) {
                                                    /**
                                                     * 如果有税率了，就计算税额和价税合计
                                                     * */
                                                    let taxAmount =
                                                        parseFloat(value) *
                                                        parseFloat(
                                                            taxRateValue
                                                        ) /
                                                        100;
                                                    setFieldsValue({
                                                        taxAmount: fMoney(
                                                            taxAmount
                                                        ),
                                                        totalAmount: fMoney(
                                                            parseFloat(value) +
                                                            taxAmount
                                                        )
                                                    });
                                                }
                                            }
                                        }
                                    },
                                    {
                                        label: "税率",
                                        fieldName: "taxRate",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["taxRate"]
                                                ? `${initData["taxRate"]}`
                                                : undefined
                                        },
                                        componentProps: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        label: "税额",
                                        fieldName: "taxAmount",
                                        type: "numeric",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["taxAmount"]
                                                ? `${fMoney(
                                                    initData["taxAmount"]
                                                )}`
                                                : undefined,
                                            rules: [
                                                regRules.input_length_20,
                                                {
                                                    required: true,
                                                    message: "请输入税额"
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        label: "价税合计",
                                        fieldName: "totalAmount",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue:
                                            fMoney(
                                                initData["totalAmount"]
                                            ) || undefined
                                        },
                                        componentProps: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        label: "备注",
                                        fieldName: "remark",
                                        type: "input",
                                        fieldDecoratorOptions: {
                                            initialValue: initData["remark"],
                                            rules: [regRules.input_length_50]
                                        },
                                        span: 24,
                                        formItemStyle: {
                                            labelCol: {
                                                span: 3
                                            },
                                            wrapperCol: {
                                                span: 21
                                            }
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "收款人",
                                        fieldName: "payee",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["payee"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "复核",
                                        fieldName: "checker",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["checker"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    },
                                    {
                                        label: "开票人",
                                        fieldName: "drawer",
                                        type: "input",
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData["drawer"],
                                            rules: [regRules.input_length_20]
                                        },
                                        componentProps: {
                                            disabled
                                        }
                                    }
                                ])}
                            </Row>
                        </Form>
                    </Card>
                    <Card title="发票明细" style={{ marginTop: 10 }}>
                        <SynchronizeTable
                            data={dataSource}
                            updateKey={tableUpDateKey}
                            loaded={loaded}
                            tableProps={{
                                rowKey: record => record.id,
                                pagination: true,
                                bordered: true,
                                size: "small",
                                columns: columns,
                                footerDate: undefined,
                            }}
                        />
                    </Card>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);
