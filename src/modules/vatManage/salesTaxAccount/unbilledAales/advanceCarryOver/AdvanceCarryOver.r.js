/**
 * Created by liurunbin on 2018/1/16.
 * 预结转收入
 */
import React, { Component } from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../../compoments'
import {fMoney,request,getUrlParam} from '../../../../../utils'
import { withRouter } from 'react-router'

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
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
            },
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
            label:'楼栋',
            fieldName:'buildingName',
            type:'input',
            span:6
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
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
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
class AdvanceCarryOver extends Component{
    state={
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedRowKeys:[],

        searchTableLoading:false,
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
            this.refreshTable()
        }else{
            this.refreshTable()
        }
    }
    render(){
        const {tableKey,selectedRowKeys,searchTableLoading,searchFieldsValues} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
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
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    url:'/account/output/notInvoiceAdvance/list',
                    extra:<div>
                        <FileImportModal url="/account/output/notInvoiceAdvance/upload" onSuccess={this.refreshTable} style={{marginRight:5}} />
                        <FileExport
                            url={`account/output/notInvoiceSale/download?${parseJsonToParams(searchFieldsValues)}`}
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" type='danger' onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                    预结转收入金额：<span className="amount-code">{data.pageAmount}</span>
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