import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,DatePicker,Input,message} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import {request,requestDict,fMoney} from '../../../../utils'
import {FileExport} from '../../../../compoments'
import FileUpload from '../../../basisManage/basicInfo/aubjectOfTaxPayment/projectInformationManagement/FileUpload.r'
import PopModal from './popModal'
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const buttonStyle={
    marginRight:5
}

class InvoiceCollection extends Component {
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
        expand:true,
        nssbData:[]
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    columns = [
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            render:text=>{
                text = parseInt(text,0)
                if(text===1){
                    return '手工采集'
                }
                if(text===2){
                    return '外部导入'
                }
                return ''
            }
        },{
            title: '纳税主体',
            dataIndex: 'mainName',
        }, {
            title: '发票类型',
            dataIndex: 'invoiceType',
        },{
            title: '发票代码',
            dataIndex: 'invoiceCode',
        },{
            title: '发票号码',
            dataIndex: 'invoiceNum',
        },{
            title: '开票日期',
            dataIndex: 'billingDate',
        },{
            title: '认证月份',
            dataIndex: 'authMonth',
        },{
            title: '认证时间',
            dataIndex: 'authDate',
        },{
            title: '销售单位名称',
            dataIndex: 'sellerName',
        },{
            title: '纳税人识别号',
            dataIndex: 'sellerTaxNum',
        },{
            title: '金额',
            dataIndex: 'amount',
            render:text=>fMoney(text)
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            render:text=>fMoney(text)
        },{
            title: '价税合计',
            dataIndex: 'totalAmount',
            render:text=>fMoney(text)
        }
    ];
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            console.log(values);

            if (!err) {
                if(values.authMonth && values.authMonth.length!==0){
                    values.authMonthStartStart = values.authMonth[0].format('YYYY-MM')
                    values.authMonthEnd= values.authMonth[1].format('YYYY-MM')
                    values.authMonth = undefined;
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
    componentDidMount(){
        //获取纳税申报对应的数据字典
        requestDict('NSSB',result=>{
            this.setState({
                nssbData:result
            })
        });
        this.updateTable()

    }
    updateTable=()=>{
        this.handleSubmit()
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
                                <FormItem label='发票号码' {...formItemStyle}>
                                    {getFieldDecorator('invoiceNum',{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemStyle}
                                    label="认证月份"
                                >
                                    {getFieldDecorator('authMonth', {
                                    })(
                                        <ControlledRangePicker
                                            form={this.props.form}
                                            name='authMonth'
                                        />
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
                          <FileUpload taxSubjectId={this.props.taxSubjectId} fetchTable_1_Data={this.fetchTable_1_Data} />
                          <Button onClick={()=>this.showModal('add')} style={buttonStyle}>
                              <Icon type="file-add" />
                              撤销导入
                          </Button>
                          <FileExport
                              url='/income/invoice/collection/download'
                              title="下载导入样表"
                              size="default"
                              setButtonStyle={{marginRight:5}}
                          />
                          <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="edit" />
                              编辑
                          </Button>
                          <Button onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
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
                                      onOk:()=>{

                                          request.delete(`/income/invoice/collection/delete/${this.state.selectedRowKeys[0]}`)
                                              .then(({data})=>{
                                                  if(data.code===200){
                                                      message.success('删除成功!');
                                                      this.updateTable();
                                                  }else{
                                                      message.error(data.msg)
                                                  }
                                              })
                                          this.toggleModalVisible(false)
                                      },
                                      onCancel:()=>{
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

                    <AsyncTable url="/income/invoice/collection/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'middle',
                                    columns:this.columns,
                                    rowSelection:rowSelection
                                }} />
                </Card>
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    updateTable={this.updateTable}
                    toggleModalVisible={this.toggleModalVisible}

                />
            </Layout>
        )
    }
}
export default Form.create()(InvoiceCollection)

class ControlledRangePicker extends React.Component {
    state = {
        mode: ['month', 'month'],
        value: [],
    };

    handlePanelChange = (value, mode) => {
        const {form,name} = this.props;
        form.setFieldsValue({
            [`${name}`]: value,
        });
        this.setState({
            value,
            mode: [
                mode[0] === 'date' ? 'month' : mode[0],
                mode[1] === 'date' ? 'month' : mode[1],
            ],
        });
    }

    render() {
        const { value,mode } = this.state;
        return (
            <RangePicker
                style={{width:'100%'}}
                //placeholder={this.props.placeholder}
                format="YYYY-MM"
                mode={mode}
                value={value}
                onPanelChange={this.handlePanelChange.bind(this)}
            />
        );
    }
}