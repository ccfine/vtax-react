import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,DatePicker,Input,message } from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import {request,requestDict,fMoney} from '../../../../utils'
import {FileExport} from '../../../../compoments'
import {PopModal, PopUploadModal,PopUndoUploadModal} from './popModal'
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const buttonStyle={
    marginRight:5
}
const spanPaddingRight={
    paddingRight:30
}
const code = {
    /*margin: '0px 30px 0px 1px',
    background: '#2db7f5',
    borderRadius: '3px',
    fontSize: '0.9em',
    border: '1px solid #2db7f5',
    color: '#fff',
    padding: '2px 4px',*/

    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
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
        selectedRows:null,
        visible:false,
        uploaderVisible:false,
        undoUploadVisible:false,
        modalConfig:{
            type:''
        },
        expand:true,
        nssbData:[]
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
    componentDidMount(){
        //获取纳税申报对应的数据字典
        requestDict('NSSB',result=>{
            this.setState({
                nssbData:result
            })
        });
        this.updateTable()

    }
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    toggleUploadModalVisible=uploaderVisible=>{
        this.setState({
            uploaderVisible
        })
    }
    toggleUndoUploadModalVisible=undoUploadVisible=>{
        this.setState({
            undoUploadVisible
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    showModal=type=>{

       if(type === 'edit'){
           let sourceType = parseInt(this.state.selectedRows[0].sourceType,0);
           if(sourceType === 2 ){
               const ref = Modal.warning({
                   title: '友情提醒',
                   content: '该发票信息是外部导入，无法修改！',
                   okText: '确定',
                   onOk:()=>{
                       ref.destroy();
                   }
               });
           }else{
               this.toggleModalVisible(true)
               this.setState({
                   modalConfig:{
                       type,
                       id:this.state.selectedRowKeys
                   }
               })
           }
        }else{
            this.toggleModalVisible(true)
            this.setState({
                modalConfig:{
                    type,
                    id:this.state.selectedRowKeys
                }
            })
        }
    }

    showIsUpload=type=> {
        if (type === 'upload') {
            this.toggleUploadModalVisible(true)
        }else{
            this.toggleUndoUploadModalVisible(true)
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {tableUpDateKey,filters,selectedRowKeys,visible,uploaderVisible,undoUploadVisible,modalConfig,expand} = this.state;
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
                <Card>
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="mainId" formItemStyle={formItemStyle} form={this.props.form} componentProps={{size:"small"}} />
                            </Col>
                            <Col span={8}>
                                <FormItem label='发票号码' {...formItemStyle}>
                                    {getFieldDecorator('invoiceNum',{
                                    })(
                                        <Input size="small" />
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
                                        <RangePicker
                                            style={{width:'100%'}}
                                            format="YYYY-MM"
                                            size="small"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign:'right'}}>
                                <Button size="small" style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button size="small" style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card
                      extra={<div>
                          <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                              <Icon type="file-add" />
                              新增
                          </Button>
                          <Button size="small" onClick={()=>this.showIsUpload('upload')} style={buttonStyle}>
                              <Icon type="upload" />
                              导入
                          </Button>
                          <Button size="small" onClick={()=>this.showIsUpload('undo')} style={buttonStyle}>
                              <Icon type="file-add" />
                              撤销导入
                          </Button>
                          <FileExport
                              url='/income/invoice/collection/download'
                              title="下载导入样表"
                              size="small"
                              setButtonStyle={{marginRight:5}}
                          />
                          <Button size="small" onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="edit" />
                              编辑
                          </Button>
                          <Button size="small" onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="search" />
                              查看
                          </Button>
                          <Button
                              size="small"
                              style={buttonStyle}
                              onClick={()=>{
                                  let sourceType = parseInt(this.state.selectedRows[0].sourceType,0);
                                  if(sourceType === 1 ) {
                                      const ref = Modal.warning({
                                          title: '友情提醒',
                                          content: '该发票信息是外部导入，无法删除！',
                                          okText: '确定',
                                          onOk: () => {
                                              ref.destroy();
                                          }
                                      });
                                  }else {
                                      confirm({
                                          title: '友情提醒',
                                          content: '该删除后将不可恢复，是否删除？',
                                          okText: '确定',
                                          okType: 'danger',
                                          cancelText: '取消',
                                          onOk: () => {
                                              request.delete(`/income/invoice/collection/delete/${this.state.selectedRowKeys[0]}`)
                                                  .then(({data}) => {
                                                      if (data.code === 200) {
                                                          message.success('删除成功!');
                                                          this.updateTable();
                                                      } else {
                                                          message.error(data.msg)
                                                      }
                                                  })
                                              this.toggleModalVisible(false)
                                          },
                                          onCancel: () => {
                                              console.log('Cancel');
                                          },
                                      });
                                  }
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
                                    size:'small',
                                    columns:this.columns,
                                    rowSelection:rowSelection,
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>本页合计：</span>
                                                    本页金额：<span style={code}>{data.pageAmount}</span>
                                                    本页税额：<span style={code}>{data.pageTaxAmount}</span>
                                                    本页价税：<span style={code}>{data.pageTotalAmount}</span>
                                                    本页总价：<span style={code}>{data.pageTotalPrice}</span>
                                                </div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>总计：</span>
                                                    总金额：<span style={code}>{data.allAmount}</span>
                                                    总税额：<span style={code}>{data.allTaxAmount}</span>
                                                    总价税：<span style={code}>{data.allTotalAmount}</span>
                                                    全部总价：<span style={code}>{data.allTotalPrice}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                }} />
                </Card>
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    updateTable={this.updateTable}
                    toggleModalVisible={this.toggleModalVisible}
                />

                <PopUploadModal
                    visible={uploaderVisible}
                    updateTable={this.updateTable}
                    toggleUploadModalVisible={this.toggleUploadModalVisible}
                    title="进项发票采集-导入"
                />

                <PopUndoUploadModal
                    visible={undoUploadVisible}
                    updateTable={this.updateTable}
                    toggleUndoUploadModalVisible={this.toggleUndoUploadModalVisible}
                    title="进项发票采集-撤销导入"
                />
            </Layout>
        )
    }
}
export default Form.create()(InvoiceCollection)