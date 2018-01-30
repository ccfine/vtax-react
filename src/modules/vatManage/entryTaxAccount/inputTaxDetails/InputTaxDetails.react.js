/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields,fMoney,getUrlParam} from '../../../../utils'
import PopInvoiceInformationModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';

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
class InputTaxDetails extends Component {
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
        visible:false,
        params:{},
    }

    columns = [
        {
            title: '纳税主体',
            dataIndex: 'mainName',
        }, {
            title: '抵扣凭据类型',
            dataIndex: 'sysDictIdName',
        },{
            title: '凭据份数',
            dataIndex: 'num',
            render:(text,record)=>(
                <a onClick={()=>{
                    const params= {
                        mainId:record.mainId,
                        invoiceType:record.sysDictId,
                    }
                    this.setState({
                        params:params
                    },()=>{
                        this.toggleModalVisible(true)
                    })
                }}>{text}</a>
            )
        },{
            title: '金额',
            dataIndex: 'amount',
            render:text=>fMoney(text),
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            render:text=>fMoney(text),

        }
    ];

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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.handleSubmit()
        }
    }
    render(){
        const {tableUpDateKey,filters,visible,params} = this.state;
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
                                        span:6,
                                        componentProps:{
                                            disabled,
                                        },
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
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                            format:'YYYY-MM',
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && (!!search && moment(getUrlParam('authMonthStart'), 'YYYY-MM'))) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }

                            <Col span={6}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card style={{marginTop:10}}>

                    <AsyncTable url="/account/income/taxDetail/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:this.columns,
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                    金额：<span style={code}>{fMoney(data.pageAmount)}</span>
                                                    税额：<span style={code}>{fMoney(data.pageTaxAmount)}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                }} />
                </Card>

                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    params={params}
                    filters={filters}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InputTaxDetails))