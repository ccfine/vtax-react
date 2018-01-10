/**
 * Created by liurunbin on 2018/1/10.
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Modal,message,Icon,Spin} from 'antd'
import {AsyncTable,FileExport} from '../../../../../compoments'
import {getFields,request} from '../../../../../utils'

const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        fixed:true,
        width:'60px',
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
                解除匹配
            </span>
        )
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum',
        render:(text,record)=>{
            let color = '#333';
            if(record.taxIdentificationCode !== record.purchaseTaxNum){
                /**销项发票的纳税识别号与房间交易档案中的纳税识别号出现不完全匹配时，销项发票的纳税识别号标记为红色字体；*/
                color = '#f5222d';
            }
            if(record.customerName !== record.purchaseName){
                /**销项发票的购货单位与房间交易档案中的客户，不一致时，销项发票中的购货单位标记为蓝色字体；*/
                color = '#1890ff';
            }
            if(record.totalAmount !== record.totalPrice){
                /** 销项发票的价税合计与房间交易档案中的成交总价不一致时，销项发票中的价税合计标记为紫色字体；*/
                color = '#6f42c1'
            }
            return <span style={{color}}>{text}</span>
        }
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
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
        }
    },
    {
        title:'货物名称',
        dataIndex:'commodityName'
    },
    {
        title:'开票日期',
        dataIndex:'billingDate',
        width:'70px'
    },
    {
        title:'金额',
        dataIndex:'amount'
    },
    {
        title:'税率',
        dataIndex:'taxRate'
    },
    {
        title:'税额',
        dataIndex:'taxAmount'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount'
    },
    {
        title:'规格型号',
        dataIndex:'specificationModel'
    },
    {
        title:'匹配时间',
        dataIndex:'marryTime'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别码',
        dataIndex:'taxIdentificationCode'
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
        dataIndex:'totalPrice'
    },
    {
        title:'匹配方式',
        dataIndex:'matchingWay',
        render:text=>parseInt(text,0) === 0 ? '手动匹配' : '自动匹配' //0:手动匹配,1:自动匹配
    },
]
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        if(typeof data[key] !== 'undefined'){
            str += `${key}=${data[key]}&`
        }
    }
    return str;
}
class InvoiceDataMatching extends Component{
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

        /**数据匹配状态*/
        matching:false
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
    toggleMatching = matching =>{
        this.setState({
            matching
        })
    }
    matchData = ()=>{
        //数据匹配
        this.toggleMatching(true);
        request.get('/output/invoice/marry/already/automatic')
            .then(({data})=>{
                this.toggleMatching(false);
                if(data.code===200){
                    message.success('数据匹配完毕');
                    this.refreshTable();
                }else{
                    message.error(`数据匹配失败:${data.msg}`)
                }
            }).catch(err=>{
            message.error(`数据匹配失败:${err.message}`)
        })
    }
    render(){
        const {tableUpDateKey,filters,matching} = this.state;
        const {getFieldValue} = this.props.form;
        return(
            <Layout style={{background:'transparent',marginTop:-16}} >
                <Spin spinning={matching} tip="数据匹配中">
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
                                            label:'开票时间',
                                            fieldName:'billingDate',
                                            type:'rangePicker',
                                            span:6
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
                                            label:'楼栋名称',
                                            fieldName:'buildingName',
                                            type:'input',
                                            span:6
                                        },
                                        {
                                            label:'单元',
                                            fieldName:'roomNumber',
                                            type:'element',
                                            span:6
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
                                            label:'纳税识别号',
                                            fieldName:'taxIdentificationCode',
                                            type:'input',
                                            span:6
                                        },
                                        {
                                            label:'发票号码',
                                            fieldName:'invoiceNum',
                                            type:'input',
                                            span:6
                                        }
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
                            <Button
                                onClick={this.matchData}
                                size='small'
                                style={{marginRight:5}}>
                                <Icon type="copy" />
                                数据匹配
                            </Button>
                            <FileExport
                                url={`/output/invoice/marry/already/export?${parseJsonToParams(filters)}`}
                                title="导出匹配列表"
                                size="small"
                            />
                        </div>
                    }>
                        <AsyncTable url={'/output/invoice/marry/already/list'}
                                    updateKey={tableUpDateKey}
                                    filters={filters}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:true,
                                        pageSize:10,
                                        size:'small',
                                        columns:getColumns(this),
                                        scroll:{
                                            x:'180%'
                                        },
                                        renderFooter:data=>{
                                            return(
                                                <div>合计:待添加</div>
                                            )
                                        }
                                    }} />
                    </Card>
                </Spin>
            </Layout>
        )
    }
}

export default Form.create()(InvoiceDataMatching)