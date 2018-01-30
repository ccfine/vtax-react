import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,DatePicker} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import PopModal from './popModal'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '档案类型',
    dataIndex: 'taxType',
},{
    title: '归档日期',
    dataIndex: 'type',
},{
    title: '归档资料名称',
    dataIndex: 'documentNum',
}];

class DeclareFile extends Component {
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
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.subordinatePeriod && values.subordinatePeriod.length!==0){
                    values.subordinatePeriodStart = values.subordinatePeriod[0].format('YYYY-MM-DD')
                    values.subordinatePeriodEnd = values.subordinatePeriod[1].format('YYYY-MM-DD')
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
        const {getFieldDecorator} = this.props.form;
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
                            <Col span={8} style={{textAlign:'right'}}>
                                <FormItem>
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="查询结果"
                      extra={<div>
                          <Button disabled={!selectedRowKeys} size='small' onClick={()=>this.showModal('add')} style={buttonStyle}>
                              <Icon type="file-add" />
                              查看附件
                          </Button>
                          <Button size='small' onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="search" />
                              查看
                          </Button>
                      </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/sys/declarationParam/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'small',
                                    columns:columns,
                                    rowSelection:rowSelection
                                }} />
                </Card>
                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(DeclareFile)

