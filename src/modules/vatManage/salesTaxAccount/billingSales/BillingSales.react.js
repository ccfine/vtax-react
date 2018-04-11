/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message,Icon} from 'antd'
import {AsyncTable,FileExport} from 'compoments'
import {getFields,fMoney,request,getUrlParam,listMainResultStatus} from 'utils'
import PopInvoiceInformationModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const columns = context => [
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
                    parseInt(text, 0) === 0 ? text  : <a onClick={()=>{
                        context.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'s',
                        },()=>{
                            context.toggleModalVisible(true)
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
                    parseInt(text, 0) === 0 ? text : <a onClick={()=>{
                        context.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'c',
                        },()=>{
                            context.toggleModalVisible(true)
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

const notColumns = context =>[
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
                    parseInt(text, 0) === 0 ? text : <a onClick={()=>{
                        context.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'s',
                        },()=>{
                            context.toggleModalVisible(true)
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
                    parseInt(text, 0) === 0 ? text : <a onClick={()=>{
                        context.setState({
                            sysTaxRateId:record.sysTaxRateId,
                            invoiceType:'c',
                        },()=>{
                            context.toggleModalVisible(true)
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
        dataSource:[],
        dataSource2:[],
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
            this.updateStatus()
        })
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.authMonth){
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                let url= null;
                switch (type){
                    case '提交':
                        url = '/account/output/billingSale/submit';
                        this.requestPost(url,type,values);
                        break;
                    case '撤回':
                        url = '/account/output/billingSale/revoke';
                        this.requestPost(url,type,values);
                        break;
                    case '重算':
                        url = '/account/output/billingSale/reset';
                        this.requestPut(url,type,values);
                        break;
                    default:
                        this.setState({
                            filters:values
                        },()=>{
                            this.refreshTable();
                        });
                }
            }
        });
    }

    requestPut=(url,type,value={})=>{
        request.put(url,value)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    requestPost=(url,type,value={})=>{
        request.post(url,value)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                    //this.props.form.resetFields()
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=()=>{
        request.get('/account/output/billingSale/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.handleSubmit();
        }
    }
    render(){
        const {tableUpDateKey,filters,dataSource,dataSource2,visible,sysTaxRateId,invoiceType,statusParam} = this.state;
        const disabled1 = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((filters.mainId && filters.authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
        const {search} = this.props.location;
        let disabled = !!search;
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
                                        componentProps:{
                                            disabled:disabled
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
                                        label:'查询期间',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                            format:'YYYY-MM',
                                            disabled:disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择查询期间'
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
                <Card title="开票销售统计表-房地产"
                      extra={<div>
                          {
                              dataSource.length>0 && listMainResultStatus(statusParam)
                          }
                          <FileExport
                              url={`account/output/billingSale/export`}
                              title='导出'
                              setButtonStyle={{marginRight:5}}
                              disabled={disabled1 || !dataSource.length>0}
                              params={{
                                  isEstate:1,
                                  ...filters
                              }}
                          />
                          <Button
                              size='small'
                              style={{marginRight:5}}
                              disabled={disabled1}
                              onClick={(e)=>this.handleSubmit(e,'重算')}>
                              <Icon type="retweet" />
                              重算
                          </Button>
                          <Button
                              size='small'
                              style={{marginRight: 5}}
                              disabled={disabled1}
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
                                    columns:columns(this),
                                    onDataChange:(dataSource)=>{
                                        this.setState({
                                            dataSource
                                        })
                                    }
                                }} />
                </Card>
                <Card title="开票销售统计表-非地产" extra={<div>
                    <FileExport
                        url={`account/output/billingSale/export`}
                        title='导出'
                        setButtonStyle={{marginRight:5}}
                        disabled={disabled1 || !dataSource2.length>0}
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
                                    columns:notColumns(this),
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
export default Form.create()(withRouter(BillingSales))