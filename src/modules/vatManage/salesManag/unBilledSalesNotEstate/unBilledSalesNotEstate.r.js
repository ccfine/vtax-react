/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Modal} from 'antd'
import { compose } from 'redux';
import {connect} from 'react-redux'
import { AsyncTable } from "compoments";
import {request, getFields, fMoney, listMainResultStatus,composeBotton,requestResultStatus } from "utils";
import moment from 'moment';
import PopModal from "./popModal";

const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const columns = (context) => [
    {
        title: "项目",
        dataIndex: "taxMethod",
        render: (text) => {
            let tempText = '';
            switch(text){
                case '1':
                    tempText='一般计税';
                    break;
                case '2':
                    tempText='简易计税';
                    break;
                default:
                    tempText='';
                    break;
            }
            return tempText;
        },
        footer: (data) => {
            return <div>Summary: {data.taxMethod}</div>
        },
    }, {
        title: "税率",
        dataIndex: "taxRate",
        render: text => `${text}${text ? "%" : ""}`
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
            dataIndex: 'projectName',
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
            dataIndex: "taxRate",
            render: text => `${text}${text ? "%" : ""}`
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
class UnBilledSalesNotEstate extends Component {
    state={
        visible: false, // 控制Modal是否显示
        opid: "", // 当前操作的记录
        /**
         * params条件，给table用的
         * */
        filters:{
            pageSize:10
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        statusParam: {},
        dataSource:[],

    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }

    updateStatus = () => {
        requestResultStatus('/account/notInvoiceUnSale/realty/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
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
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.authMonth) {
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }

                this.setState({
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
            this.setState({
                filters:{
                    mainId:declare.mainId || undefined,
                    authMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    render(){
        const {tableUpDateKey,filters,statusParam} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            noSubmit = parseInt(statusParam.status,10)===1;

        return(
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        componentProps:{
                                            disabled:disabled
                                        },
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && declare.mainId) || undefined,
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
                                        formItemStyle,
                                        fieldDecoratorOptions: {
                                            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择查询期间'
                                                }
                                            ]
                                        }
                                    }
                                ])
                            }

                            <Col span={8} style={{textAlign:'right'}}>
                                <Form.Item>
                                    <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                    <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title={<span>未开票销售台账-非地产汇总列表</span>}
                      extra={<div>
                          {listMainResultStatus(statusParam)}
                          {
                              (disabled && declare.decAction==='edit') && composeBotton([{
                                  type:'reset',
                                  url:'/account/notInvoiceUnSale/realty/reset',
                                  params:filters,
                                  userPermissions:['1361009'],
                                  onSuccess:this.refreshTable
                              },{
                                  type:'submit',
                                  url:'/account/notInvoiceUnSale/realty/submit',
                                  params:filters,
                                  userPermissions:['1361010'],
                                  onSuccess:this.refreshTable
                              },{
                                  type:'revoke',
                                  url:'/account/notInvoiceUnSale/realty/revoke',
                                  params:filters,
                                  userPermissions:['1361011'],
                                  onSuccess:this.refreshTable,
                              }],statusParam)
                          }
                      </div>}
                      style={{marginTop:10}}>


                    <AsyncTable url="/account/notInvoiceUnSale/realty/list?orderByField=taxMethod"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns(this),
                                    onSuccess:this.updateStatus,
                                    onDataChange:(dataSource)=>{
                                        this.setState({
                                            dataSource
                                        })
                                    },
                                }} />

                </Card>
                <Card title={<span>未开票销售台账-非地产手工新增列表</span>}
                      extra={<div>
                          {
                              (disabled && declare.decAction==='edit') && composeBotton([{
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

                    <AsyncTable url="/account/notInvoiceUnSale/realty/details/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns2(this, noSubmit && disabled && declare.decAction==='edit'),
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
                />

            </Layout>
        )
    }
}

export default Form.create()(UnBilledSalesNotEstate);