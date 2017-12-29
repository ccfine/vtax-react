import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields} from '../../../../utils'
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '发票类型',
    dataIndex: 'invoiceType'
},{
    title: '发票代码',
    dataIndex: 'invoiceCode',
},{
    title: '发票号码',
    dataIndex: 'invoiceNum'
},{
    title: '发票明细号',
    dataIndex: 'invoiceDetailNum',
},{
    title: '开票日期',
    dataIndex: 'billingDate',
},{
    title: '购货单位',
    dataIndex: 'purchaseName',
},{
    title: '购方税号',
    dataIndex: 'purchaseTaxNum',
},{
    title: '商品名称',
    dataIndex: 'commodityName',
},{
    title: '金额',
    dataIndex: 'amount',
},{
    title: '税额',
    dataIndex: 'taxAmount',
},{
    title: '价税合计',
    dataIndex: 'totalAmount',
},{
    title: '税收分类编码',
    dataIndex: 'taxClassificationCoding',
},{
    title: '数据来源',
    dataIndex: 'sourceType',
    render:text=>{
        text = parseInt(text,0);
        if(text===1){
            return '手工采集'
        }
        if(text===2){
            return '外部导入'
        }
        return ''
    }
}];

class SalesInvoiceCollection extends Component {

    state={
        /**
         * params条件，给table用的
         * */
        filters:{
            results:20
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,
        visible:false,
        modalConfig:{
            type:''
        },
        expand:true
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
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
    onChange=(selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys,selectedRows)
        this.setState({
            selectedRowKeys
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,expand} = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange,
            fixed:true
        };
        return (
            <Layout style={{background:'transparent'}} >
                <Card title="查询条件"
                      bodyStyle={{
                          padding:expand?'12px 16px':'0 16px'
                      }}
                      extra={
                          <Icon
                              style={{fontSize:24,color:'#ccc',cursor:'pointer'}}
                              onClick={()=>{this.setState(prevState=>({expand:!prevState.expand}))}}
                              type={`${expand?'up':'down'}-circle-o`} />
                      }>
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        type:'taxMain',
                                        fieldName:'mainId',
                                    },
                                    {
                                        label:'发票号码',
                                        type:'input',
                                        fieldName:'invoiceNum',
                                        fieldDecoratorOptions:{},
                                        componentProps:{}
                                    },
                                    {
                                        label:'税收分类编码',
                                        type:'input',
                                        fieldName:'taxClassificationCoding',
                                        fieldDecoratorOptions:{}
                                    },
                                    {
                                        label:'开票日期',
                                        type:'rangePicker',
                                        fieldName:'billingDate',
                                        fieldDecoratorOptions:{}
                                    },
                                    {
                                        label:'税率',
                                        type:'input',
                                        fieldName:'taxRate',
                                        fieldDecoratorOptions:{}
                                    },
                                    {
                                        label:'商品名称',
                                        type:'input',
                                        fieldName:'commodityName',
                                    },
                                    {
                                        label:'发票类型',
                                        fieldName:'invoiceType',
                                        type:'select',
                                        options:[
                                            {
                                                text:'专票',
                                                value:'s'
                                            },
                                            {
                                                text:'普票',
                                                value:'c'
                                            }
                                        ]
                                    },
                                ])
                            }

                            <Col span={8}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="查询结果"
                      extra={<div>
                          <Button onClick={()=>this.showModal('add')} style={buttonStyle}>
                              <Icon type="file-add" />
                              新增
                          </Button>
                          <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="edit" />
                              编辑
                          </Button>
                          <Button onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="search" />
                              查看
                          </Button>
                          <Button
                              onClick={()=>{
                                  confirm({
                                      title: '友情提醒',
                                      content: '该删除后将不可恢复，是否删除？',
                                      okText: '确定',
                                      okType: 'danger',
                                      cancelText: '取消',
                                      onOk() {
                                          console.log('OK');
                                      },
                                      onCancel() {
                                          console.log('Cancel');
                                      },
                                  });
                              }}
                              disabled={!selectedRowKeys}
                              type='danger'>
                              <Icon type="delete" />
                              删除
                          </Button>
                      </div>}
                      style={{marginTop:10}}>
                    <AsyncTable url="/output/invoice/collection/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'middle',
                                    columns:columns,
                                    rowSelection:rowSelection,
                                    scroll:{
                                        x:'180%'
                                    }
                                }} />
                </Card>

                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(SalesInvoiceCollection)