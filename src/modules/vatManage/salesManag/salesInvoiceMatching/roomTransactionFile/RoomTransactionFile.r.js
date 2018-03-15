/**
 * Created by liurunbin on 2018/1/8.
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,Modal,message} from 'antd'
import {AsyncTable,FileExport,FileImportModal} from '../../../../../compoments'
import {getFields,request,fMoney,getUrlParam} from '../../../../../utils'
import { withRouter } from 'react-router'
import SubmitOrRecall from '../../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import moment from 'moment';
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
const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        render: (text, record) => {
            return parseInt(context.state.dataStatus,0) === 1 ? (
                <span style={{
                    color:'#f5222d',
                    cursor:'pointer'
                }} onClick={()=>{
                    if(parseInt(record.matchingStatus,0) ===1){
                        const errorModalRef = Modal.warning({
                            title: '友情提醒',
                            content: '只能删除未匹配的数据!',
                            okText: '确定',
                            onOk:()=>{
                                errorModalRef.destroy()
                            },
                            onCancel() {
                                errorModalRef.destroy()
                            },
                        });
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
            ) : ''
        }
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
        /**
         * roomArea 是普通数值型
         * roomArea2 是字符串四位小数型
         * */
        dataIndex:'roomArea2',
        className:'text-right'
    },
    {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? '未匹配' : '已匹配' //0:未匹配,1:已匹配
    },
    {
        title:'交易日期',
        dataIndex:'transactionDate'
    },
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

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

        searchFieldsValues:{

        },
        hasData:false
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for(let key in values){
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }
                    if(moment.isMoment(values[key])){
                        //格式化一下时间 YYYY-MM类型
                        if(moment(values[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                            values[key] = values[key].format('YYYY-MM');
                        }

                        /*if(moment(values[key].format('YYYY-MM-DD'),'YYYY-MM-DD',true).isValid()){
                         values[key] = values[key].format('YYYY-MM-DD');
                         }*/
                    }
                }
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
        const {search} = this.props.location;
        if(!!search){
            this.handleSubmit()
        }
    }
    refreshTable = ()=>{
        /*this.setState({
            tableUpDateKey:Date.now()
        })*/
        this.handleSubmit()
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
    fetchResultStatus = ()=>{
        request.get('/output/room/files/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data.status,
                        submitDate:data.data.lastModifiedDate
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
    }
    render(){
        const {tableUpDateKey,filters,submitDate,dataStatus} = this.state;
        const {getFieldValue} = this.props.form;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <Layout style={{background:'transparent',marginTop:-16}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
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
                                            disabled,
                                        },
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && getUrlParam('mainId')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'交易月份',
                                        fieldName:'transactionDate',
                                        type:'monthPicker',
                                        formItemStyle,
                                        span:6,
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择交易月份'
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        label:'项目名称',
                                        fieldName:'projectId',
                                        type:'asyncSelect',
                                        span:6,
                                        formItemStyle,
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
                                        formItemStyle,
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
                                        formItemStyle,
                                        span:6
                                    },
                                    {
                                        label:'客户名称',
                                        fieldName:'customerName',
                                        type:'input',
                                        formItemStyle,
                                        span:6
                                    },
                                    {
                                        label:'发票号码',
                                        fieldName:'invoiceNum',
                                        type:'input',
                                        formItemStyle,
                                        span:6
                                    },
                                    {
                                        label:'发票代码',
                                        fieldName:'invoiceCode',
                                        type:'input',
                                        formItemStyle,
                                        span:6
                                    },
                                    {
                                        label:'匹配状态',
                                        fieldName:'matchingStatus',
                                        type:'select',
                                        formItemStyle,
                                        span:6,
                                        options:[
                                            {
                                                text:'未匹配',
                                                value:'0'
                                            },
                                            {
                                                text:'已匹配',
                                                value:'1'
                                            }
                                        ]
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
                        <FileImportModal
                            url="/output/room/files/upload"
                            fields={
                                [
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
                                                span:17
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
                                    },
                                    {
                                        label:'交易月份',
                                        fieldName:'transactionDate',
                                        type:'monthPicker',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:6
                                            },
                                            wrapperCol:{
                                                span:17
                                            }
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择交易月份'
                                                }
                                            ]
                                        }
                                    },
                                ]
                            }
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
                        <SubmitOrRecall type={1} url="/output/room/files/submit" onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/output/room/files/revoke" onSuccess={this.refreshTable} />
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
                                    onSuccess:(params,data)=>{
                                        this.setState({
                                            hasData:data.length !==0,
                                            searchFieldsValues:params,
                                        },()=>{
                                            this.state.hasData && this.fetchResultStatus()
                                        })
                                    },
                                    renderFooter:data=>{
                                        return(
                                            <div className="footer-total">
                                                <div>
                                                    <label>本页合计：</label>
                                                    本页总价：<span className="amount-code">{fMoney(data.pageTotalPrice)}</span>
                                                </div>
                                                <div>
                                                    <label>总计：</label>
                                                    全部总价：<span className="amount-code">{fMoney(data.allTotalPrice)}</span>
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

export default Form.create()(withRouter(RoomTransactionFile))