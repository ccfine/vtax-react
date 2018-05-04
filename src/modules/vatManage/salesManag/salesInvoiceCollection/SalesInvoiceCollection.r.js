/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,Modal,message} from 'antd'
import {SearchTable,FileExport,TableTotal} from 'compoments'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,getUrlParam,listMainResultStatus} from 'utils'
import FileImportModal from './fileImportModal'
import PopModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';

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
            type:'monthPicker',
            formItemStyle,
            span:6,
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
            label:'发票号码',
            type:'input',
            fieldName:'invoiceNum',
            span:6,
            formItemStyle,
            fieldDecoratorOptions:{},
            componentProps:{}
        },
        {
            label:'税收分类编码',
            type:'input',
            span:6,
            formItemStyle,
            fieldName:'taxClassificationCoding',
            fieldDecoratorOptions:{}
        },
        {
            label:'税率',
            type:'numeric',
            span:6,
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
            span:6,
            formItemStyle,
            fieldName:'commodityName',
        },
        {
            label:'发票类型',
            fieldName:'invoiceType',
            span:6,
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
                    <Icon title="查看" type="search" style={{ fontSize: 16, color: '#08c' }} />
                </span>
            </div>
        ),
        fixed:'left',
        width:'70px'
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
   /* }, {
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
        dataIndex: 'invoiceDetailNum',*/
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票类型</p>
            <p className="apply-form-list-p2">发票代码</p>
        </div>,
        dataIndex: 'invoiceType',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">发票号码</p>
            <p className="apply-form-list-p2">发票明细号</p>
        </div>,
        dataIndex: 'invoiceNum',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceDetailNum}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">商品名称</p>
            <p className="apply-form-list-p2">金额</p>
        </div>,
        dataIndex: 'commodityName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{fMoney(record.amount)}</p>
            </div>
        )
    },{
        title: <div className="apply-form-list-th">
            <p className="apply-form-list-p1">购货单位</p>
            <p className="apply-form-list-p2">购方税号</p>
        </div>,
        dataIndex: 'purchaseName',
        render:(text,record)=>(
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.purchaseTaxNum}</p>
            </div>
        )
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'75px'/*
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
        className:'table-money'*/
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
        dataSource:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
        hasData:false,
        totalSource:undefined
    }
    fetchResultStatus = ()=>{
        request.get('/output/invoice/collection/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam: data.data,
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
        const {visible,modalConfig,tableKey,searchFieldsValues,hasData,dataSource,totalSource,statusParam} = this.state;
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
                    pageSize:10,
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
                    cardProps: {
                        title: "销项发票采集列表",
                        extra:<div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }
                            <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                                <Icon type="plus" />
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
                            <TableTotal totalSource={totalSource} />

                        </div>,
                    },
                    /*scroll:{
                        x:'180%'
                    },*/
                    onDataChange:(dataSource)=>{
                        this.setState({
                            dataSource
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(SalesInvoiceCollection)