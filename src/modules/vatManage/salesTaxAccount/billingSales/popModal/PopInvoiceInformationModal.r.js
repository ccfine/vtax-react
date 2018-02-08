/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Card,Row,Col,Form,Button,Modal } from 'antd'
import {AsyncTable,FileExport} from '../../../../../compoments'
import {getFields,fMoney} from '../../../../../utils'
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
const columns = [
    {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:100,
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:100,
    },{
        title:'发票类型',
        dataIndex:'invoiceType',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        },
        width:60,
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:100,
    },{
        title: '购货单位名称',
        dataIndex: 'purchaseName',
        width:100,
    },{
        title: '购方税号',
        dataIndex: 'purchaseTaxNum',
        width:150,
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        width:100,
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        width:100,
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        width: 100,
        render:text=>fMoney(text),
    }
];
class PopInvoiceInformationModal extends Component{
    static defaultProps={
        visible:true,
    }

    state={
        /**
         * params条件，给table用的
         * */
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        dataSource:[],
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.toggleModalVisible(false)
    }

    updateTable=()=>{
        this.handleSubmit()
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
        }else{
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.updateTable()
            },200)
        }
    }
    render(){
        const {tableUpDateKey,filters,dataSource } = this.state;
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={this.handleReset}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
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
                                        label:'发票号码',
                                        fieldName:'invoiceCode',
                                        type:'input',
                                        span:6,
                                        componentProps:{
                                        }
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
                        url='/account/output/billingSale/detail/export'
                        title='导出'
                        setButtonStyle={{marginRight:5}}
                        disabled={!dataSource.length>0}
                        params={{
                            ...props.filters,
                            ...filters
                        }}
                    />
                </div>}
                      style={{marginTop:10}}>

                </Card>

                <AsyncTable url="/account/output/billingSale/detail/list"
                            updateKey={tableUpDateKey}
                            filters={{
                                ...props.filters,
                                ...filters
                            }}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:true,
                                size:'small',
                                columns:columns,
                                scroll:{ x: '160%', y: 200 },
                                onDataChange:(dataSource)=>{
                                    this.setState({
                                        dataSource
                                    })
                                },
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
            </Modal>
        )
    }
}
export default Form.create()(PopInvoiceInformationModal)