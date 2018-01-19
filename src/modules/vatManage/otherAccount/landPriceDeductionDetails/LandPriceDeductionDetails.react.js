/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon} from 'antd'
import {AsyncTable,FileExport} from '../../../../compoments'
import {getFields,fMoney} from '../../../../utils'
import PageTwo from './TabPage2.r'

const columns = [
    {
        title: '纳税主体',
        dataIndex: 'taxMethod',
    }, {
        title: '项目名称',
        dataIndex: 'name',
    },{
        title: '土地出让合同',
        dataIndex: 'invoiceTypeSNumber',
    },{
        title: '项目分期',
        dataIndex: 'invoiceTypeSSale',
    },{
        title: '是否清算 ',
        dataIndex: 'invoiceTypeSTaxAmount',
    },{
        title: '可售面积(㎡)',
        dataIndex: 'invoiceTypeCNumber',
    },{
        title: '计税方法',
        dataIndex: 'invoiceTypeCSale',
    },{
        title: '分摊抵扣的土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '单方土地成本',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '上期累计销售的建筑面积(㎡)',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '上期累计已扣除土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积（㎡）',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '当期应扣除土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '收入确认金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    }
];
class LandPriceDeductionDetails extends Component {
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
        selectedRowKeys:undefined,
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
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
        const {tableUpDateKey,filters,selectedRowKeys} = this.state;
        const {getFieldValue} = this.props.form;
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
                                        label:'项目名称',
                                        fieldName:'projectId',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',  //名字
                                            fieldValueName:'id',       //值
                                            doNotFetchDidMount:true,    //是否初始化异步请求数据
                                            fetchAble:getFieldValue('mainId') || false, //获取参数
                                            url:`/project/list/${getFieldValue('mainId')}`,
                                        }
                                    },{
                                        label:'项目分期',
                                        fieldName:'stagesId',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('projectId') || false,
                                            url:`/project/stages/${getFieldValue('projectId') || ''}`,
                                        }
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
                                    },
                                ])
                            }

                            <Col span={24} style={{textAlign:'right'}}>
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
                    <FileExport
                        url='/income/invoice/marry/download'
                        title="导出"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                    <Button size='small' style={{marginRight:5}}>
                        <Icon type="retweet" />
                        重算
                    </Button>
                    {/*<Button size='small' style={{marginRight:5}}>
                        <Icon type="check" />
                        清算
                    </Button>*/}
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
                                    columns:columns,
                                    scroll:{x:'200%'},
                                    onRowSelect:(selectedRowKeys)=>{
                                        this.setState({
                                            selectedRowKeys:selectedRowKeys[0]
                                        })
                                    },
                                    rowSelection:{
                                        type:'radio',
                                    },
                                }} />
                </Card>

                {
                    selectedRowKeys && <PageTwo selectedRowKeys={selectedRowKeys} updateKey={tableUpDateKey}/>
                }


            </Layout>
        )
    }
}
export default Form.create()(LandPriceDeductionDetails)