/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Spin} from 'antd'
import {getFields,getUrlParam,request} from 'utils'
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
        statusParam:{},
        spinning:false,
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
            tableUpDateKey: Date.now(),
        },()=>{
            this.updateStatus()
        })
    }
    updateStatus=()=>{
        request.get('/account/income/taxstructure/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
        })
        .catch(err => {
            message.error(err.message)
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            spinning:b
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.handleSubmit()
        }
    }
    render(){
        const {tableUpDateKey, filters, statusParam,spinning} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <Layout style={{background:'transparent'}} >
                <Spin spinning={spinning}>
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
                                                initialValue: (disabled && (!!search && moment(getUrlParam('authMonth'), 'YYYY-MM'))) || undefined,
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

                                <Col span={12} style={{textAlign:'right'}}>
                                    <Form.Item>
                                    <Button style={{marginLeft:20}} size='small' type="primary" onClick={this.handleSubmit}>查询</Button>
                                    <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                        <TableTaxStructure
                            tableUpDateKey={tableUpDateKey}
                            filters={filters}
                            statusParam={statusParam}
                            toggleSearchTableLoading={this.toggleSearchTableLoading}
                            refreshTable={this.refreshTable}
                        />
                    </Card>
                </Spin>
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InputTaxStructure))


