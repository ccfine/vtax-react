/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {AsyncTable} from 'compoments'
import {getFields,fMoney,getUrlParam} from 'utils'
import moment from 'moment';

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
const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目分期名称',
        dataIndex: 'contractNum',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesName',
    },{
        title: '财务期间 ',
        dataIndex: 'voucherDate',
    },{
        title: '科目名称',
        dataIndex: 'creditSubjectName',
    },{
        title: '科目代码',
        dataIndex: 'creditSubjectCode',
    },{
        title: '收入金额',
        dataIndex: 'creditAmount',
        render:text=>fMoney(text),
        className: "table-money"
    }
];

const columns2= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesCode',
    },{
        title: '交易期间 ',
        dataIndex: 'transactionDate',
    },{
        title: '人民币成交总价',
        dataIndex: 'totalPrice',
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render: text => (text ? `${text}%` : text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '价税合计',
        dataIndex: 'sdValorem',
        render:text=>fMoney(text),
        className: "table-money"
    }
];
class IncomeCheck extends Component {
    state={
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
        totalSource:undefined,
        totalSource2:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }

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
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                filters:{
                    mainId:getUrlParam('mainId') || undefined,
                    authMonth:moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    render(){
        const {tableUpDateKey,filters,totalSource,totalSource2} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
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
                                            initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择查询期间'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'项目名称',
                                        fieldName:'projectName',
                                        type:'input',
                                        span:8,
                                        formItemStyle,
                                    }, {
                                        label:'分期名称',
                                        fieldName:'stagesName',
                                        type:'input',
                                        span:8,
                                        formItemStyle,
                                    }
                                ])
                            }

                            <Col span={16} style={{textAlign:'right'}}>
                                <Form.Item>
                                    <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                    <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="财务收入数据"
                      extra={<div>
                            <span>
                                收入合计：{fMoney(totalSource ? totalSource.allAmount : 0.00)}
                            </span>
                      </div>}
                      style={{marginTop:10}}>


                    <AsyncTable url="/income/financeDetails/controller/incomeCheck"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns,
                                    onTotalSource: (totalSource) => {
                                        this.setState({
                                            totalSource
                                        })
                                    },
                                }} />

                </Card>
                <Card title="房间交易信息"
                      extra={<div>
                          <span style={{marginRight:20}}>人民币成交总价合计：{fMoney(totalSource2 ? totalSource2.allAmount : 0.00)}</span>
                          <span style={{marginRight:20}}>税额总价合计：{fMoney(totalSource2 ? totalSource2.allTaxAmount : 0.00)}</span>
                          <span>价税总价合计：{fMoney(totalSource2 ? totalSource2.allTotalPrice : 0.00)}</span>
                      </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/output/room/files/incomeCheck"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns2,
                                    onTotalSource: (totalSource2) => {
                                        this.setState({
                                            totalSource2
                                        })
                                    },
                                }} />

                    <div>
                        <span style={{marginRight:20}}>财务收入金额：{fMoney(totalSource ? totalSource.allAmount : 0.00)}</span>
                        <span style={{marginRight:20}}>营销系统收入：{fMoney(totalSource2 ? totalSource2.allAmount : 0.00)}</span>
                        <span>收入差异金额：{
                            fMoney(parseFloat(totalSource && totalSource.allAmount) - parseFloat(totalSource2 && totalSource2.allAmount) || 0.00)
                        }</span>
                    </div>
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(IncomeCheck)