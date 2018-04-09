/**
 * Created by liurunbin on 2018/1/9.
 */
import React, { Component } from 'react'
import {Button,Icon,Modal,message} from 'antd'
import {request,fMoney,getUrlParam} from '../../../../../utils'
import {SearchTable,FileExport} from '../../../../../compoments'
import SubmitOrRecall from '../../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import { withRouter } from 'react-router'
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
const searchFields=(disabled)=>(getFieldValue,setFieldsValue)=> {
    return [
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
            label:'开票月份',
            fieldName:'billingDate',
            type:'monthPicker',
            span:6,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票月份'
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
            label:'楼栋名称',
            fieldName:'buildingName',
            type:'input',
            span:6,
            formItemStyle
        },
        {
            label:'单元',
            fieldName:'element',
            type:'element',
            span:6,
            formItemStyle
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            span:6,
            formItemStyle
        },
        {
            label:'客户名称',
            fieldName:'customerName',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'纳税人识别号',
            fieldName:'taxIdentificationCode',
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
            label:'匹配方式',
            fieldName:'matchingWay',
            type:'select',
            span:6,
            formItemStyle,
            options:[
                {
                    text:'手动匹配',
                    value:'0'
                },
                {
                    text:'自动匹配',
                    value:'1'
                }
            ]
        }
    ]
}
const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        fixed:true,
        width:parseInt(context.state.dataStatus,0) === 1 ? '60px' : '40px',
        render: (text, record) => {
            return parseInt(context.state.dataStatus,0)===1 && (
                    <span style={{
                        color:'#f5222d',
                        cursor:'pointer'
                    }} onClick={()=>{
                        const modalRef = Modal.confirm({
                            title: '友情提醒',
                            content: '是否要解除匹配？',
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
        }
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
        width:'75px'
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        render:text=>text? `${text}%`: text,
    },
    {
        title:'税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
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
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'匹配方式',
        dataIndex:'matchingWay',
        render:text=>{
            text = parseInt(text,0);//0:手动匹配,1:自动匹配
            if(text === 0){
                return '手动匹配';
            }else if(text ===1){
                return '自动匹配';
            }else{
                return ''
            }
        }
    },
]
class InvoiceDataMatching extends Component{
    state={
        tableKey:Date.now(),
        searchFieldsValues:{
        },
        matching:false,
        hasData:false,

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        request.get('/output/invoice/marry/listMain',{
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
    deleteRecord = (id,cb) => {
        request.delete(`/output/invoice/marry/already/delete/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    message.success('解除成功!');
                    cb && cb()
                }else{
                    message.error(`解除匹配失败:${data.msg}`)
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {tableKey,searchFieldsValues,matching,hasData,submitDate,dataStatus} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                style={{
                    marginTop:-16
                }}
                spinning={matching}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        },
                        className:''
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this),
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    url:'/output/invoice/marry/already/list',
                    extra:<div>
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
                        <Button
                            onClick={this.matchData}
                            size='small'
                            style={{marginRight:5}}>
                            <Icon type="copy" />
                            数据匹配
                        </Button>
                        <FileExport
                            url={`output/invoice/marry/already/export`}
                            title="导出匹配列表"
                            size="small"
                            disabled={!hasData}
                            setButtonStyle={{
                                marginRight:5
                            }}
                            params={
                                searchFieldsValues
                            }
                        />
                        <SubmitOrRecall type={1} url="/output/invoice/marry/submit" onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/output/invoice/marry/revoke" onSuccess={this.refreshTable} />
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div className="footer-total-meta">
                                    <div className="footer-total-meta-title">
                                        <label>本页合计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                        本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                        本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                        本页总价：<span className="amount-code">{fMoney(data.pageTotalPrice)}</span>
                                    </div>
                                    <div className="footer-total-meta-title">
                                        <label>总计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                        总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                        总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                        全部总价：<span className="amount-code">{fMoney(data.allTotalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'180%'
                    }
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(InvoiceDataMatching)