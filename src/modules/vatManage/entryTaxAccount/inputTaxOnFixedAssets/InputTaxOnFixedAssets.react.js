/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Popconfirm} from 'antd'
import {AsyncTable,FileExport,PopUploadModal} from '../../../../compoments'
import {getFields,request} from '../../../../utils'

class InputTaxOnFixedAssets extends Component {
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

    columns = [
        {
            title:'操作',
            key:'actions',
            render:(text,record)=>(
                <div>
                    <Popconfirm title="确定要删除吗?" onConfirm={()=>{this.deleteRecord(record)}} onCancel={()=>{}} okText="删除" cancelText="不删">
                        <a style={{marginRight:"5px"}}>删除</a>
                    </Popconfirm>
                </div>
            ),
            fixed:'left',
            width:'70px',
            className:'text-center'
        },{
            title:'发票类型',
            dataIndex:'invoiceType',
        },{
            title: '期申报抵扣的进项税额',
            dataIndex: 'incomeTaxAmount',
        },{
            title: '本年申报抵扣的进项税额累计',
            dataIndex: 'incomeTaxAmountSum',
        }
    ];
    deleteRecord(record){
        request.delete(`/account/income/fixedAssets/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable()
            } else {
                message.error(data.msg, 4);
            }
        })
            .catch(err => {
                message.error(err.message);
                this.setState({loading:false})
            })
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
        this.refreshTable()
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
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
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
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card extra={<div>
                    <PopUploadModal
                        url="/account/income/fixedAssets/upload"
                        title="导入"
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        style={{marginRight:5}} />
                    <FileExport
                        url='/account/income/fixedAssets/download'
                        title="下载导入模板"
                        setButtonStyle={{marginTop:10,marginRight:5}}
                        size='small'
                    />
                </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/account/income/fixedAssets/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:this.columns,
                                }} />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(InputTaxOnFixedAssets)