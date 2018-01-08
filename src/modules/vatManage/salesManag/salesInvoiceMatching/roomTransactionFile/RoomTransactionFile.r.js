/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {AsyncTable} from '../../../../../compoments'
import {getFields} from '../../../../../utils'
class RoomTransactionFile extends Component{
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

        selectedRowKeys:null,


        //项目名称
        projectItems:[],

        //项目分析
        projectLimitItems:[]
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                this.setState({
                    selectedRowKeys:null,
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });

    }
    render(){
        const {tableUpDateKey,filters} = this.state;
        const initData = {}
        const {getFieldValue} = this.props.form;
        return(
            <Layout style={{background:'transparent',marginTop:-16}} >
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
                                    },
                                    {
                                        label:'项目名称',
                                        fieldName:'123',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('mainId') || false,
                                            url:`/project/list/${getFieldValue('mainId')}`,
                                        }
                                    },
                                    {
                                        label:'项目分期',
                                        fieldName:'111',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('123') || false,
                                            url:`/project/stages/${getFieldValue('123') || ''}`,
                                        }
                                    },
                                    {
                                        label:'房号',
                                        fieldName:'taxableItem',
                                        type:'input',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableItem'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'客户名称',
                                        fieldName:'4423',
                                        type:'input',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableItem'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'发票号码',
                                        fieldName:'3',
                                        type:'input',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableItem'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'发票代码',
                                        fieldName:'12441',
                                        type:'input',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxableItem'],
                                        },
                                        componentProps:{
                                            disabled:true
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
                    <AsyncTable url={'/'}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    pageSize:10,
                                    size:'small',
                                    columns:[]
                                }} />
                </Card>
            </Layout>
        )
    }
}

export default Form.create()(RoomTransactionFile)