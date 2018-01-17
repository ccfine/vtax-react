/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Popconfirm} from 'antd'
import {AsyncTable,FileExport,PopUploadModal} from '../../../../compoments'
import {getFields,fMoney} from '../../../../utils'
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
const uploadList = [
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
const getColumns = context=> [
    {
        title:'操作',
        render(text, record, index){
            return(
                <span>
                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{context.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                        <a alt="删除" style={{marginRight:"5px"}}><Icon type="delete" /></a>
                    </Popconfirm>
                </span>
            );
        },
        fixed:'left',
        width:'100px',
        dataIndex:'action'
    }, {
        title: '纳税主体',
        dataIndex: 'taxMethod',
    }, {
        title: '减税性质代码',
        dataIndex: 'name',
    },{
        title: '减税性质名称',
        dataIndex: 'invoiceTypeSNumber',
    },{
        title: '凭证号',
        dataIndex: 'invoiceTypeSSale',
    },{
        title: '日期 ',
        dataIndex: 'invoiceTypeSTaxAmount',
    },{
        title: '金额',
        dataIndex: 'invoiceTypeCNumber',
        render:text=>fMoney(text),
    },{
        title: '减免税金额',
        dataIndex: 'invoiceTypeCSale',
        render:text=>fMoney(text),
    },{
        title: '进项税额是否认证抵扣',
        dataIndex: 'invoiceTypeCTaxAmount',
    }
];
class TaxExemptionDetails extends Component {
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
    }
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
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    render(){
        const {tableUpDateKey,filters} = this.state;
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
                                            label:'查询期间',
                                            fieldName:'duringTheInquiry',
                                            type:'monthPicker',
                                            span:6,
                                            componentProps:{
                                            },
                                            fieldDecoratorOptions:{
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请选查询期间'
                                                    }
                                                ]
                                            },
                                        },{
                                            label:'凭证号',
                                            fieldName:'stagesId',
                                            type:'input',
                                            span:6,
                                            componentProps:{

                                            }
                                    },
                                ])
                            }

                            <Col span={6} style={{textAlign:'right'}}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card extra={<div>
                    <div style={{marginRight:30,display:'inline-block'}}>
                        <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>暂存</label></span>
                        <span>提交时间：2017-01-12 17:22</span>
                    </div>
                    <PopUploadModal
                        url="/income/invoice/collection/upload"
                        title="导入"
                        uploadList={uploadList}
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        style={{marginRight:5}}
                    />
                    <FileExport
                        url='/account/income/fixedAssets/download'
                        title="下载导入模板"
                        setButtonStyle={{marginTop:10,marginRight:5}}
                        size='small'
                    />
                    <Button size='small' style={{marginRight:5}}>
                        <Icon type="check" />
                        提交
                    </Button>
                    <Button size='small' style={{marginRight:5}}>
                        <Icon type="rollback" />
                        撤回提交
                    </Button>
                </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/account/output/billingSale/list?isEstate=1"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:getColumns(this),
                                    scroll:{ x: '120%' },
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                    金额：<span style={code}>{data.pageAmount}</span>
                                                    税额：<span style={code}>{data.pageTaxAmount}</span>
                                                    减免税金额：<span style={code}>{data.pageTotalAmount}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                }} />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(TaxExemptionDetails)