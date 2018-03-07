/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,Modal,message} from 'antd'
import {SearchTable,FileExport} from '../../../../compoments'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,getUrlParam} from '../../../../utils'
import FileImportModal from './fileImportModal'
import PopModal from './popModal'
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
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields=(disabled)=> {
    return [
        {
            label:'纳税主体',
            type:'taxMain',
            fieldName:'mainId',
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
            label:'发票号码',
            type:'input',
            fieldName:'invoiceNum',
            formItemStyle,
            fieldDecoratorOptions:{},
            componentProps:{}
        },
        {
            label:'税收分类编码',
            type:'input',
            formItemStyle,
            fieldName:'taxClassificationCoding',
            fieldDecoratorOptions:{}
        },
        {
            label:'开票月份',
            type:'monthPicker',
            formItemStyle,
            fieldName:'billingDate',
            componentProps:{
                disabled,
            },
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
            label:'税率',
            type:'numeric',
            formItemStyle,
            fieldName:'taxRate',
            componentProps:{
                valueType:'int'
            },
            fieldDecoratorOptions:{}
        },
        {
            label:'商品名称',
            type:'input',
            formItemStyle,
            fieldName:'commodityName',
        },
        {
            label:'发票类型',
            fieldName:'invoiceType',
            formItemStyle,
            type:'select',
            options:[
                {
                    text:'专票',
                    value:'s'
                },
                {
                    text:'普票',
                    value:'c'
                }
            ]
        },
    ]
}
const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>(
            <div style={{textAlign:'center'}}>
                {
                    parseInt(context.state.dataStatus,0) === 1 && (
                        <span style={pointerStyle} onClick={()=>{
                            const type = parseInt(record.sourceType,0);
                            if(type!==1){
                                Modal.warning({
                                    title: '友情提示',
                                    content: '只能修改手工新增的数据',
                                });
                                return false;
                            }

                            context.setState({
                                modalConfig:{
                                    type:'edit',
                                    id:record.id
                                }
                            },()=>{
                                context.toggleModalVisible(true)
                            })
                        }}>编辑</span>
                    )
                }

                <span style={{
                    ...pointerStyle,
                    marginLeft:5
                }} onClick={()=>{
                    context.setState({
                        modalConfig:{
                            type:'view',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }}>
                    查看
                </span>
            </div>
        ),
        fixed:'left',
        width:'70px'

    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '发票类型',
        dataIndex: 'invoiceType'
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum'
    },{
        title: '发票明细号',
        dataIndex: 'invoiceDetailNum',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'75px'
    },{
        title: '购货单位',
        dataIndex: 'purchaseName',
    },{
        title: '购方税号',
        dataIndex: 'purchaseTaxNum',
    },{
        title: '商品名称',
        dataIndex: 'commodityName',
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '税收分类编码',
        dataIndex: 'taxClassificationCoding',
    },{
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'60px',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return text
        }
    }
];
class SalesInvoiceCollection extends Component{
    state={
        visible:false,
        modalConfig:{
            type:''
        },
        tableKey:Date.now(),
        searchFieldsValues:{

        },

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

        hasData:false
    }
    fetchResultStatus = ()=>{
        request.get('/output/invoice/collection/listMain',{
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
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type
            }
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {visible,modalConfig,tableKey,searchFieldsValues,hasData,submitDate,dataStatus} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:20,
                    columns:getColumns(this),
                    url:'/output/invoice/collection/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !==0
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            dataStatus && hasData && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
                        }
                        <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                            <Icon type="file-add" />
                            新增
                        </Button>
                        <FileImportModal style={{marginRight:5}} />
                        <FileExport
                            url={`output/invoice/collection/export`}
                            title="导出"
                            size="small"
                            disabled={!hasData}
                            params={
                                searchFieldsValues
                            }
                            setButtonStyle={{marginRight:5}}
                        />
                        <FileExport
                            url='output/invoice/collection/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <SubmitOrRecall type={1} url="/output/invoice/collection/submit" onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/output/invoice/collection/revoke" onSuccess={this.refreshTable} />
                    </div>,
                    scroll:{
                        x:'180%'
                    },
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div>
                                    <label>本页合计：</label>
                                    本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                    本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                    本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                </div>
                                <div>
                                    <label>总计：</label>
                                    总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                    总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                    总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                </div>
                            </div>
                        )
                    },
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(SalesInvoiceCollection)