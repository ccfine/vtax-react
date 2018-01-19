/**
 * author       : liuliyuan
 * createTime   : 2018/1/19 11:09
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,message} from 'antd'
import {AsyncTable,FileExport} from '../../../../../compoments'
import {getFields,fMoney,request} from '../../../../../utils'

const getColumns =context =>[
    {
        title: '纳税主体',
        dataIndex: 'taxMethod',
    }, {
        title: '应税项目',
        dataIndex: 'name',
    },{
        title: '计税方法',
        dataIndex: 'invoiceTypeSNumber',
    },{
        title: '税率',
        dataIndex: 'invoiceTypeSSale',
    },{
        title: '价税合计 ',
        dataIndex: 'invoiceTypeSTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '期初余额',
        dataIndex: 'invoiceTypeCNumber',
        render:text=>fMoney(text),
    },{
        title: '本期发生额',
        dataIndex: 'invoiceTypeCSale',
        render:text=>fMoney(text),
    },{
        title: '本期应扣除金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '本期实际扣除金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '期末余额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '销项税额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '本期实际扣除金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '期末余额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    }
];
class tab1 extends Component {
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
        updateKey:Date.now(),
        dataSource:[],
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    requestPost=(url,type)=>{
        this.setState({ loading:true })
        request.post(url)
            .then(({data})=>{
                this.setState({ loading:false })
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '提交':
                        url = `/account/income/taxContract/adjustment/submit/${data.mainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '撤回':
                        url = `/account/income/taxContract/adjustment/revoke/${data.ainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    case '重算':
                        url = `/account/income/taxContract/adjustment/reset/${data.mainId}/${data.authMonth}`;
                        this.requestPost(url,type);
                        break;
                    default:

                }
                console.log(data);
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        updateKey:Date.now()
                    })
                });
            }
        });
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const {updateKey,filters,dataSource} = this.state;
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
                                    },
                                ])
                            }

                            <Col span={6}  style={{textAlign:'right'}}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="项目信息" extra={
                    <div>
                        {
                            dataSource.length > 0 && <span>
                                {
                                    parseInt(dataSource[0].status, 0)=== 1 ?
                                        <span>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'提交')} style={{marginRight:5}}>
                                                <Icon type="check" />
                                                提交
                                            </Button>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'重算')} style={{marginRight:5}}>
                                                <Icon type="retweet" />
                                                重算
                                            </Button>
                                            <FileExport
                                                url='/account/income/taxContract/adjustment/export'
                                                title="导出"
                                                size="small"
                                                setButtonStyle={{marginRight:5}}
                                            />
                                        </span>
                                        :
                                        <span>
                                            <Button size='small' onClick={(e)=>this.handleSubmit(e,'撤回')} style={{marginRight:5}}>
                                                <Icon type="rollback" />
                                                撤回提交
                                            </Button>
                                        </span>
                                }
                                </span>
                        }

                    </div>

                }
                      style={{marginTop:10}}
                >

                    <AsyncTable url="/account/income/taxContract/adjustment/list"
                                updateKey={updateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:false,
                                    size:'small',
                                    columns:getColumns(this),
                                    scroll:{x:'160%'},
                                    rowSelection:{
                                        type:'radio',
                                    },
                                    onDataChange:(dataSource)=>{
                                        this.setState({
                                            dataSource
                                        })
                                    },
                                    renderFooter:data=>{
                                        return(
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                                    期初余额：<span className="amount-code">{data.pageAmount}</span>
                                                    本期发生额：<span className="amount-code">{data.pageTaxAmount}</span>
                                                    本期应扣除金额：<span className="amount-code">{data.pageTotalAmount}</span>
                                                    本期实际扣除金额：<span className="amount-code">{data.pageTotalPrice}</span>
                                                    期末余额：<span className="amount-code">{data.pageTotalPrice}</span>
                                                    销项税额：<span className="amount-code">{data.pageTotalPrice}</span>
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
export default Form.create()(tab1)