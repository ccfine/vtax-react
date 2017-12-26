/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import ProjectInformationManagement from './projectInformationManagement'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '编码',
    dataIndex: 'code',
}, {
    title: '纳税主体',
    dataIndex: 'name',
},{
    title: '社会信用代码',
    dataIndex: 'taxNum',
},{
    title: '开业日期',
    dataIndex: 'openingDate',
},{
    title: '税务经办人',
    dataIndex: 'operater',
},{
    title: '经办人电话',
    dataIndex: 'operaterPhone',
},{
    title: '营业状态',
    dataIndex: 'operatingStatus',
    render:text=>parseInt(text,0) ===1?'营业':'停业'
}];
class AubjectOfTaxPayment extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        selectedRowKeys:null,

    }
    handleSubmit = e => {
        e.preventDefault();
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
    updateTable(){
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,filters,selectedRowKeys} = this.state;
        const formItemStyle={
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        }
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
            <Layout style={{background:'transparent'}} >
                <Card title="查询条件">
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="id" formItemStyle={formItemStyle} form={this.props.form} />
                            </Col>
                            <Col span={8} offset={1}>
                                <Button style={{marginTop:3}} type='primary' htmlType="submit">查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="查询结果"
                      extra={<div>
                          <Button style={buttonStyle}>
                              <Icon type="plus-circle" />
                              新增
                          </Button>
                          <Button disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="edit" />
                              编辑
                          </Button>
                          <Button disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="search" />
                              查看
                          </Button>
                          <Button
                              style={buttonStyle}
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
                          <ProjectInformationManagement disabled={!selectedRowKeys} taxSubjectId={selectedRowKeys} />
                      </div>}
                      style={{marginTop:10}}>
                    <AsyncTable url="/taxsubject/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'middle',
                                    columns:columns,
                                    rowSelection:rowSelection
                                }} />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(AubjectOfTaxPayment)