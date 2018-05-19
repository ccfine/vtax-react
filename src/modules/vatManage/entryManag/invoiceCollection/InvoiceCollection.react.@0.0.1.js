/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React, { Component } from "react";
import { Layout, Form,Modal } from "antd";
import { TableTotal, SearchTable } from "compoments";
import { requestResultStatus, fMoney, getUrlParam, listMainResultStatus,composeBotton } from "utils";
import { withRouter } from "react-router";
import moment from "moment";
import PopModal from "./popModal";
const fields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]

const getSearchFields = disabled => {
    return [
    {
        label: "纳税主体",
        fieldName: "mainId",
        type: "taxMain",
        span: 8,
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
        label: "认证月份",
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
                    message: "请选择认证月份"
                }
            ]
        }
    },
    {
        label: "发票号码",
        fieldName: "invoiceNum",
        type: "input",
        span: 8,
        componentProps: {},
        fieldDecoratorOptions: {}
    }
]
};
class InvoiceCollection extends Component {
    state = {
        /**
         * params条件，给table用的
         * */
        filters: {},

        /**
         *修改状态和时间
         * */
        statusParam: {},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey: Date.now(),
        dataSource: [],
        selectedRowKeys: null,
        selectedRows: null,
        visible: false,
        modalConfig: {
            type: ""
        },
        totalSource: undefined
    };

    columns = [
        {
            title: "数据来源",
            dataIndex: "sourceType",
            render: text => {
                text = parseInt(text, 0);
                if (text === 1) {
                    return "手工采集";
                }
                if (text === 2) {
                    return "外部导入";
                }
                return "";
            }
        },
        {
            title: "纳税主体",
            dataIndex: "mainName"
        },
        {
            title: "应税项目",
            dataIndex: "projectNum"
        },
        {
            title: (
                <div className="apply-form-list-th">
                    <p className="apply-form-list-p1">项目名称</p>
                    <p className="apply-form-list-p2">项目编码</p>
                </div>
            ),
            dataIndex: "projectName",
            render: (text, record) => (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.projectNum}</p>
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
            dataIndex: "invoiceTypeName",
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
                    <p className="apply-form-list-p2">开票日期</p>
                </div>
            ),
            dataIndex: "invoiceNum",
            render: (text, record) => (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.billingDate}</p>
                </div>
            )
        },
        {
            title: (
                <div className="apply-form-list-th">
                    <p className="apply-form-list-p1">认证月份</p>
                    <p className="apply-form-list-p2">认证时间</p>
                </div>
            ),
            dataIndex: "authMonth",
            render: (text, record) => (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.authDate}</p>
                </div>
            )
        },
        {
            title: (
                <div className="apply-form-list-th">
                    <p className="apply-form-list-p1">销售单位名称</p>
                    <p className="apply-form-list-p2">纳税人识别号</p>
                </div>
            ),
            dataIndex: "sellerName",
            render: (text, record) => (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.sellerTaxNum}</p>
                </div>
            )
        },
        {
            title: "金额",
            dataIndex: "amount",
            render: text => fMoney(text)
        },
        {
            title: "税额",
            dataIndex: "taxAmount",
            render: text => fMoney(text)
        },
        {
            title: "价税合计",
            dataIndex: "totalAmount",
            render: text => fMoney(text)
        },
        {
            title: "认证标记",
            dataIndex: "authStatus",
            render: text => {
                //认证标记:认证结果1:认证成功;2:认证失败;0:无需认证';
                let res = "";
                switch (parseInt(text, 0)) {
                    case 1:
                        res = "认证成功";
                        break;
                    case 2:
                        res = "认证失败";
                        break;
                    case 0:
                        res = "无需认证";
                        break;
                    default:
                }
                return res;
            }
        },
        {
            title: "是否需要认证",
            dataIndex: "authFlag",
            render: text => {
                //是否需要认证:1需要，0不需要let res = '';
                let res = "";
                switch (parseInt(text, 10)) {
                    case 1:
                        res = "需要";
                        break;
                    case 0:
                        res = "不需要";
                        break;
                    default:
                }
                return res;
            }
        }
    ];
    toggleModalVisible = visible => {
        this.setState({
            visible
        });
    };
    refreshTable = () => {
        this.setState(
            {
                tableUpDateKey: Date.now(),
                selectedRowKeys:null
            }
        );
    };
    showModal = type => {
        if (type === "edit") {
            let sourceType = parseInt(this.state.selectedRows[0].sourceType, 0);
            if (sourceType === 2) {
                const ref = Modal.warning({
                    title: "友情提醒",
                    content: "该发票信息是外部导入，无法修改！",
                    okText: "确定",
                    onOk: () => {
                        ref.destroy();
                    }
                });
            } else {
                this.toggleModalVisible(true);
                this.setState({
                    modalConfig: {
                        type,
                        id: this.state.selectedRowKeys
                    }
                });
            }
        } else {
            this.toggleModalVisible(true);
            this.setState({
                modalConfig: {
                    type,
                    id: this.state.selectedRowKeys
                }
            });
        }
    };
    fetchResultStatus = ()=>{
        requestResultStatus('/income/invoice/collection/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.taxSubjectId !== nextProps.taxSubjectId) {
            this.initData();
        }
    }

    render() {
        const { tableUpDateKey, filters, selectedRowKeys, visible, modalConfig, statusParam, totalSource } = this.state;
        const { search } = this.props.location;
        let disabled = !!(search && search.filters);
        return (
            <Layout style={{ background: "transparent" }}>
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields: getSearchFields(disabled)
                    }}
                    backCondition={values => {
                        this.setState({
                                filters: values
                            },() => {
                                this.fetchResultStatus();
                        });
                    }}
                    tableOption={{
                        columns: this.columns,
                        url: "/income/invoice/collection/list",
                        key: tableUpDateKey,
                        rowSelection: {
                            type: "radio"
                        },
                        onRowSelect: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                selectedRowKeys,
                                selectedRows
                            });
                        },
                        scroll: { x: "110%" },
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    composeBotton([{
                                        type:'fileExport',
                                        url:'income/invoice/collection/download',
                                        onSuccess:this.refreshTable
                                    }])
                                }
                                {
                                    JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                        type:'view',
                                        text:'查看',
                                        icon:'search',
                                        selectedRowKeys:selectedRowKeys || [],
                                        onClick:()=>this.showModal("view")
                                    },{
                                        type:'fileImport',
                                        url:'/income/invoice/collection/upload',
                                        onSuccess:this.refreshTable,
                                        fields:fields
                                    },{
                                        type:'submit',
                                        url:'/income/invoice/collection/submit',
                                        params:filters,
                                        onSuccess:this.refreshTable
                                    },{
                                        type:'revoke',
                                        url:'/income/invoice/collection/revoke',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                                }
                                <TableTotal totalSource={totalSource} />
                            </div>
                        ),
                        cardProps: {
                            title: "进项发票采集"
                        },
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
                />
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        );
    }
}
export default Form.create()(withRouter(InvoiceCollection));
