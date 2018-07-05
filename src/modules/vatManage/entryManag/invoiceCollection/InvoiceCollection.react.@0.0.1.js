/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React, { Component } from "react";
import {connect} from 'react-redux';
import {message,Modal} from 'antd';
import { TableTotal, SearchTable } from "compoments";
import { requestResultStatus, fMoney, listMainResultStatus,composeBotton,request} from "utils";
import moment from "moment";
import PopModal from "./popModal";
const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const getFields = (filters)=>[
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
                span:14
            }
        },
        fieldDecoratorOptions:{
            initialValue: (filters && filters["mainId"]) || undefined,
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
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            initialValue:
                (filters && moment(filters["authMonth"], "YYYY-MM")) ||
                undefined,
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]

const getSearchFields = (disabled,declare) => {
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
                        (disabled && moment(declare["authMonth"], "YYYY-MM")) ||
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

const columns = (context,hasOperate) => {
    let operates = hasOperate?[{
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:['1491008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    }]:[];
    return [...operates,{
        title: "纳税主体",
        dataIndex: "mainName",
    }, {
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
        },
        width:60,
    }, {
        title: "应税项目",
        dataIndex: "taxableProject",
        width:'8%',
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
        ),
        width:'12%',
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
        ),
        width:90,
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
                <p className="apply-form-list-p1"><span
                title="查看详情"
                style={{
                    ...pointerStyle,
                    marginLeft: 5
                }}
                onClick={() => {
                    context.setState({
                        modalConfig: {
                            type: "view",
                            id: record.id
                        }
                    },() => {
                        context.toggleModalVisible(true);
                    });
                }}
            >
                {text}
            </span></p>
                <p className="apply-form-list-p2">{record.billingDate}</p>
            </div>
        ),
        width:90,
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
        ),
        width:75,
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
        ),
        width:'16%',
    },
    {
        title: "金额",
        dataIndex: "amount",
        render: text => fMoney(text),
        width:'6%',
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        width:'6%',
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        width:'6%',
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
        },
        width:60,
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
        },
        width:60,
    }
];
}

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
        visible: false,
        modalConfig: {
            type: ""
        },
        totalSource: undefined
    };
    refreshTable = () => {
        this.setState(
            {
                tableUpDateKey: Date.now(),
                selectedRowKeys:null
            }
        );
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
    fetchResultStatus = ()=>{
        requestResultStatus('/income/invoice/collection/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    deleteRecord(record){
        request.delete(`/income/invoice/collection/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
                message.error(err.message);
            })
    }
    render() {
        const { tableUpDateKey, filters, visible, modalConfig, statusParam={}, totalSource } = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return (
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields: getSearchFields(disabled,declare)
                    }}
                    tableOption={{
                        columns: columns(this,(disabled && declare.decAction==='edit') && parseInt(statusParam.status,10)===1),
                        url: "/income/invoice/collection/list",
                        key: tableUpDateKey,
                        scroll: { x: 1500, y:window.screen.availHeight-380 },
                        onSuccess:(params)=>{
                            this.setState({
                                filters:params
                            },()=>{
                                this.fetchResultStatus()
                            })
                        },
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'income/invoice/collection/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1491002'],
                                    }])
                                }
                                {
                                    composeBotton([{
                                        type:'fileExport',
                                        url:'income/invoice/collection/download',
                                        onSuccess:this.refreshTable
                                    }])
                                }
                                {
                                    (disabled && declare.decAction==='edit') && composeBotton([{
                                        type:'fileImport',
                                        url:'/income/invoice/collection/upload',
                                        userPermissions:['1491005'],
                                        onSuccess:this.refreshTable,
                                        fields:getFields(filters)
                                    },{
                                        type:'submit',
                                        url:'/income/invoice/collection/submit',
                                        params:filters,
                                        userPermissions:['1491010'],
                                        onSuccess:this.refreshTable
                                    },{
                                        type:'revoke',
                                        url:'/income/invoice/collection/revoke',
                                        params:filters,
                                        userPermissions:['1491011'],
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                                }
                                <TableTotal totalSource={totalSource} />
                            </div>
                        ),
                        cardProps: {
                            title: "进项发票采集"
                        },
                        onTotalSource: totalSource => {
                            this.setState({
                                totalSource
                            });
                        }
                    }}
                >
                    <PopModal
                        visible={visible}
                        modalConfig={modalConfig}
                        refreshTable={this.refreshTable}
                        statusParam={statusParam}
                        toggleModalVisible={this.toggleModalVisible}
                    />
                </SearchTable>
        );
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
  }))(InvoiceCollection);
