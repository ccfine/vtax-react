/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields,fMoney} from '../../../../utils'
import PopInvoiceInformationModal from './popModal'
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
        id:'',
    }

    columns = [
        {
            title: '纳税主体',
            dataIndex: 'mainName',
        }, {
            title: '抵扣凭据类型',
            dataIndex: 'invoiceType',
        },{
            title: '凭据份数',
            dataIndex: 'amount',
            render: (text, record) => (
                  <a onClick={()=>{
                      this.setState({
                          id:record.id ,
                          visible:true,
                      })
                  }}>{text}</a>
            ),
        },{
            title: '金额',
            dataIndex: 'recordName',
            render:text=>fMoney(text),
        },{
            title: '税额',
            dataIndex: 'taxFeeCategory',
            render:text=>fMoney(text),

        }
    ];

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
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
        this.updateTable()
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    render(){
        const {tableUpDateKey,filters,visible,id} = this.state;
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
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        }
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

                    <AsyncTable url="/income/invoice/collection/list"
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
                                                    金额：<span style={code}>{data.pageAmount}</span>
                                                    税额：<span style={code}>{data.pageTaxAmount}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                }} />
                </Card>

                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    id={id}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(InputTaxDetails)