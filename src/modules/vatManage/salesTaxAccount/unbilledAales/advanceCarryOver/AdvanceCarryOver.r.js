/**
 * Created by liurunbin on 2018/1/16.
 * 预结转收入
 */
import React, { Component } from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../../compoments'
import {fMoney,request,getUrlParam} from '../../../../../utils'
import SubmitOrRecall from '../../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import { withRouter } from 'react-router'
import moment from 'moment';
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
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            formItemStyle,
            componentProps:{
                disabled,
                format:'YYYY-MM',
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
        },
        {
            label:'楼栋',
            fieldName:'buildingName',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            formItemStyle,
            span:6
        }
    ]
}
const columns = [
    {
        title:'分期名称',
        dataIndex:'itemName'
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
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text ? `${text}%` : ''
    },
    {
        title:'预结转收入金额',
        dataIndex:'advanceIncomeAmount',
        render:text=>fMoney(text),
        className:'table-money'
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
class AdvanceCarryOver extends Component{
    state={
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedRowKeys:[],

        searchTableLoading:false,
        doNotFetchDidMount:true,
        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

        hasData:false
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    fetchResultStatus = ()=>{
        request.get('/account/output/notInvoiceAdvance/listMain',{
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
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/account/output/notInvoiceAdvance/delete/${this.state.selectedRowKeys.toString()}`)
                    .then(({data})=>{
                    this.toggleSearchTableLoading(false)
                    if(data.code===200){
                        message.success('删除成功！');
                        this.refreshTable();
                    }else{
                        message.error(`删除失败:${data.msg}`)
                    }
                }).catch(err=>{
                    this.toggleSearchTableLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
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
    render(){
        const {tableKey,selectedRowKeys,searchTableLoading,doNotFetchDidMount,dataStatus,submitDate} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={doNotFetchDidMount}
                spinning={searchTableLoading}
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
                    columns:columns,
                    onRowSelect:parseInt(dataStatus,0) === 1 ? (selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    } : undefined,
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0
                        },()=>{
                            this.state.hasData && this.fetchResultStatus()
                        })
                    },
                    url:'/account/output/notInvoiceAdvance/list',
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
                        <FileImportModal
                            url={`/account/output/notInvoiceAdvance/upload`}
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
                                                span:14
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
                                    }
                                ]
                            }
                            onSuccess={this.refreshTable} style={{marginRight:5}} />
                        <FileExport
                            url={`/account/output/notInvoiceAdvance/download`}
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" type='danger' style={{marginRight:5}} onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
                        <SubmitOrRecall type={1} url="/account/output/notInvoiceAdvance/submit" monthFieldName='authMonth' onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/account/output/notInvoiceAdvance/revoke" monthFieldName='authMonth' onSuccess={this.refreshTable} />
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div>
                                    <label>本页合计：</label>
                                    预结转收入金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                </div>
                            </div>
                        )
                    }
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(AdvanceCarryOver)