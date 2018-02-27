/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,message } from 'antd'
import {AsyncTable,FileExport,FileImportModal,FileUndoImportModal} from '../../../../compoments'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,requestDict,fMoney,getFields,getUrlParam} from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment';
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const spanPaddingRight={
    paddingRight:30
}
const code = {
    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
}
const transformDataStatus = status =>{
    status = parseInt(status,0)
    if(status===1){
        return '暂存';
    }
    if(status===2){
        return '提交'
    }
    return status
}
const fields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
class InvoiceCollection extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{},

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,
        selectedRows:null,
        visible:false,
        modalConfig:{
            type:''
        },
        nssbData:[],
        statusParam:{},
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
            dataIndex: 'invoiceTypeName',
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
                if(values.authMonth){
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                this.setState({
                    selectedRowKeys:null,
                    filters:values
                },()=>{
                    this.refreshTable();
                });
            }
        });

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
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        },()=>{
            this.updateStatus(this.state.filters);
        })
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
    requestPost=(url,type,values={})=>{
        request.post(url,values)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.updateStatus(values);
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=(values)=>{
        request.get('/income/invoice/collection/listMain',{params:values}).then(({data}) => {
            if (data.code === 200) {
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data.status,
                        submitDate:data.data.lastModifiedDate
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            }
        })
    }
    componentDidMount(){
        //获取纳税申报对应的数据字典
        requestDict('NSSB',result=>{
            this.setState({
                nssbData:result
            })
        });
    }
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }

    render() {
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,dataStatus,submitDate} = this.state;
        const {search} = this.props.location;
        let disabled = !!(search && search.filters);

        const rowSelection = {
            type:'radio',
            width:70,
            fixed:true,
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
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
                                        componentProps:{
                                            disabled
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
                                        label:'发票号码',
                                        fieldName:'invoiceNum',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                            format:"YYYY-MM",
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },

                                    }
                                ])
                            }
                            <Col span={6} style={{textAlign:'right'}}>
                                <Form.Item>
                                    <Button disabled={disabled} size='small' type="primary" htmlType="submit">查询</Button>
                                    <Button disabled={disabled} size='small' style={{marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Card
                      extra={<div>
                          {
                              dataStatus && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                  {
                                      submitDate && <span>提交时间：{submitDate}</span>
                                  }
                              </div>
                          }
                          <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                              <Icon type="file-add" />
                              新增
                          </Button>
                          <FileImportModal
                              url="/income/invoice/collection/upload"
                              title="导入"
                              fields={fields}
                              onSuccess={()=>{
                                  this.refreshTable()
                              }}
                              style={{marginRight:5}} />
                          <FileUndoImportModal
                              url="/income/invoice/collection/revocation"
                              title="撤销导入"
                              onSuccess={()=>{
                                  this.refreshTable()
                              }}
                              style={{marginRight:5}} />
                          <FileExport
                              url={`/income/invoice/collection/download`}
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
                                  if(sourceType === 2 ) {
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
                                                          this.refreshTable();
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
                          <SubmitOrRecall type={1} url="/income/invoice/collection/submit" onSuccess={this.refreshTable} />
                          <SubmitOrRecall type={2} url="/income/invoice/collection/revoke" onSuccess={this.refreshTable} />
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
                                    scroll:{ x: '150%' },
                                    renderFooter:data=>{
                                        return (
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>本页合计：</span>
                                                    本页金额：<span style={code}>{fMoney(data.pageAmount)}</span>
                                                    本页税额：<span style={code}>{fMoney(data.pageTaxAmount)}</span>

                                                    本页价税：<span style={code}>{fMoney(data.pageTotalAmount)}</span>
                                                </div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>总计：</span>
                                                    总金额：<span style={code}>{fMoney(data.allAmount)}</span>
                                                    总税额：<span style={code}>{fMoney(data.allTaxAmount)}</span>
                                                    总价税：<span style={code}>{fMoney(data.allTotalAmount)}</span>
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
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(withRouter(InvoiceCollection))