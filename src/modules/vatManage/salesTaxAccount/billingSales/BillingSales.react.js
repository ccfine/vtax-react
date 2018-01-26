/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Icon} from 'antd'
import {AsyncTable,FileExport} from '../../../../compoments'
import {getFields,fMoney,request} from '../../../../utils'
import PopInvoiceInformationModal from './popModal'
const columns = [
    {
        title: '项目',
        dataIndex: 'taxMethod',
    }, {
        title: '栏次',
        dataIndex: 'name',
    },{
        title: '开具增值税专用发票',
        children: [
            {
                title: '数量',
                dataIndex: 'specialInvoiceCount',
                render:(text,record)=>(
                    <a onClick={()=>{
                        this.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'s',
                        },()=>{
                            this.toggleModalVisible(true)
                        })
                    }}>{text}</a>
                )
            },{
                title: '销售额',
                dataIndex: 'specialInvoiceAmount',
                render:text=>fMoney(text),
            },{
                title: '销项（应纳）税额 ',
                dataIndex: 'specialInvoiceTaxAmount',
                render:text=>fMoney(text),
            }
        ]
    },{
        title: '开具其他发票',
        children: [
            {
                title: '数量',
                dataIndex: 'otherInvoiceCount',
                render:(text,record)=>(
                    <a onClick={()=>{
                        this.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'c',
                        },()=>{
                            this.toggleModalVisible(true)
                        })
                    }}>{text}</a>
                )
            },{
                title: '销售额',
                dataIndex: 'otherInvoiceAmount',
                render:text=>fMoney(text),
            },{
                title: '销项（应纳）税额 ',
                dataIndex: 'otherInvoiceTaxAmount',
                render:text=>fMoney(text),
            }
        ]
    }
];

const notColumns=[
    {
        title: '项目',
        dataIndex: 'taxMethod',
        render: (text, row, index) => {
            const obj = {
                children: text,
                props: {},
            };
            if (index === 0) {
                obj.props.rowSpan = 6;
            }
            if (index === 6) {
                obj.props.rowSpan = 4;
            }
            if (index === 10) {
                obj.props.rowSpan = 1;
            }
            // These two are merged into above cell
            if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 7 || index === 8 || index === 9  || index === 11 ) {
                obj.props.rowSpan = 0;
            }
            return obj;
        }
    }, {
        title: '栏次',
        dataIndex: 'name',
    },{
        title: '开具增值税专用发票',
        children: [
            {
                title: '数量',
                dataIndex: 'specialInvoiceCount',
                render:(text,record)=>(
                    <a onClick={()=>{
                        this.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'s',
                        },()=>{
                            this.toggleModalVisible(true)
                        })
                    }}>{text}</a>
                )
            },{
                title: '销售额',
                dataIndex: 'specialInvoiceAmount',
                render:text=>fMoney(text),
            },{
                title: '销项（应纳）税额 ',
                dataIndex: 'specialInvoiceTaxAmount',
                render:text=>fMoney(text),
            }
        ]
    },{
        title: '开具其他发票',
        children: [
            {
                title: '数量',
                dataIndex: 'otherInvoiceCount',
                render:(text,record)=>(
                    <a onClick={()=>{
                        this.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'c',
                        },()=>{
                            this.toggleModalVisible(true)
                        })
                    }}>{text}</a>
                )
            },{
                title: '销售额',
                dataIndex: 'otherInvoiceAmount',
                render:text=>fMoney(text),
            },{
                title: '销项（应纳）税额 ',
                dataIndex: 'otherInvoiceTaxAmount',
                render:text=>fMoney(text),
            }
        ]
    }
];
class BillingSales extends Component {
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
        sysTaxRateId:undefined,
        invoiceType:undefined,
        statusParam:{},
        dataSource1:[],
        dataSource2:[],
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '保存':
                        url = '/account/output/billingSale/save';
                        this.requestPost(url,type,data);
                        break;
                    case '提交':
                        url = '/account/output/billingSale/submit';
                        this.requestPost(url,type,data);
                        break;
                    case '撤回':
                        url = '/account/output/billingSale/revoke';
                        this.requestPost(url,type,data);
                        break;
                    case '重算':
                        url = '/account/output/billingSale/reset';
                        this.fetch(url,data);
                        break;
                    default:
                        this.setState({
                            filters:data
                        },()=>{
                            this.setState({
                                tableUpDateKey:Date.now()
                            })
                        });
                        this.updateStatus(data);

                }
            }
        });
    }
    requestPost=(url,type,data={})=>{
        request.post(url,data)
            .then(({data})=>{
                if(data.code===200){
                    const props = this.props;
                    message.success(`${type}成功!`);
                    props.refreshTable();
                    this.props.form.resetFields()
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    fetch=(url,params = {})=>{
        request.get(url,{
            params:params
        })
            .then(({data}) => {
                if(data.code===200){
                    message.success('重算成功!');
                    this.setState({
                        resetDataSource:data.data.page.records,
                        footerDate:data.data,
                        isShowResetDataSource:true
                    })
                    this.props.form.resetFields()
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            });
    }
    componentDidMount(){
        //this.refreshTable()
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
    updateStatus=(values)=>{
        request.get('/account/landPrice/deductedDetails/listMain',{params:values}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data
                })
            }
        })
    }
    render(){
        const {tableUpDateKey,filters,dataSource1,dataSource2,visible,sysTaxRateId,invoiceType,statusParam} = this.state;
        const disabled = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1) && (dataSource1.length > 0));
        const disabled2 = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2) && (dataSource1.length > 0));
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
                                        label:'查询期间',
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

                            <Col span={6}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="开票销售统计表-房地产"
                      extra={<div>
                          {
                              (JSON.stringify(statusParam) !== "{}" && dataSource1.length > 0) &&
                              <div style={{marginRight: 30, display: 'inline-block'}}>
                                  <span style={{marginRight: 20}}>状态：<label
                                      style={{color: parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                                  <span>提交时间：{statusParam.lastModifiedDate}</span>
                              </div>
                          }
                          <FileExport
                              url='/account/output/billingSale/export'
                              title='导出'
                              setButtonStyle={{marginRight:5}}
                              disabled={!dataSource1.length>0}
                              params={{
                                  isEstate:1,
                                  ...filters
                              }}
                          />
                          <Button
                              size='small'
                              style={{marginRight:5}}
                              disabled={disabled}
                              onClick={(e)=>this.handleSubmit(e,'重算')}>
                              <Icon type="retweet" />
                              重算
                          </Button>
                          <Button
                              size='small'
                              style={{marginRight: 5}}
                              disabled={disabled}
                              onClick={(e)=>this.handleSubmit(e,'保存')}>
                              <Icon type="save"/>
                              保存
                          </Button>
                          <Button
                              size='small'
                              style={{marginRight: 5}}
                              disabled={disabled}
                              onClick={(e) => this.handleSubmit(e,'提交')}>
                              <Icon type="check"/>
                              提交
                          </Button>
                          <Button
                              size='small'
                              style={{marginRight: 5}}
                              disabled={disabled2}
                              onClick={(e) => this.handleSubmit(e,'撤回')}>
                              <Icon type="rollback"/>
                              撤回提交
                          </Button>
                      </div>
                      }
                      style={{marginTop:10}}>

                    <AsyncTable url="/account/output/billingSale/list?isEstate=1"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:columns,
                                    onDataChange:(dataSource1)=>{
                                        this.setState({
                                            dataSource1
                                        })
                                    }
                                }} />
                </Card>
                <Card title="开票销售统计表-非地产" extra={<div>
                    <FileExport
                        url='/account/output/billingSale/export'
                        title='导出'
                        setButtonStyle={{marginRight:5}}
                        disabled={!dataSource2.length>0}
                        params={{
                            isEstate:0,
                            ...filters
                        }}
                    />
                </div>}
                           style={{marginTop:10}}>

                    <AsyncTable url="/account/output/billingSale/list?isEstate=0"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:notColumns,
                                    onDataChange:(dataSource2)=>{
                                        this.setState({
                                            dataSource2
                                        })
                                    }
                                }} />
                </Card>

                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    filters={{
                        ...filters,
                        invoiceType,
                        taxRateId:sysTaxRateId
                    }}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(BillingSales)