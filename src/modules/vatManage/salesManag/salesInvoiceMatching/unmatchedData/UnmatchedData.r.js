/**
 * Created by liurunbin on 2018/1/11.
 */
import React, { Component } from 'react'
import {fMoney,getUrlParam,request} from '../../../../../utils'
import {SearchTable,FileExport} from '../../../../../compoments'
import ManualMatchRoomModal from './manualMatchRoomModal.r'
import {message} from 'antd';
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
            span:6
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:18
        }
    }
}
const searchFields=(disabled)=> {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'mainId',
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
            label: '开票月份',
            type: 'monthPicker',
            fieldName: 'billingDate',
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票月份'
                    }
                ]
            }
        },
        {
            label: '货物名称',
            type: 'input',
            fieldName: 'commodityName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '购货单位名称',
            type: 'input',
            fieldName: 'purchaseName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '发票号码',
            type: 'input',
            fieldName: 'invoiceNum',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '税率',
            type: 'numeric',
            fieldName: 'taxRate',
            formItemStyle,
            componentProps: {
                valueType: 'int'
            }
        }
    ]
}
const getColumns = context =>[
    {
        title: '操作',
        key: 'actions',
        fixed:true,
        width:'60px',
        render: (text, record) => (
            <span style={{
                color:'#1890ff',
                cursor:'pointer'
            }} onClick={()=>{
                context.setState({
                    visible:true,
                    selectedData:record
                })
            }}>
                手工匹配
            </span>
        )
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum'
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
        className:'text-right'
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
];
class UnmatchedData extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedData:{},
        hasData:false,

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
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
        const {visible,tableKey,searchFieldsValues,selectedData,hasData,submitDate,dataStatus} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                style={{
                    marginTop:-16
                }}
                searchOption={{
                    fields:searchFields(disabled),
                    getFieldsValues:values=>{
                        this.setState({
                            searchFieldsValues:values
                        })
                    },
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
                    url:'/output/invoice/marry/unmatched/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
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
                        <FileExport
                            url={`/output/invoice/marry/unmatched/export`}
                            title="导出未匹配发票"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                            disabled={!hasData}
                            params={
                                searchFieldsValues
                            }
                        />
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                    本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                    本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                    本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                    本页总价：<span className="amount-code">{fMoney(data.pageTotalPrice)}</span>
                                </div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>总计：</span>
                                    总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                    总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                    总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                    全部总价：<span className="amount-code">{fMoney(data.allTotalPrice)}</span>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'180%'
                    }
                }}
            >
                <ManualMatchRoomModal title="手工匹配房间" selectedData={selectedData} refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(UnmatchedData)