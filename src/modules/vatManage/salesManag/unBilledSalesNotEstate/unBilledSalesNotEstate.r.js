/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Modal} from 'antd'
import { AsyncTable,TableTotal,PopDetailsModal } from "compoments";
import {request, getFields, fMoney,composeBotton,requestResultStatus,parseJsonToParams } from "utils";
import moment from 'moment';
import PopModal from "./popModal";

const columns = context => [
    {
        title: "收入类型",
        dataIndex: "incomeType",
        width: "200px"
    },
    {
        title: "税率",
        dataIndex: "taxRateName",
        width: "200px"
    },
    {
        title: "上期末合计金额",
        children: [
            {
                title: "增值税收入确认金额",
                dataIndex: "beforeConfirmAmount",
                width: "220px",
                render: text => fMoney(text),
                className: "table-money"
            },
            {
                title: "增值税开票金额",
                dataIndex: "beforeBillingAmount",
                width: "200px",
                render: text => fMoney(text),
                className: "table-money"
            },
            {
                title: "未开具发票销售额",
                dataIndex: "beforeUnbillingAmount",
                width: "200px",
                render: text => fMoney(text),
                className: "table-money"
            }
        ]
    },
    {
        title: "本期发生额",
        children: [
            {
                title: "增值税收入确认金额",
                dataIndex: "confirmAmount",
                width: "220px",
                render: (text, record) => (
                    <a title="查看详情"
                       onClick={ () => context.toggleModalVoucherVisibleConfirm(true, record.subjectId, record.taxRateId) }
                    >
                        { fMoney(text) }
                    </a>
                ),
                className: "table-money"
            },
            {
                title: "增值税开票金额",
                dataIndex: "billingAmount",
                width: "200px",
                render: (text, record) => (
                    <a title="查看详情"
                       onClick={ () => context.toggleModalVoucherVisibleInvoice(true, record.subjectId, record.taxRateId) }
                    >
                        { fMoney(text) }
                    </a>
                ),
                className: "table-money"
            },
            {
                title: "未开具发票销售额",
                dataIndex: "unbillingAmount",
                width: "200px",
                render: text => fMoney(text),
                className: "table-money"
            }
        ]
    },
    {
        title: "本期末合计金额",
        children: [
            {
                title: "增值税收入确认金额",
                dataIndex: "endConfirmAmount",
                width: "220px",
                render: text => fMoney(text),
                className: "table-money"
            },
            {
                title: "增值税开票金额",
                dataIndex: "endBillingAmount",
                width: "200px",
                render: text => fMoney(text),
                className: "table-money"
            },
            {
                title: "未开具发票销售额",
                dataIndex: "endUnbillingAmount",
                width: "200px",
                render: text => fMoney(text),
                className: "table-money"
            }
        ]
    },
    {
        title: "本期应申报未开票销售额",
        dataIndex: "currentUnbillingAmount",
        width: "250px",
        render: text => fMoney(text),
        className: "table-money"
    },
    {
        title: "本期应申报未开票销售税额",
        dataIndex: "currentTaxAmount",
        width: "250px",
        render: text => fMoney(text),
        className: "table-money"
    }
]

const columns2=(context,hasOperate) => {
    let operates = hasOperate ? [{
        title: "操作",
        className: "text-center",
        render(text, record, index) {
            return composeBotton([{
                type: 'action',
                icon: 'edit',
                title: '编辑',
                userPermissions: ['1361004'],
                onSuccess: () => {
                    context.setState({
                        visible: true,
                        action: "modify",
                        opid: record.id
                    });
                }
            }, {
                type: 'action',
                icon: 'delete',
                title: '删除',
                style: {color: "#f5222d"},
                userPermissions: ['1361008'],
                onSuccess: () => {
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
    }] : [];
    return [
        ...operates
        , {
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width:'200px',
            render: (text, record) => {
                return <a title='查看详情' onClick={() => {
                    context.setState({
                        visible: true,
                        action: "look",
                        opid: record.id
                    });
                }}>
                    {text}
                </a>
            }
        /*},{
            title: "纳税主体",
            dataIndex: "mainName",
            render: (text, record) => {
                return <a title='查看详情' onClick={() => {
                    context.setState({
                        visible: true,
                        action: "look",
                        opid: record.id
                    });
                }}>
                    {text}
                </a>
            }
        }, {
            title: '项目',
            dataIndex: 'projectName',*/
        }, {
            title: '项目分期',
            dataIndex: 'stagesName',
        }, {
            title: "科目代码",
            dataIndex: "creditSubjectCode"
        }, {
            title: "科目名称",
            dataIndex: "creditSubjectName"
        }, {
            title: "税率",
            dataIndex: "taxRateName",
            //render: text => `${text}${text ? "%" : ""}`
        }, {
            title: "金额",
            dataIndex: "creditAmount",
            render: text => fMoney(text),
            className: "table-money"
        }, {
            title: "税额",
            dataIndex: "taxAmount",
            render: text => fMoney(text),
            className: "table-money"
        }, {
            title: "价税合计",
            dataIndex: "totalAmount",
            render: text => fMoney(text),
            className: "table-money"
        }
    ];
}

const voucherSearchFields = [
    {
        label:'SAP凭证号',
        fieldName:'voucherNo',
        type:'input',
        span:8,
        componentProps:{ }
    }
]

const voucherSearchFieldsConfirm = [
    {
        label: "科目代码",
        fieldName: "creditSubjectCode",
        span: 8
    },
    {
        label: "SAP凭证号",
        fieldName: "voucherNo",
        span: 8
    }
]

const voucherSearchFieldsInvoice = [
    {
        label: "发票号码",
        fieldName: "invoiceNum",
        span: 8
    }
]

const voucherColumns = [
    {
        title: '利润中心',
        dataIndex: 'profitCenterNum',
        width:200,
    }, {
        title: '项目分期名称',
        dataIndex: 'stageName',
        width:200,
    },{
        title: '科目代码',
        dataIndex: 'subjectCode',
        width:150,
    },{
        title: '科目名称',
        dataIndex: 'subjectName',
        width:150,
    },{
        title: 'SAP凭证号',
        dataIndex: 'voucherNo',
        width:200,
    },{
        title: '款项明细',
        dataIndex: 'zkxmx',
        //width:100,
    },{
        title: '税率',
        dataIndex: 'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:100,
    },{
        title: '本币不含税金额',
        dataIndex: 'amountWithoutTax',
        width:150,
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '期间（月份）',
        dataIndex: 'month',
        width:100,
    }
];

const voucherColumnsConfirm = [
    {
        title: "利润中心",
        dataIndex: "profitCenterName",
        width: 200
    },
    {
        title: "项目分期",
        dataIndex: "stagesName",
        width: 200
    },
    {
        title: "过账日期",
        dataIndex: "month",
        width: 150
    },
    {
        title: "SAP凭证号",
        dataIndex: "voucherNo",
        width: 200
    },
    {
        title: "凭证摘要",
        dataIndex: "voucherAbstract",
        width: 200
    },
    {
        title: "贷方科目代码",
        dataIndex: "creditSubjectCode",
        width: 150
    },
    {
        title: "贷方科目名称",
        dataIndex: "creditSubjectName",
        width: 150
    },
    {
        title: "贷方金额",
        dataIndex: "creditAmount",
        render: text => fMoney(text),
        className: "table-money",
        width: 150
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        className: "text-right",
        width: 100
    },
    {
        title: "能源转售类型",
        dataIndex: "energyType",
        width: 150
    }
]

const voucherColumnsInvoice = [
    {
        title: "发票号码",
        dataIndex: "invoiceNum",
        width: "150px"
    },
    {
        title: "发票代码",
        dataIndex: "invoiceCode",
        width: "150px"
    },
    {
        title: "发票类型",
        dataIndex: "invoiceType",
        width: "150px",
        render(text){
            let value = '';
            if(text === 's'){
                value = '专票'
            }else if(text === 'c'){
                value = '普票';
            }
            return value;
        }
    },
    {
        title: "开票日期",
        dataIndex: "billingDate",
        width: "200px"
    },
    {
        title: "金额",
        dataIndex: "amount",
        render: text => fMoney(text),
        className: "table-money",
        width: "200px"
    },
    {
        title: "税率",
        dataIndex: "taxRate",
        render: (text) => text ? `${text}%`: text,
        className:'text-right',
        width: "200px"
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render: text => fMoney(text),
        className: "table-money",
        width: "200px"
    },
    {
        title: "价税合计",
        dataIndex: "totalAmount",
        render: text => fMoney(text),
        className: "table-money",
        width: "200px"
    },
    {
        title: "购货单位名称",
        dataIndex: "purchaseName",
        width: "150px"
    },
    {
        title: "备注",
        dataIndex: "remark"
    }
]

class UnBilledSalesNotEstate extends Component {
    state={
        visible: false, // 控制Modal是否显示
        voucherVisible: false,
        opid: "", // 当前操作的记录
        /**
         * params条件，给table用的
         * */
        filters:{
            pageSize:100
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        statusParam: {},
        dataSource:[],
        totalSource:undefined,
        showProfitCenter: true,
        voucherVisibleConfirm: false,
        voucherFilterConfirm: {},
        voucherVisibleInvoice: false,
        voucherFilterInvoice: {},
        subjectId: "",
        taxRateId: "",
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            tableUpDateKey:Date.now()
        })
    }
    toggleModalVoucherVisible = voucherVisible => {
        this.setState({
            voucherVisible
        });
    };
    toggleModalVoucherVisibleConfirm = (voucherVisibleConfirm, subjectId, taxRateId) => {
        this.setState({
            voucherVisibleConfirm,
            subjectId,
            taxRateId
        })
    }
    toggleModalVoucherVisibleInvoice = (voucherVisibleInvoice, subjectId, taxRateId) => {
        this.setState({
            voucherVisibleInvoice,
            subjectId,
            taxRateId
        })
    }
    fetchLoadType = (mainId) => {
        requestResultStatus(`/dataCollection/loadType/${mainId}`,{}, result=>{
            this.setState({showProfitCenter: result === '2'});
        })
    }
    updateStatus = () => {
        requestResultStatus('',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    };
    hideModal() {
        this.mounted && this.setState({ visible: false });
    }
    deleteRecord = (id, cb) => {
        request
            .delete(`/account/invoiceSale/unrealty/delete/${id}`)
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
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.authMonth) {
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                
                if(values.main){
                    values.mainId = values.main.key;
                    values.main = undefined;
                }

                this.mounted && this.setState({
                    filters: values
                }, () => {
                    this.refreshTable();
                });
            }
        });
    }

    componentDidMount(){
        const { declare } = this.props;
        if (!!declare) {
            this.mounted && this.setState({
                filters:{
                    mainId:declare.mainId || undefined,
                    authMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
            declare.mainId && this.fetchLoadType(declare.mainId);
        }
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tableUpDateKey,voucherVisible,filters,statusParam,totalSource,voucherVisibleConfirm,voucherFilterConfirm,voucherVisibleInvoice,voucherFilterInvoice,subjectId,taxRateId} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            handle = declare && declare.decAction==='edit',
            noSubmit = parseInt(statusParam.status,10)===1;
        const { getFieldValue } = this.props.form
        return(
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                    bordered={false}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'main',
                                        type:'taxMain',
                                        componentProps:{
                                            labelInValue:true,
                                            disabled:disabled
                                        },
                                        span:8,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'查询期间',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        componentProps:{
                                            format:'YYYY-MM',
                                            disabled:disabled
                                        },
                                        span:8,
                                        fieldDecoratorOptions: {
                                            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择查询期间'
                                                }
                                            ]
                                        }
                                    },
                                    ...(this.state.showProfitCenter ? [{
                                        label:'利润中心',
                                        fieldName:'profitCenterId',
                                        type:'asyncSelect',
                                        span:8,
                                        componentProps:{
                                            fieldTextName:'profitName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount: !declare,
                                            fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                                            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
                                        }
                                    }]: []),
                                ])
                            }

                            <Col span={24} style={{textAlign:'right'}}>
                                <Form.Item>
                                    <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                    <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title={<span>未开票销售台账-非地产汇总列表</span>}
                    bordered={false}
                      extra={<div>
                          {
                              JSON.stringify(filters)!=='{}' && composeBotton([{
                                  type:'fileExport',
                                  url:'account/invoiceSale/unrealty/export',
                                  params:filters,
                                  title:'导出',
                                  userPermissions:['1361007'],
                              }])
                          }
                          {
                              (disabled && handle) && composeBotton([{
                                  type:'consistent',
                                  //icon:'exception',
                                  btnType:'default',
                                  text:'转租业务凭证',
                                  userPermissions:['1265014'],
                                  onClick:()=>{
                                      this.toggleModalVoucherVisible(true);
                                  }
                              },{
                                  type:'reset',
                                  url:'/account/invoiceSale/unrealty/reset',
                                  params:filters,
                                  userPermissions:['1361009'],
                                  onSuccess:this.refreshTable
                              }],statusParam)
                          }
                          <TableTotal type={3} totalSource={totalSource} data={
                              [
                                  {
                                      title:'合计',
                                      total:[
                                          {title: '本期应申报未开票销售额', dataIndex: 'currentUnbillingAmountSum'},
                                          {title: '本期应申报未开票销售税额', dataIndex: 'currentTaxAmountSum'},
                                          {title: '上期末增值税收入确认金额', dataIndex: 'beforeConfirmAmountSum'},
                                          {title: '上期末增值税开票金额', dataIndex: 'beforeBillingAmountSum'},
                                          {title: '上期末未开具发票销售额', dataIndex: 'beforeUnbillingAmountSum'},
                                          {title: '本期增值税收入确认金额', dataIndex: 'confirmAmountSum'},
                                          {title: '本期增值税开票金额', dataIndex: 'billingAmountSum'},
                                          {title: '本期未开具发票销售额', dataIndex: 'unbillingAmountSum'},
                                          {title: '本期末增值税收入确认金额', dataIndex: 'endConfirmAmountSum'},
                                          {title: '本期末增值税开票金额', dataIndex: 'endBillingAmountSum'},
                                          {title: '本期末未开具发票销售额', dataIndex: 'endUnbillingAmountSum'}
                                      ],
                                  }
                              ]
                          } />
                      </div>
                      }
                      style={{marginTop:10}}>


                    <AsyncTable url={`/account/invoiceSale/unrealty/pc/list${handle ? '?handle=true' : ''}`}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:false,
                                    size:'small',
                                    columns:columns(this),
                                    onSuccess:handle && this.updateStatus,
                                    onDataChange:(dataSource)=>{
                                        this.setState({
                                            dataSource
                                        })
                                    },
                                    onTotalSource: (totalSource) => {
                                        this.setState({
                                            totalSource
                                        })
                                    }
                                }} />

                </Card>
                <Card title={<span>未开票销售台账-非地产手工新增列表</span>}
                    bordered={false}
                      extra={<div>
                          {
                              (disabled && handle) && composeBotton([{
                                  type:'add',
                                  icon:'plus',
                                  userPermissions:['1361003'],
                                  onClick: () => {
                                      this.setState({
                                          visible: true,
                                          action: "add",
                                          opid: undefined
                                      });
                                  }
                              }],statusParam)
                          }
                      </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url={`/account/notInvoiceUnSale/realty/details/list${handle ? '?handle=true' : ''}`}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns2(this, noSubmit && disabled && handle),
                                }} />
                </Card>

                <PopModal
                    visible={this.state.visible}
                    action={this.state.action}
                    hideModal={() => {
                        this.hideModal();
                    }}
                    id={this.state.opid}
                    update={this.refreshTable}
                    declare={declare}
                />

                <PopDetailsModal
                    title="凭证信息"
                    visible={voucherVisible}
                    fields={voucherSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                    tableOption={{
                        columns:voucherColumns,
                        url:`/advanceRentPayments/unRealty/list?${parseJsonToParams(filters)}`,
                        scroll:{ x: '1600px',y:'250px' },
                    }}
                />

                <PopDetailsModal
                    title="凭证详情"
                    visible={voucherVisibleConfirm}
                    fields={voucherSearchFieldsConfirm}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisibleConfirm}
                    tableOption={{
                        cardProps: {
                            title: "凭证列表"
                        },
                        columns: voucherColumnsConfirm,
                        url: `/account/invoiceSale/unrealty/detailList/?${parseJsonToParams(filters)}&subjectId=${subjectId}&taxRateId=${taxRateId}`,
                        scroll: { x: "1700px", y: "250px" },
                        onSuccess: params => {
                            this.setState({
                                voucherFilterConfirm: params
                            })
                        },
                        extra: (
                            <div>
                                {
                                    JSON.stringify(voucherFilterConfirm) !== "{}" && composeBotton([{
                                        type: "fileExport",
                                        url: `account/invoiceSale/unrealty/detail/export`,
                                        params: Object.assign(voucherFilterConfirm, filters, {subjectId, taxRateId}),
                                        title: "导出",
                                        userPermissions: ["1361007"]
                                    }])
                                }
                            </div>
                        )
                    }}
                />

                <PopDetailsModal
                    title="发票信息"
                    visible={voucherVisibleInvoice}
                    fields={voucherSearchFieldsInvoice}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisibleInvoice}
                    tableOption={{
                        cardProps: {
                            title: "发票信息列表"
                        },
                        columns: voucherColumnsInvoice,
                        url: `/account/invoiceSale/unrealty/invoiceDetail/?${parseJsonToParams(filters)}&subjectId=${subjectId}&taxRateId=${taxRateId}`,
                        scroll: { x: "2300px", y: "250px" },
                        onSuccess: params => {
                            this.setState({
                                voucherFilterInvoice: params
                            })
                        },
                        extra: (
                            <div>
                                {
                                    JSON.stringify(voucherFilterInvoice) !== "{}" && composeBotton([{
                                        type: "fileExport",
                                        url: `account/invoiceSale/unrealty/invoice/export`,
                                        params: Object.assign(voucherFilterInvoice, filters, {subjectId, taxRateId}),
                                        title: "导出",
                                        userPermissions: ["1361007"]
                                    }])
                                }
                            </div>
                        )
                    }}
                />
            </Layout>
        )
    }
}

export default Form.create()(UnBilledSalesNotEstate);