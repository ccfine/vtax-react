/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message} from 'antd'
import { compose } from 'redux';
import {connect} from 'react-redux'
import {SynchronizeTable} from 'compoments'
import {getFields,fMoney,request,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import PopInvoiceInformationModal from './popModal'
import moment from 'moment';

const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
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
        filters:{},

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        visible:false,
        loaded:true,
        sysTaxRateId:undefined,
        invoiceType:undefined,
        statusParam:{},
        dataSource:[],
        notDataSource:[],
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
            this.fetch()
        })
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.authMonth){
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                this.setState({
                    filters:values
                },()=>{
                    this.refreshTable();
                });
            }
        });
    }

    fetch=()=>{
        this.setState({ loaded: false });
        request.get('/account/output/billingSale/list',{
            params:this.state.filters
        }).then(({data}) => {
            if(data.code===200){
                this.setState({
                    dataSource: data.data.records,
                    notDataSource: data.data.notRecords,
                    loaded: true,
                },()=>{
                    this.updateStatus()
                });
            }else{
                message.error(data.msg)
                this.setState({
                    loaded: true
                });
            }
        }).catch(err=>{
            message.error(err)
            this.setState({
                loaded: true
            });
        });

    }

    updateStatus=()=>{
        requestResultStatus('/account/output/billingSale/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const { declare } = this.props;
        if (!!declare) {
            this.setState({
                filters:{
                    mainId:declare.mainId || undefined,
                    authMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    render(){
        const {tableUpDateKey,filters,dataSource,notDataSource,visible,sysTaxRateId,invoiceType,statusParam,loaded} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
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
                                        componentProps:{
                                            disabled:disabled
                                        },
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && declare.mainId) || undefined,
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
                                        componentProps:{
                                            format:'YYYY-MM',
                                            disabled:disabled
                                        },
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
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

                            <Col span={8} style={{textAlign:'right'}}>
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
                              listMainResultStatus(statusParam)
                          }
                          {
                              (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'fileExport',
                                url:'account/output/billingSale/export',
                                title:'导出',
                                params:{
                                    isEstate:1,
                                    ...filters
                                },
                                onSuccess:this.refreshTable
                            },{
                                type:'reset',
                                url:'/account/output/billingSale/reset',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'submit',
                                url:'/account/output/billingSale/submit',
                                params:filters,
                                monthFieldName:'authMonth',
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/output/billingSale/revoke',
                                params:filters,
                                monthFieldName:'authMonth',
                                onSuccess:this.refreshTable,
                            }],statusParam)
                          }
                      </div>
                      }
                      style={{marginTop:10}}>

                    <SynchronizeTable
                        data={dataSource}
                        updateKey={tableUpDateKey}
                        loaded={loaded}
                        tableProps={{
                            rowKey:record=>record.sysTaxRateId,
                            pagination:false,
                            size:'small',
                            columns:columns(this),
                        }} />

                </Card>
                <Card title="开票销售统计表-非地产"
                      extra={<div>
                          {
                              (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'fileExport',
                                url:'account/output/billingSale/export',
                                title:'导出',
                                params:{
                                    isEstate:0,
                                    ...filters
                                },
                                onSuccess:this.refreshTable
                            }])
                          }
                      </div>}
                      style={{marginTop:10}}>

                    <SynchronizeTable
                        data={notDataSource}
                        updateKey={tableUpDateKey}
                        loaded={loaded}
                        tableProps={{
                            rowKey:record=>record.sysTaxRateId,
                            pagination:false,
                            size:'small',
                            columns:notColumns(this),
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
const enhance = compose(
    Form.create(),
    connect( (state) => ({
        declare:state.user.get('declare')
    }))
);
export default enhance(BillingSales);