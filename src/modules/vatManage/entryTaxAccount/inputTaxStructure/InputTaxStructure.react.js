/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {getFields,getUrlParam} from '../../../../utils'
import TableTaxStructure from './TableTaxStructure.react'
import { withRouter } from 'react-router'
import moment from 'moment';

class InputTaxStructure extends Component {
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
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                this.setState({
                    filters:data,
                },()=>{
                    this.refreshTable()
                });
            }
        });
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable=()=>{
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
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" onClick={this.handleSubmit}>查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    <TableTaxStructure
                        tableUpDateKey={this.state.tableUpDateKey}
                        filters={this.state.filters}
                        refreshTable={this.refreshTable}
                    />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InputTaxStructure))


