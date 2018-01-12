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
        taxRateId:undefined,
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'taxMethod',
            render:text=>{
                let t='';
                switch (parseInt(text,0)){
                    case 1:
                        t = '简易计税';
                        break;
                    case 2:
                        t = '一般计税';
                        break;
                    case 3:
                        t = '免税';
                        break;
                    default :
                    //no default
                }
                return t;
            }
        }, {
            title: '栏次',
            dataIndex: 'name',
        },{
            title: '开具增值税专用发票',
            children: [
                {
                    title: '数量',
                    dataIndex: 'invoiceTypeSNumber',
                },{
                    title: '销售额',
                    dataIndex: 'invoiceTypeSSale',
                    render:text=>fMoney(text),
                },{
                    title: '销项（应纳）税额 ',
                    dataIndex: 'invoiceTypeSTaxAmount',
                    render:text=>fMoney(text),
                }
            ]
        },{
            title: '开具其他发票',
            children: [
                {
                    title: '数量',
                    dataIndex: 'invoiceTypeCNumber',
                    render:(text,record)=>(
                        <a onClick={()=>{
                            this.setState({
                                taxRateId:record.taxRateId,
                            },()=>{
                                this.toggleModalVisible(true)
                            })
                        }}>{text}</a>
                    )
                },{
                    title: '销售额',
                    dataIndex: 'invoiceTypeCSale',
                    render:text=>fMoney(text),
                },{
                    title: '销项（应纳）税额 ',
                    dataIndex: 'invoiceTypeCTaxAmount',
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
                    children: '',
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

                switch (parseInt(text,0)){
                    case 1:
                        obj.children = '简易计税';
                        break;
                    case 2:
                        obj.children = '一般计税';
                        break;
                    case 0:
                        obj.children = '免税';
                        break;
                    default :
                    //no default
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
                    dataIndex: 'invoiceTypeSNumber',
                },{
                    title: '销售额',
                    dataIndex: 'invoiceTypeSSale',
                    render:text=>fMoney(text),
                },{
                    title: '销项（应纳）税额 ',
                    dataIndex: 'invoiceTypeSTaxAmount',
                    render:text=>fMoney(text),
                }
            ]
        },{
            title: '开具其他发票',
            children: [
                {
                    title: '数量',
                    dataIndex: 'invoiceTypeCNumber',
                    render:(text,record)=>(
                        <a onClick={()=>{
                            this.setState({
                                taxRateId:record.taxRateId,
                            },()=>{
                                this.toggleModalVisible(true)
                            })
                        }}>{text}</a>
                    )
                },{
                    title: '销售额',
                    dataIndex: 'invoiceTypeCSale',
                    render:text=>fMoney(text),
                },{
                    title: '销项（应纳）税额 ',
                    dataIndex: 'invoiceTypeCTaxAmount',
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
                    month: values.month && values.month.format('YYYY-MM')
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
        this.updateTable()
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }

    render(){
        const {tableUpDateKey,filters,visible,taxRateId} = this.state;
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
                                        label:'认证月份',
                                        fieldName:'month',
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
                <Card extra={<div>
                    <FileExport
                        url='/income/invoice/marry/download'
                        title="导出"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                </div>}
                      style={{marginTop:10}}>

                    <AsyncTable url="/output/billing/account/list?isEstate=1"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.taxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:this.columns,
                                }} />
                </Card>
                <Card extra={<div>
                    <FileExport
                        url='/income/invoice/marry/download'
                        title="导出"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                </div>}
                           style={{marginTop:10}}>

                    <AsyncTable url="/output/billing/account/list?isEstate=0"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.taxRateId,
                                    pagination:false,
                                    size:'small',
                                    columns:this.notColumns,
                                }} />
                </Card>

                <PopInvoiceInformationModal
                    title="发票信息"
                    visible={visible}
                    id={taxRateId}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Layout>
        )
    }
}
export default Form.create()(BillingSales)