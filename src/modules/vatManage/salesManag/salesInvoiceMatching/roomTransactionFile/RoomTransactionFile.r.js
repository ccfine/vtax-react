/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Modal,message} from 'antd'
import {AsyncTable,FileExport,FileImportModal} from '../../../../../compoments'
import {getFields,request,fMoney} from '../../../../../utils'

const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        render: (text, record) => (
            <span style={{
                color:'#f5222d',
                cursor:'pointer'
            }} onClick={()=>{
                if(parseInt(record.matchingStatus,0) ===1){
                    message.error('只能删除未匹配的数据');
                    return false;
                }
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record.id,()=>{
                            modalRef && modalRef.destroy();
                            context.refreshTable()
                        })
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }}>
                删除
            </span>
        )
    },
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别号',
        dataIndex:'taxIdentificationCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName'
    },
    {
        title:'单元',
        dataIndex:'element'
    },
    {
        title:'房号',
        dataIndex:'roomNumber'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode'
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'房间面积',
        dataIndex:'roomArea'
    },
    {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? '未匹配' : '已匹配' //0:未匹配,1:已匹配
    }
]
class RoomTransactionFile extends Component{
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

        selectedRowKeys:null,
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    selectedRowKeys:null,
                    filters:values
                },()=>{
                    this.refreshTable()
                });
            }
        });
    }
    componentDidMount(){
        this.handleSubmit()
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    deleteRecord = (id,cb) => {
        request.delete(`/output/room/files/delete/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    message.success('删除成功!');
                    cb && cb()
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            })
    }
    render(){
        const {tableUpDateKey,filters} = this.state;
        const {getFieldValue} = this.props.form;
        return(
            <Layout style={{background:'transparent',marginTop:-16}} >
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

                                        },
                                    },
                                    {
                                        label:'项目名称',
                                        fieldName:'projectId',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('mainId') || false,
                                            url:`/project/list/${getFieldValue('mainId')}`,
                                        }
                                    },
                                    {
                                        label:'项目分期',
                                        fieldName:'stagesId',
                                        type:'asyncSelect',
                                        span:6,
                                        componentProps:{
                                            fieldTextName:'itemName',
                                            fieldValueName:'id',
                                            doNotFetchDidMount:true,
                                            fetchAble:getFieldValue('projectId') || false,
                                            url:`/project/stages/${getFieldValue('projectId') || ''}`,
                                        }
                                    },
                                    {
                                        label:'房号',
                                        fieldName:'roomNumber',
                                        type:'input',
                                        span:6
                                    },
                                    {
                                        label:'客户名称',
                                        fieldName:'customerName',
                                        type:'input',
                                        span:6
                                    },
                                    {
                                        label:'发票号码',
                                        fieldName:'invoiceNum',
                                        type:'input',
                                        span:6
                                    },
                                    {
                                        label:'发票代码',
                                        fieldName:'invoiceCode',
                                        type:'input',
                                        span:6
                                    },
                                    {
                                        label:'交易日期',
                                        fieldName:'transactionDate',
                                        type:'rangePicker',
                                        span:6
                                    },
                                ])
                            }

                            <Col style={{width:'100%',textAlign:'right'}}>
                                <Button size="small" style={{marginTop:5,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button size="small" style={{marginTop:5,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card style={{marginTop:10}} extra={
                    <div>
                        <FileImportModal
                            url="/output/room/files/upload"
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
                            style={{marginRight:5}} />
                        <FileExport
                            url='/output/room/files/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                    </div>
                }>
                    <AsyncTable url={'/output/room/files/list'}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    pageSize:10,
                                    size:'small',
                                    renderFooter:data=>{
                                        return(
                                            <div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                                    本页金额：<span className="amount-code">{data.pageAmount}</span>
                                                    本页税额：<span className="amount-code">{data.pageTaxAmount}</span>
                                                    本页价税：<span className="amount-code">{data.pageTotalAmount}</span>
                                                    本页总价：<span className="amount-code">{data.pageTotalPrice}</span>
                                                </div>
                                                <div style={{marginBottom:10}}>
                                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>总计：</span>
                                                    总金额：<span className="amount-code">{data.allAmount}</span>
                                                    总税额：<span className="amount-code">{data.allTaxAmount}</span>
                                                    总价税：<span className="amount-code">{data.allTotalAmount}</span>
                                                    全部总价：<span className="amount-code">{data.allTotalPrice}</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                    columns:getColumns(this)
                                }} />
                </Card>
            </Layout>
        )
    }
}

export default Form.create()(RoomTransactionFile)