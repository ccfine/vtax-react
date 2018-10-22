/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React, { Component } from "react";
import {message,Modal} from 'antd';
import { TableTotal, SearchTable } from "compoments";
import { requestResultStatus, fMoney, listMainResultStatus,composeBotton,request,requestTaxSubjectConfig} from "utils";
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
    },
    {
        label: "导入内容",
        fieldName: "importCentent",
        type: "select",
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        options: [
            {
                text: "进项发票",
                value: "1"
            },
            {
                text: "进项发票的利润中心",
                value:  "2"
            }
        ],
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择导入内容'
                }
            ]
        },
    }
]

const getSearchFields = (disabled,declare) => (getFieldValue) => [
        {
            label: "纳税主体",
            fieldName: "main",
            type: "taxMain",
            span: 8,
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
            label: "利润中心",
            fieldName: "profitCenterId",
            type: "asyncSelect",
            span: 8,
            componentProps: {
                fieldTextName: "profitName",
                fieldValueName: "id",
                doNotFetchDidMount: false,
                fetchAble: (getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
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

const getColumns = (context) => [{
    title: "利润中心",
    dataIndex: "profitCenterName",
    width: "200px"
  },
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
        },
        width:'100px',
    },
    {
        title: "应税项目",
        dataIndex: "taxableProject",
        width:'100px',
    },
    {
        title: "项目名称",
        dataIndex: "projectName",
        width:'100px',
    },
    {
        title: "项目编码",
        dataIndex: "projectNum",
        width:'150px',
    },
    {
        title: "发票类型",
        dataIndex: "invoiceType",
        width:'100px',
        render: (text, record) => (
            <p className="apply-form-list-p1">{text==='s'?'增值税专用发票':(text==='c'?'增值税普通发票':'')}</p>
        ),
    },
    {
        title: "发票代码",
        dataIndex: "invoiceCode",
        width:'100px',
    },
    {
        title: "发票号码",
        dataIndex: "invoiceNum",
        width:'100px',
        render: (text, record) => (
            <a
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
            </a>
        ),
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width:'100px',
    },
    {
        title: "认证月份",
        dataIndex: "authMonth",
        width:'100px',
    },
    {
        title: "认证时间",
        dataIndex: "authDate",
        width:'100px',
    },
    {
        title: "销售单位名称",
        dataIndex: "sellerName",
        width:'200px',
    },
    {
        title: "纳税人识别号",
        dataIndex: "sellerTaxNum",
        width:'100px',
    },
    {
        title: "金额",
        dataIndex: "amount",
        render: text => fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className:'table-money',
        width:'100px',
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
        width:'100px',
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
        width:'100px',
    }
];

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
        totalSource: undefined,
        deleteLoading:false,
        selectedRowKeys:[],

        // isShowImport:null,
    };
    refreshTable = () => {
        this.mounted && this.setState(
            {
                tableUpDateKey: Date.now(),
                selectedRowKeys:[]
            }
        );
    };
    toggleModalVisible = visible => {
        this.mounted && this.setState({
            visible
        });
    };
    showModal = type => {
        this.toggleModalVisible(true);
        this.mounted && this.setState({
            modalConfig: {
                type: type
            }
        });
    };
    toggleDeleteLoading=(val)=>{
        this.mounted && this.setState({deleteLoading:val})
    }
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleDeleteLoading(true)
                request.post(`/income/invoice/collection/deleteByIds`,this.state.selectedRowKeys)
                    .then(({data})=>{
                        this.toggleDeleteLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                    this.toggleDeleteLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/income/invoice/collection/listMain',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    fetchTaxSubjectConfig = () =>{
        //根据纳税主体那边的参数设置来判断是否展示导入；并且删除的时候需要加上如果是从接口来的数据不能删除
        requestTaxSubjectConfig(this.state.filters && this.state.filters.mainId, result=>{
            this.mounted && this.setState({
                isShowImport: typeof result === 'undefined' ? 0 : result.unusedInvoicePlatform
            })
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    matchData = () => {
        const { filters } = this.state
        request.put("", filters)
            .then(({data}) => {
                if (data.code === 200) {
                    message.success(data.data);
                    this.refreshTable()
                } else {
                    message.error(`数据匹配失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
      }
    render() {
        const { tableUpDateKey, filters, visible, modalConfig, statusParam={}, totalSource,deleteLoading,selectedRowKeys } = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            isCheck = (disabled && declare.decAction==='edit' && statusParam && parseInt(statusParam.status,10)===1);
        return (
            <div className='oneLine'>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields: getSearchFields(disabled,declare),
                        cardProps:{
                            style:{borderTop:0}
                        }
                    }}
                    backCondition={(filters)=>{
                        this.setState({
                            filters,
                        },()=>{
                            this.fetchResultStatus()
                            // this.fetchTaxSubjectConfig()
                        })
                    }}
                    tableOption={{
                        columns: getColumns(this),
                        url: "/income/invoice/collection/list",
                        key: tableUpDateKey,
                        scroll: { x: 2140, y:window.screen.availHeight-380},
                        rowSelection:isCheck?{
                            getCheckboxProps: record => ({
                                disabled: parseInt(record.sourceType, 0)  === 2, // Column configuration not to be checked
                            }),
                        }:undefined,
                        onRowSelect:isCheck?(selectedRowKeys)=>{
                            this.mounted && this.setState({
                                selectedRowKeys
                            })
                        }:undefined,
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
                                        userPermissions:['1491007'],
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
                                    (disabled && declare.decAction==='edit') &&  composeBotton([             
                                    {
                                        type: "match",
                                        icon: "copy",
                                        text: "数据匹配",
                                        btnType: "default",
                                        userPermissions: ["1495002"],
                                        onClick: this.matchData
                                    },
                                    {
                                        type:'fileImport',
                                        url:'/income/invoice/collection/upload',
                                        userPermissions:['1491005'],
                                        onSuccess:this.refreshTable,
                                        fields:getFields(filters)
                                    },{
                                        type:'revokeImport',
                                        url:'/income/invoice/collection/revocation',
                                        params:filters,
                                        monthFieldName:"authMonth",
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1495000'],
                                    }],statusParam)
                                }

                                {
                                    (disabled && declare.decAction==='edit') && composeBotton([{
                                        type:'delete',
                                        icon:'delete',
                                        text:'删除',
                                        btnType:'danger',
                                        loading:deleteLoading,
                                        selectedRowKeys:selectedRowKeys,
                                        userPermissions:['1491008'],
                                        onClick:this.deleteData
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
                                <TableTotal type={3} totalSource={totalSource} data={
                                    [
                                        {
                                            title:'合计',
                                            total:[
                                                {title: '发票金额', dataIndex: 'allAmount'},
                                                {title: '发票税额', dataIndex: 'allTaxAmount'},
                                                {title: '价税合计', dataIndex: 'allTotalAmount'},
                                            ],
                                        }
                                    ]
                                } />
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
            </div>
        );
    }
}
export default InvoiceCollection
