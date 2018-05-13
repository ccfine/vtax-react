/**
 * Created by liurunbin on 2018/1/18.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-07 12:23:47
 *
 */
import React,{Component} from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,ButtonWithFileUploadModal,TableTotal} from 'compoments'
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
import {fMoney,request,getUrlParam} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment';

const searchFields =(disabled)=> (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'查询期间',
            fieldName:'receiveMonth',
            type:'monthPicker',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            },
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:8,
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
const getColumns = ({state}) => [
    {
        title:'项目编号',
        dataIndex:'projectNum',
    },
    {
        title:'项目名称',
        dataIndex:'projectName',
    },
    {
        title:'项目地址',
        dataIndex:'projectAddress',
    },
    {
        title:'预征项目',
        dataIndex:'preProject',
    },
    {
        title:'销售额（含税）',
        dataIndex:'amountWithTax',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'销售额（不含税）',
        dataIndex:'amountWithoutTax',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'实际销售额（不含税）',
        dataIndex:'actualAmountWithoutTax',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'实际预征税额',
        dataIndex:'actualPreTaxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'计税方法',
        dataIndex:'taxMethod',
        className:'text-center',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '一般计税方法'
            }
            if(text===2){
                return '简易计税方法'
            }
            return text;
        }
    },
    {
        title:'扣除金额',
        dataIndex:'deductAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'预征率',
        dataIndex:'rate',
        render:text=>text ? `${text}%` : text
    },
    {
        title:'上期未退税（负数）',
        dataIndex:'taxRebates',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'预征税额',
        dataIndex:'preTaxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'调整销售额（不含税）',
        dataIndex:'adjustSales',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'调整备注',
        dataIndex:'adjustRemark',
    }
];
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
// 总计数据结构，用于传递至TableTotal中
const totalData =  [
    {
        title:'合计',
        total:[
            {title: '销售额（含税）', dataIndex: 'amountWithTax'},
            {title: '销售额（不含税）', dataIndex: 'amountWithoutTax'},
            {title: '实际销售额（不含税）', dataIndex: 'actualAmountWithoutTax'},
            {title: '实际预征税额', dataIndex: 'actualPreTaxAmount'},
            {title: '扣除金额', dataIndex: 'deductAmount'},
            {title: '上期未退税（负数）', dataIndex: 'taxRebates'},
            {title: '预征税额', dataIndex: 'preTaxAmount'},
            {title: '调整销售额（不含税）', dataIndex: 'adjustSales'},
        ],
    }
];
class PrepayTax extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        searchFieldsValues:{

        },

        resultFieldsValues:{

        },

        tableUrl:'/account/prepaytax/list',
        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
        resultStatusId:'',
        hasData:false,
        totalSource:undefined,
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
    recount = ()=>{
        Modal.confirm({
            title: '友情提醒',
            content: '确定要重算吗',
            onOk : ()=> {
                this.toggleSearchTableLoading(true)
                request.put('/account/prepaytax/reset',this.state.resultFieldsValues)
                    .then(({data})=>{
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

    handleClickActions = action => ()=>{
        if(action ==='recount'){
            this.recount();
            return false;
        }
    }

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    fetchResultStatus = ()=>{
        request.get('/account/prepaytax/listMain',{
            params:{
                ...this.state.searchFieldsValues,
                authMonth:this.state.searchFieldsValues.month
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data.status,
                        submitDate:data.data.lastModifiedDate,
                        resultStatusId:data.data.id
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {searchTableLoading,tableKey,submitDate,dataStatus,tableUrl,searchFieldsValues,hasData,resultStatusId,resultFieldsValues,totalSource} = this.state;
        const {mainId,receiveMonth} = resultFieldsValues;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                    /*onResetFields:()=>{
                        this.setState({
                            submitDate:'',
                            dataStatus:''
                        })
                    },*/
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
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0,
                            resultFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    cardProps: {
                        title: "预缴税款台账",
                    },
                    pageSize:100,
                    columns:getColumns(this),
                    url:tableUrl,
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
                        <ButtonWithFileUploadModal
                            id={resultStatusId}
                            disabled={parseInt(dataStatus,0) !== 2}
                            uploadUrl={`/account/prepaytax/upload/${resultStatusId}`}
                            style={{marginRight:5}} title='附件' />
                        <FileExport
                            url={`account/prepaytax/export`}
                            title="导出"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                            disabled={!hasData}
                            params={
                                searchFieldsValues
                            }
                        />
                        <Button onClick={this.handleClickActions('recount')} disabled={parseInt(dataStatus,0)!==1} size='small' style={{marginRight:5}}>
                            <Icon type="retweet" />
                            重算
                        </Button>
                      <SubmitOrRecallMutex
                          buttonSize="small"
                          paramsType="object"
                          url="/account/prepaytax"
                          restoreStr="restore"//撤销接口命名不一致添加属性
                          refreshTable={this.refreshTable}
                          toggleSearchTableLoading={this.toggleSearchTableLoading}
                          hasParam={mainId && receiveMonth}
                          dataStatus={dataStatus}
                          searchFieldsValues={this.state.searchFieldsValues}
                        />
                        <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                    </div>,
                    scroll:{
                        x:'1400px',
                    },
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(PrepayTax)