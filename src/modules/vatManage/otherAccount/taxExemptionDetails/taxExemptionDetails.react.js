/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {Button,Icon,Modal,message} from 'antd'
import {fMoney,request,getUrlParam} from '../../../../utils'
import {SearchTable,FileExport,FileImportModal} from '../../../../compoments'
import { withRouter } from 'react-router'
import moment from 'moment';

const fieldList = [
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
                span:15
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
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
const searchFields =(disabled)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:6,
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
    },{
        label:'查询期间',
        fieldName:'authMonth',
        type:'monthPicker',
        span:6,
        componentProps:{
            format:'YYYY-MM',
            disabled
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM')) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选查询期间'
                }
            ]
        },
    },{
        label:'凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:6,
        componentProps:{

        }
    },
]
const getColumns = context=> [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '减税性质代码',
        dataIndex: 'reduceNum',
    },{
        title: '减税性质名称',
        dataIndex: 'reduceName',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
    },{
        title: '日期 ',
        dataIndex: 'monthDate',
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
    },{
        title: '减免税金额',
        dataIndex: 'reduceTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '进项税额是否认证抵扣',
        dataIndex: 'incomeTaxAuth',
        render:text=>{
            //0 否，1 是 ,
            text = parseInt(text,0);
            if(text===0){
                return '否'
            }
            if(text ===1){
                return '是'
            }
            return text;
        }
    }
];
class TaxExemptionDetails extends Component{
    state={
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        statusParam:{},
        selectedRowKeys:[],
        dataSource:[],
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
                request.delete(`/account/other/reduceTaxDetail/delete/${this.state.selectedRowKeys.toString()}`)
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

    handleClick=type=>{
        let url = '';
        switch (type){
            case '提交':
                url='/account/other/reduceTaxDetail/submit';
                break;
            case '撤回':
                url='/account/other/reduceTaxDetail/revoke';
                break;
            default:
        }
        this.toggleSearchTableLoading(true)
        request.post(url,this.state.searchFieldsValues)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            }).catch(err=>{
                this.toggleSearchTableLoading(false)
            })
    }
    updateStatus=(values)=>{
        request.get('/account/other/reduceTaxDetail/main',{params:values}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {tableKey,searchTableLoading,selectedRowKeys,searchFieldsValues,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = this.state.searchFieldsValues;
        const disabled = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1) && (dataSource.length > 0));
        const rollbackDisabled = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2) && (dataSource.length > 0));
        const {search} = this.props.location;
        let searchDisabled= !!search;
        return(
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(searchDisabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    },
                    onFieldsChange:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                searchFieldsValues:{
                                    mainId:undefined,
                                    authMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.authMonth){
                            if(values.authMonth){
                                values.authMonth = values.authMonth.format('YYYY-MM')
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
                backCondition={this.updateStatus}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this),
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    url:'/account/other/reduceTaxDetail/list',
                    extra: <div>
                        {
                            JSON.stringify(statusParam) !== "{}" &&
                            <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                                <span>提交时间：{statusParam.lastModifiedDate}</span>
                            </div>
                        }
                        <FileImportModal
                            url="/account/other/reduceTaxDetail/upload"
                            fields={fieldList}
                            disabled={disabled}
                            onSuccess={this.refreshTable}
                            style={{marginRight:5}}
                        />
                        <FileExport
                            url='/account/other/reduceTaxDetail/detail/download'
                            title="下载导入模板"
                            disabled={disabled}
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button
                            size="small"
                            type='danger'
                            style={{marginRight:5}}
                            onClick={this.deleteData}
                            disabled={selectedRowKeys.length === 0}>
                            <Icon type="delete" />删除
                        </Button>
                        <FileExport
                            url='/account/other/reduceTaxDetail/export'
                            title='导出'
                            setButtonStyle={{marginRight:5}}
                            disabled={disabled}
                            params={{
                                ...searchFieldsValues
                            }}
                        />
                        <Button
                            size='small'
                            style={{marginRight:5}}
                            disabled={disabled}
                            onClick={()=>this.handleClick('提交')}>
                            <Icon type="check" />
                            提交
                        </Button>
                        <Button
                            size='small'
                            style={{marginRight:5}}
                            disabled={rollbackDisabled}
                            onClick={()=>this.handleClick('撤回')}>
                            <Icon type="rollback" />
                            撤回提交
                        </Button>
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div>
                                <div style={{marginBottom:10}}>
                                    <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                    金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                    税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                    减免税金额：<span className="amount-code">{fMoney(data.pageReduceTaxAmount)}</span>
                                </div>
                            </div>
                        )
                    },
                    onDataChange:(dataSource)=>{
                        this.setState({
                            dataSource
                        })
                    }
                }}
            >
            </SearchTable>
        )
    }
}

export default withRouter(TaxExemptionDetails)