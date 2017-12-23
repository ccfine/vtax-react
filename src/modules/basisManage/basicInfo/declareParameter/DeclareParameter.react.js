import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,Select,DatePicker} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import PopModal from './popModal'
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '编码',
    dataIndex: 'mainCode',
},{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '税(费)种',
    dataIndex: 'taxType',
    render:text=>{
        text = parseInt(text,0)
        if(text===1){
            return '企业所得税'
        }
        if(text===2){
            return '增值税'
        }
        return ''
    }
},{
    title: '所属期起',
    dataIndex: 'subordinatePeriodStart',
},{
    title: '所属期止',
    dataIndex: 'subordinatePeriodEnd',
},{
    title: '纳税申报',
    dataIndex: 'taxDeclaration',
},{
    title: '纳税形式',
    dataIndex: 'taxDeclaration1',
}];

class DeclareParameter extends Component {
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
        expand:true
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
                if(values.subordinatePeriod && values.subordinatePeriod.length!==0){
                    values.subordinatePeriodStart = values.subordinatePeriod[0].format('YYYY-MM-DD')
                    values.subordinatePeriodEnd= values.subordinatePeriod[1].format('YYYY-MM-DD')
                    values.subordinatePeriod = undefined;
                }
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
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,expand} = this.state;
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
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="mainId" formItemStyle={formItemStyle} form={this.props.form} />
                            </Col>
                            <Col span={8}>
                                <FormItem label='税(费)种' {...formItemStyle}>
                                    {getFieldDecorator(`taxType`,{
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                        >
                                            <Option value={'1'}>增值税</Option>
                                            <Option value={'2'}>企业所得税</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemStyle}
                                    label="所属期起止"
                                >
                                    {getFieldDecorator('subordinatePeriod', {
                                    })(
                                        <RangePicker style={{width:'100%'}} format="YYYY-MM-DD" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign:'right'}}>
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

                    <AsyncTable url="/sys/declarationParam/list"
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
export default Form.create()(DeclareParameter)