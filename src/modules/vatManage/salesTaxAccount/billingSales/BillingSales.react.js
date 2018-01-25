/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button} from 'antd'
import {AsyncTable,FileExport} from '../../../../compoments'
import {getFields,fMoney} from '../../../../utils'
import PopInvoiceInformationModal from './popModal'

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
        dataSource1:[],
        dataSource2:[],
    }

    columns = [
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

    notColumns=[
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

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                this.setState({
                    filters:data
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
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
    render(){
        const {tableUpDateKey,filters,dataSource1,dataSource2,visible,sysTaxRateId} = this.state;
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
                <Card title="开票销售统计表-房地产" extra={<div>
                    <FileExport
                        url='/income/invoice/marry/download'
                        fileExportProps={{
                            title:'导入',
                            disabled:!dataSource1.length>0,
                            filters:{
                                isEstate:1,
                                mainId:filters.mainId,
                                authMonth:filters.authMonth
                            }
                        }}
                    />
                </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/account/output/billingSale/list?isEstate=1"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.sysTaxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:this.columns,
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
                        fileExportProps={{
                            title:'导出',
                            disabled:!dataSource2.length>0,
                            exportFilters:{
                                isEstate:0,
                                mainId:filters.mainId,
                                authMonth:filters.authMonth
                            }
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
                                    columns:this.notColumns,
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
                    id={sysTaxRateId}
                    filters={filters}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(BillingSales)