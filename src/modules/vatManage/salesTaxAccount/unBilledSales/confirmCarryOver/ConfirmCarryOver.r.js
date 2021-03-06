/**
 * Created by liurunbin on 2018/1/11.
 * 确认结转收入
 */
import React, { Component } from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,TableTotal} from 'compoments'
import {fMoney,getUrlParam,request} from '../../../../../utils'
import ManualMatchRoomModal from './SummarySheetModal'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
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
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
const searchFields =(disabled)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                disabled,
            },
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
            label:'查询期间',
            fieldName:'month',
            type:'monthPicker',
            span:6,
            formItemStyle,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
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
        }
    ]
}
const columns = [
    {
        title:'房间交易档案',
        children:[
            {
                title:'分期',
                dataIndex:'itemName'
            },
            {
                title:'楼栋',
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
                title:'税率',
                dataIndex:'taxRate',
                className:'text-right',
                render:text=>text? `${text}%`: text,
            },
        ]
    },
    {
        title:'上期末合计金额',
        children:[
            {
                title:'增值税收入确认金额',
                dataIndex:'sumTotalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'sumTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售金额',
                dataIndex:'sumNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
        ]
    },
    {
        title:'本期发生额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'totalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'totalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'noInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
        ]
    },
    {
        title:'本期末合计金额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'endTotalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'endTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'endNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
        ]
    },
    {
        title:'未开具发票销售额',
        dataIndex:'totalNoInvoiceSales',
        render:text=>fMoney(text),
        className:'table-money'
    }
];
class ConfirmCarryOver extends Component{
    state={
        tableKey:Date.now(),
        visible:false,
        doNotFetchDidMount:true,
        searchTableLoading:false,
        searchFieldsValues:{

        },
        resultFieldsValues:{

        },
        hasData:false,

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
        totalSource:undefined,
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
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
            this.setState({
                doNotFetchDidMount:false
            },()=>{
                this.refreshTable()
            })

        }else{
            this.setState({
                doNotFetchDidMount:true
            })
        }
    }
    fetchResultStatus = ()=>{
        request.get('/account/output/notInvoiceSale/listMain',{
            params:{
                ...this.state.searchFieldsValues,
                authMonth:this.state.searchFieldsValues.month
            }
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
            .catch(err => {
                message.error(err.message)
            })
    }
    recount = ()=>{
        const { mainId,month:authMonth }  = this.state.resultFieldsValues;

        Modal.confirm({
            title: '友情提醒',
            content: '确定要重算吗',
            onOk : ()=> {
                this.toggleSearchTableLoading(true)
                request.put('/account/output/notInvoiceSale/reset',{mainId, authMonth}
                )
                    .then(({data}) => {
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('重算成功!');
                            this.refreshTable()
                        }else{
                            message.error(`重算失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.toggleSearchTableLoading(false)
                    })
            }
        })
    }
    render(){
        const {tableKey,visible,searchFieldsValues,hasData,doNotFetchDidMount,dataStatus,submitDate,searchTableLoading,totalSource} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={doNotFetchDidMount}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0,
                            resultFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            dataStatus && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'#f5222d'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
                        }
                        <Button size="small" style={{marginRight:5}} disabled={!searchFieldsValues.month} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />查看汇总</Button>
                        <FileExport
                            url={`account/output/notInvoiceSale/export`}
                            title="导出"
                            size="small"
                            disabled={!hasData}
                            setButtonStyle={{
                                marginRight:5
                            }}
                            params={
                                searchFieldsValues
                            }
                        />
                        <Button onClick={this.recount} disabled={parseInt(dataStatus,0)!==1} size='small' style={{marginRight:5}}>
                            <Icon type="retweet" />
                            重算
                        </Button>
                        <SubmitOrRecall type={1} url="/account/output/notInvoiceSale/submit" onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/account/output/notInvoiceSale/revoke" onSuccess={this.refreshTable} />
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'本页合计',
                                    total:[
                                        {title: '上期-增值税收入确认金额合计', dataIndex: 'pageSumTotalPrice'},
                                        {title: '上期-增值税开票金额', dataIndex: 'pageSumTotalAmount'},
                                        {title: '上期末合计金额-未开具发票销售额', dataIndex: 'pageSumNoInvoiceSales'},

                                        {title: '本期-增值税收入确认金额合计', dataIndex: 'pageTotalPrice'},
                                        {title: '本期-增值税开票金额', dataIndex: 'pageTotalAmount'},
                                        {title: '本期-未开具发票销售额', dataIndex: 'pageNoInvoiceSales'},

                                        {title: '本期末合计-增值税收入确认金额合计', dataIndex: 'pageEndTotalPrice'},
                                        {title: '本期末合计-增值税开票金额', dataIndex: 'pageEndTotalAmount'},
                                        {title: '本期末合计-未开具发票销售额', dataIndex: 'pageEndNoInvoiceSales'},
                                    ],
                                },{
                                title:'总计',
                                total:[
                                    {title: '上期-增值税收入确认金额合计', dataIndex: 'allSumTotalPrice'},
                                    {title: '上期-增值税开票金额', dataIndex: 'allSumTotalAmount'},
                                    {title: '上期末合计金额-未开具发票销售额', dataIndex: 'allSumNoInvoiceSales'},

                                    {title: '本期-增值税收入确认金额合计', dataIndex: 'allTotalPrice'},
                                    {title: '本期-增值税开票金额', dataIndex: 'allTotalAmount'},
                                    {title: '本期-未开具发票销售额', dataIndex: 'allNoInvoiceSales'},

                                    {title: '本期末合计-增值税收入确认金额合计', dataIndex: 'allEndTotalPrice'},
                                    {title: '本期末合计-增值税开票金额', dataIndex: 'allEndTotalAmount'},
                                    {title: '本期末合计-未开具发票销售额', dataIndex: 'allEndNoInvoiceSales'},
                                ],
                            }
                            ]
                        } />
                    </div>,
                    /*renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div className="footer-total-meta">
                                    <div className="footer-total-meta-title">
                                        <label>本页合计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        上期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageSumTotalPrice)}</span>
                                        上期-增值税开票金额：<span className="amount-code">{fMoney(data.pageSumTotalAmount)}</span>
                                        上期末合计金额-未开具发票销售额：<span className="amount-code">{fMoney(data.pageSumNoInvoiceSales)}</span>
                                        <br/>
                                        本期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageTotalPrice)}</span>
                                        本期-增值税开票金额：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                        本期-未开具发票销售额 ：<span className="amount-code">{fMoney(data.pageNoInvoiceSales)}</span>
                                        <br/>
                                        本期末合计-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.pageEndTotalPrice)}</span>
                                        本期末合计-增值税开票金额 ：<span className="amount-code">{fMoney(data.pageEndTotalAmount)}</span>
                                        本期末合计-未开具发票销售额 ：<span className="amount-code">{fMoney(data.pageEndNoInvoiceSales)}</span>
                                    </div>
                                    <div className="footer-total-meta-title">
                                        <label>总计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        上期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allSumTotalPrice)}</span>
                                        上期-增值税开票金额：<span className="amount-code">{fMoney(data.allSumTotalAmount)}</span>
                                        上期末合计金额-未开具发票销售额：<span className="amount-code">{fMoney(data.allSumNoInvoiceSales)}</span>
                                        <br/>
                                        本期-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allTotalPrice)}</span>
                                        本期-增值税开票金额：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                        本期-未开具发票销售额 ：<span className="amount-code">{fMoney(data.allNoInvoiceSales)}</span>
                                        <br/>
                                        本期末合计-增值税收入确认金额合计：<span className="amount-code">{fMoney(data.allEndTotalPrice)}</span>
                                        本期末合计-增值税开票金额 ：<span className="amount-code">{fMoney(data.allEndTotalAmount)}</span>
                                        本期末合计-未开具发票销售额 ：<span className="amount-code">{fMoney(data.allEndNoInvoiceSales)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    },*/
                    scroll:{
                        x:'200%'
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            >
                <ManualMatchRoomModal title="汇总信息" month={searchFieldsValues.month} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(ConfirmCarryOver)
