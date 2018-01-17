/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon} from 'antd'
import {AsyncTable,FileExport,PopUploadModal} from '../../../../compoments'
import {getFields,fMoney} from '../../../../utils'
import PopModal from './popModal'
const spanPaddingRight={
    paddingRight:30
}
const code = {
    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
}
class InterimContractInputTaxTransferredOut extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{
            pageSize:20
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        modalUpDateKey:Date.now(),
        visible:false,
        id:undefined,
    }

    columns = [
        {
            title: '纳税主体',
            dataIndex: 'taxMethod',
        }, {
            title: '产值单/结算单',
            dataIndex: 'name',
        },{
            title: '合同编号',
            dataIndex: 'invoiceTypeSSale',
        },{
            title: '合同名称',
            dataIndex: 'name',
        }, {
            title: '财务签收日期',
            dataIndex: 'name',
        }, {
            title: '金额',
            dataIndex: 'name',
            render:text=>fMoney(text),
        }, {
            title: '税额',
            dataIndex: 'name',
            render:text=>fMoney(text),
        }, {
            title: '价税合计',
            dataIndex: 'name',
            render:text=>fMoney(text),
        }, {
            title: '业务系统确认进项税',
            children: [
                {
                    title: '抵扣金额',
                    dataIndex: 'invoiceTypeCNumber',
                    render:text=>fMoney(text),
                },{
                    title: '转出金额',
                    dataIndex: 'invoiceTypeCSale',
                    render:text=>fMoney(text),
                }
            ]
        }, {
            title: '税务确认进项税',
            children: [
                {
                    title: '抵扣金额',
                    dataIndex: 'invoiceTypeCNumber',
                    render:text=>fMoney(text),
                },{
                    title: '转出金额',
                    dataIndex: 'invoiceTypeCSale',
                    render:text=>fMoney(text),
                }
            ]
        }, {
            title: '进项税额转出差异',
            dataIndex: 'name',
        }, {
            title: '税务分摊比例是否完整',
            dataIndex: 'name',
        }
    ];

    notColumns=[
        {
            title: '项目分期编码',
            dataIndex: 'taxMethod',
        }, {
            title: '项目分期名称',
            dataIndex: 'name',
        },{
            title: '计税方法',
        },{
            title: '金额',
            dataIndex: 'name',
        }, {
            title: '分期税额',
            dataIndex: 'invoiceTypeCNumber',
        }, {
            title: '业务系统确认进项税额',
            children: [
                {
                    title: '分摊比例',
                    dataIndex: 'invoiceTypeCNumber',
                },{
                    title: '转出',
                    dataIndex: 'invoiceTypeCSale',
                    render:text=>fMoney(text),
                }
            ]
        }, {
            title: '税务确认进项税额',
            children: [
                {
                    title: '分摊比例',
                    dataIndex: 'invoiceTypeSNumber',
                },{
                    title: '转出',
                    dataIndex: 'invoiceTypeSSale',
                    render:text=>fMoney(text),
                }
            ]
        }, {
            title: '进项税额转出差异',
            dataIndex: 'name',
        }
    ];

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    month: values.month && values.month.format('YYYY-MM')
                }
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });
    }
    componentDidMount(){
        //this.refreshTable()
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    render(){
        const {tableUpDateKey,modalUpDateKey,filters,visible,id} = this.state;
        const uploadArrList = [
            {
                label:'认证月份',
                fieldName:'authMonth',
                type:'monthPicker',
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
                            message:'请选择认证月份'
                        }
                    ]
                },
            },{
                label:'文件',
                fieldName:'files',
                type:'fileUpload',
                span:24,
                formItemStyle:{
                    labelCol:{
                        span:6
                    },
                    wrapperCol:{
                        span:17
                    }
                },
                componentProps:{
                    buttonText:'点击上传',
                    accept:'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    explain:'文件格式为.XLS,并且不超过5M',
                    //size:2
                },
                fieldDecoratorOptions:{
                    rules:[
                        {
                            required:true,
                            message:'请上传文件'
                        }
                    ]
                },
            }
        ]
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
                                        span:6,
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'合同编号',
                                        fieldName:'contractNum',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入合同编号'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'结算单/产值单',
                                        fieldName:'BillingAndOutput',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入结算单/产值单'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }

                            <Col span={24}  style={{textAlign:'right'}}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card extra={
                            <div>
                                <PopUploadModal
                                    url="/income/invoice/collection/upload"
                                    title="导入"
                                    uploadList={uploadArrList}
                                    uploadArr = {['mainId','authMonth','files']}
                                    onSuccess={()=>{
                                        this.refreshTable()
                                    }}
                                    style={{marginRight:5}} />
                                <FileExport
                                    url='/income/invoice/collection/download'
                                    title="下载导入样表"
                                    size="small"
                                    setButtonStyle={{marginRight:5}}
                                />
                                <Button size='small' style={{marginRight:5}}>
                                    <Icon type="check" />
                                    提交
                                </Button>
                                <Button size='small' style={{marginRight:5}}>
                                    <Icon type="rollback" />
                                    撤回提交
                                </Button>
                                <Button size='small' style={{marginRight:5}}>
                                    <Icon type="retweet" />
                                    重算
                                </Button>
                                <Button size='small' style={{marginRight:5}} onClick={()=>{
                                    this.toggleModalVisible(true)
                                    this.setState({
                                        modalUpDateKey:Date.now()
                                    })
                                }}>
                                    <Icon type="edit" />
                                    设置税务分摊比例
                                </Button>
                                {/*<Button size='small' style={{marginRight:5}}>
                                    <Icon type="form" />
                                    差异调整凭证
                                </Button>*/}
                                <FileExport
                                    url='/account/output/billingSale/export'
                                    title="导出"
                                    size="small"
                                    setButtonStyle={{marginRight:5}}
                                />
                            </div>
                        }
                      style={{marginTop:10}}
                >

                    <AsyncTable url="/account/output/billingSale/list?isEstate=1"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:this.columns,
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                    金额：<span style={code}>{data.pageAmount}</span>
                                                    税额：<span style={code}>{data.pageTaxAmount}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                }} />
                </Card>

                <Card style={{marginTop:10}}>
                    <AsyncTable url="/account/output/billingSale/list?isEstate=0"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:this.notColumns,
                                }} />
                </Card>


                <PopModal
                    title="税务分摊比例列表设置"
                    visible={visible}
                    id={id}
                    tableUpDateKey={modalUpDateKey}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(InterimContractInputTaxTransferredOut)