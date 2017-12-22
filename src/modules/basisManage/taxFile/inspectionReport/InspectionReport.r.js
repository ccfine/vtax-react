/**
 * Created by liurunbin on 2017/12/21.
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Select,Icon,Modal} from 'antd'
import {request} from '../../../../utils'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import PopModal from './popModal'
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const showDeleteConfirm = ()=>{
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
}
const columns = [{
    title: '编码',
    dataIndex: 'code',
}, {
    title: '纳税主体',
    dataIndex: 'mainName',
},{
    title: '检查组',
    dataIndex: 'checkSets',
},{
    title: '检查类型',
    dataIndex: 'checkType',
},{
    title: '检查期间',
    dataIndex: 'checkStart',
    render:(text,record)=><span>{record.checkStart}-{record.checkEnd}</span>
},{
    title: '检查实施时间',
    dataIndex: 'checkImplementStart',
    render:(text,record)=><span>{record.checkImplementStart}-{record.checkImplementEnd}</span>
},{
    title: '文档编号',
    dataIndex: 'documentNum',
},{
    title: '补缴税款',
    dataIndex: 'taxPayment',
},{
    title: '滞纳金',
    dataIndex: 'lateFee',
},{
    title: '罚款',
    dataIndex: 'fine',
},{
    title: '是否有附件',
    dataIndex: 'isAttachment',
    render:text=>parseInt(text,0) === 1?'是':'否'
}];
class InspectionReport extends Component {
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
        visible:false,
        modalConfig:{
            type:''
        },
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
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
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig} = this.state;
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
            onChange: this.onChange,
            getCheckboxProps:this.getCheckboxProps
        };
        return (
            <Layout style={{background:'transparent'}} >
                <Card title="查询条件">
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="mainId" formItemStyle={formItemStyle} form={this.props.form} />
                            </Col>
                            <Col span={8}>
                                <FormItem label='实施年度' {...formItemStyle}>
                                    {getFieldDecorator(`checkImplementYear`,{
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                        >
                                            <Option value={'2015'}>2015</Option>
                                            <Option value={'2016'}>2016</Option>
                                            <Option value={'2017'}>2017</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
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

                    <AsyncTable url="/report/list"
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
                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(InspectionReport)