/**
 * Created by liurunbin on 2018/1/18.
 */
import React,{Component} from 'react'
import {Button,Icon,message} from 'antd'
import {SearchTable,FileExport,ButtonWithFileDownLoadModal} from '../../../../compoments'
import {fMoney,request} from '../../../../utils'
const searchFields = (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
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
            label:'查询期间',
            fieldName:'receiveMonth',
            type:'monthPicker',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldDecoratorOptions:{
                rules:[
                 {
                 required:true,
                 message:'请选择过滤期间'
                 }
                 ]
            },
            componentProps:{
                format:'YYYY-MM'
            }
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        },
    ]
}
const columns = [
    {
        title:'项目编号',
        dataIndex:'mainId',
    },
    {
        title:'项目名称',
        dataIndex:'projectName',
    },
    {
        title:'项目地址',
        dataIndex:'stagesName',
    },
    {
        title:'预征项目',
        dataIndex:'buildingName',
    },
    {
        title:'销售额（含税）',
        dataIndex:'element',
    },
    {
        title:'销售额（不含税）',
        dataIndex:'roomNumber',
    },
    {
        title:'实际销售额（不含税）',
        dataIndex:'deliveryTime',
        className:'text-center',
    },
    {
        title:'实际预征税额',
        dataIndex:'receiveMonth',
        className:'text-center',
    },
    {
        title:'计税方法',
        dataIndex:'housingStatus',
        className:'text-center',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '期房'
            }
            if(text===2){
                return '现房'
            }
            return text;
        }
    },
    {
        title:'扣除金额',
        dataIndex:'cumulativePrepaidPayment',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'预征率',
        dataIndex:'currentIncomeAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'上期未退税（负数）',
        dataIndex:'cumulativeIncomeAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'预征税额',
        dataIndex:'prepaidSales',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'调整销售额（不含税）',
        dataIndex:'roomCode',
    },
    {
        title:'调整备注',
        dataIndex:'roomCode2',
    }
];

export default class PrepayTax extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        searchFieldsValues:{

        }
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }
    handleClickActions = action => ()=>{
        let actionText,
            actionUrl;
        switch (action){
            case 'submit':
                actionText='提交';
                actionUrl='/account/salehouse/restore';
                break;
            case 'restore':
                actionText='撤回';
                actionUrl='/account/salehouse/restore';
                break;
            case 'recount':
                actionText='重算';
                actionUrl='/account/salehouse/restore';
                break;
            default:
                break;
        }
        this.toggleSearchTableLoading(true)
        const {mainId,receiveMonth} = this.state.searchFieldsValues;
        request.post(`${actionUrl}/${mainId}/${receiveMonth}`)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${actionText}成功！`);
                    this.refreshTable();
                }else{
                    message.error(`${actionText}失败:${data.msg}`)
                }
            }).catch(err=>{
            this.toggleSearchTableLoading(false)
        })
    }
    render(){
        const {searchTableLoading,tableKey} = this.state;
        const {mainId,receiveMonth} = this.state.searchFieldsValues

        return(
            <SearchTable
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        className:''
                    },
                    onFieldsChange:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                searchFieldsValues:{
                                    mainId:undefined,
                                    receiveMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.receiveMonth){
                            if(values.receiveMonth){
                                values.receiveMonth = values.receiveMonth.format('YYYY-MM')
                            }
                            this.setState(prevState=>({
                                searchFieldsValues:{
                                    ...prevState.searchFieldsValues,
                                    ...values
                                }
                            }))
                        }
                    }
                }}
                doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/account/salehouse/list',
                    extra:<div>
                        <div style={{marginRight:30,display:'inline-block'}}>
                            <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>暂存</label></span>
                            <span>提交时间：2017-01-12 17:22</span>
                        </div>
                        <FileExport
                            url={`account/salehouse/download`}
                            title="导出"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <ButtonWithFileDownLoadModal
                            fetchOptions={{
                                url:'/card/land/use/file/list/952736190626439170'
                            }}
                            downLoadOptions={{
                                url:'/'
                            }}
                            style={{marginRight:5}} title='附件' />
                        <Button onClick={this.handleClickActions('recount')} disabled={!(mainId && receiveMonth)} size='small' style={{marginRight:5}}>
                            <Icon type="retweet" />
                            重算
                        </Button>
                        <Button size="small" style={{marginRight:5}} onClick={this.handleClickActions('submit')} disabled={!(mainId && receiveMonth)}><Icon type="file-add" />提交</Button>
                        <Button size="small" onClick={this.handleClickActions('restore')} disabled={!(mainId && receiveMonth)}><Icon type="rollback" />撤回提交</Button>
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                    累计结转收入金额：<span className="amount-code">{fMoney(data.pageCumulativeIncomeAmount)}</span>
                                    累计预收价款：<span className="amount-code">{fMoney(data.pageCumulativePrepaidPayment)}</span>
                                    当期结转收入金额：<span className="amount-code">{fMoney(data.pageCurrentIncomeAmount)}</span>
                                    当期预收价款：<span className="amount-code">{fMoney(data.pageCurrentPrepaidPayment)}</span>
                                    预缴销售额：<span className="amount-code">{fMoney(data.pagePrepaidSales)}</span>
                                </div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>总计：</span>
                                    累计结转收入金额：<span className="amount-code">{fMoney(data.totalCumulativeIncomeAmount)}</span>
                                    累计预收价款：<span className="amount-code">{fMoney(data.totalCumulativePrepaidPayment)}</span>
                                    当期结转收入金额：<span className="amount-code">{fMoney(data.totalCurrentIncomeAmount)}</span>
                                    当期预收价款：<span className="amount-code">{fMoney(data.totalCurrentPrepaidPayment)}</span>
                                    预缴销售额：<span className="amount-code">{fMoney(data.totalPrepaidSales)}</span>
                                </div>
                            </div>
                        )
                    },
                    scroll:{
                        x:'1400px',
                    },
                }}
            >
            </SearchTable>
        )
    }
}