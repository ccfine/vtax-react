/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import { compose } from 'redux';
import {connect} from 'react-redux'
import {AsyncTable} from 'compoments'
import {getFields,fMoney} from 'utils'
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
        dataIndex: 'stagesName',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
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
            pageSize:100
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
        const {tableUpDateKey,filters,totalSource,totalSource2} = this.state;
        const {getFieldValue} = this.props.form;
        const { declare } = this.props;
        let disabled = !!declare;
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
                                        fieldName:'main',
                                        type:'taxMain',
                                        componentProps:{
                                            labelInValue:true,
                                            disabled:disabled
                                        },
                                        formItemStyle,
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
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择查询期间'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'项目名称',
                                        fieldName:'projectId',
                                        type:'asyncSelect',
                                        span:8,
                                        formItemStyle,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('mainId') || false,
                                            url:`/project/list/${getFieldValue('mainId')}`,
                                        }
                                    }, {
                                        label:'项目分期',
                                        fieldName:'stagesId',
                                        type:'asyncSelect',
                                        span:8,
                                        formItemStyle,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('projectId') || false,
                                            url:`/project/stages/${getFieldValue('projectId') || ''}`,
                                        }
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
                <Card title={<span><label className="tab-breadcrumb">收入检查 / </label>财务收入数据</span>}
                      extra={<div>
                            <span style={{color:'#FF9700'}}>
                                收入合计：{fMoney(totalSource ? totalSource.allAmount : 0.00)}
                            </span>
                      </div>}
                      style={{marginTop:10}}>


                    <AsyncTable url="/output/income/check/voucher"
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
                <Card title={<span><label className="tab-breadcrumb">收入检查 / </label>房间交易信息</span>}
                      extra={<div>
                          <span style={{color:'#FF9700'}}>价税总价合计：{fMoney(totalSource2 ? totalSource2.allTotalAmount : 0.00)}</span>
                      </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/output/income/check/room"
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
                        <span style={{marginRight:20,color:'#FF9700'}}>财务收入金额：{fMoney(totalSource ? totalSource.allAmount : 0.00)}</span>
                        <span style={{marginRight:20,color:'#FF9700'}}>营销系统收入：{fMoney(totalSource2 ? totalSource2.allTotalAmount : 0.00)}</span>
                        <span style={{color:'red'}}>收入差异金额：{
                            fMoney(parseFloat(totalSource && totalSource.allAmount) - parseFloat(totalSource2 && totalSource2.allTotalAmount) || 0.00)
                        }</span>
                    </div>
                </Card>
            </Layout>
        )
    }
}
const enhance = compose(
    Form.create(),
    connect( (state) => ({
        declare:state.user.get('declare')
    }))
);
export default enhance(IncomeCheck);