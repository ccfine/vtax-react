/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: xiaminghua
 * @Last Modified time: 2018-04-28
 *
 */
import React, { Component } from 'react'
import {Button,Icon,Modal,message} from 'antd'
import {fMoney,request,getUrlParam,listMainResultStatus} from 'utils'
import {SearchTable,FileExport,FileImportModal} from 'compoments'
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
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
        span:8,
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
        span:8,
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
    },{
        label:'凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:8,
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
        title: '税额',
        dataIndex: 'taxAmount',
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
        filters:{

        },
        statusParam:{},
        selectedRowKeys:[],
        dataSource:[],
        searchTableLoading:false,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        },()=>{
            this.updateStatus()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    deleteRecord = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
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

    updateStatus=()=>{
        request.get('/account/other/reduceTaxDetail/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                filters:{
                    mainId:getUrlParam('mainId') || undefined,
                    authMonth:moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    render(){
        const {tableKey,searchTableLoading,selectedRowKeys,filters,statusParam,dataSource} = this.state;
        const {mainId,authMonth} = filters;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const {search} = this.props.location;
        let disabled= !!search;
        return(
            <SearchTable
                spinning={searchTableLoading}
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    },
                    onFieldsChange:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                filters:{
                                    mainId:undefined,
                                    authMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.authMonth){
                            if(values.authMonth){
                                values.authMonth = values.authMonth.format('YYYY-MM')
                            }
                            this.setState(prevState=>({
                                filters:{
                                    ...prevState.filters,
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
                    onRowSelect:parseInt(statusParam.status, 0)  === 1 ? (selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    } : undefined,
                    url:'/account/other/reduceTaxDetail/list',
                    extra: <div>
                        {
                            dataSource.length>0 && listMainResultStatus(statusParam)
                        }
                        <FileImportModal
                            url="/account/other/reduceTaxDetail/upload"
                            fields={fieldList}
                            disabled={disabled1}
                            onSuccess={this.refreshTable}
                            style={{marginRight:5}}
                        />
                        <FileExport
                            url='account/other/reduceTaxDetail/detail/download'
                            title="下载导入模板"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button
                            size="small"
                            type='danger'
                            style={{marginRight:5}}
                            onClick={this.deleteRecord}
                            disabled={selectedRowKeys.length === 0}>
                            <Icon type="delete" />删除
                        </Button>
                        <FileExport
                            url='account/other/reduceTaxDetail/export'
                            title='导出'
                            setButtonStyle={{marginRight:5}}
                            disabled={!dataSource.length>0 || disabled1}
                            params={{
                                ...filters
                            }}
                        />
                        <SubmitOrRecallMutex
                            buttonSize="small"
                            paramsType="object"
                            url="/account/other/reduceTaxDetail"
                            restoreStr="revoke"//撤销接口命名不一致添加属性
                            refreshTable={this.refreshTable}
                            toggleSearchTableLoading={this.toggleSearchTableLoading}
                            hasParam={mainId && authMonth}
                            dataStatus={statusParam.status}
                            searchFieldsValues={this.state.filters}
                          />
                    </div>,
                    renderFooter:data=>{
                        return(
                            <div className="footer-total">
                                <div className="footer-total-meta">
                                    <div className="footer-total-meta-title">
                                        <label>合计：</label>
                                    </div>
                                    <div className="footer-total-meta-detail">
                                        金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                        税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                        减免税金额：<span className="amount-code">{fMoney(data.pageReduceTaxAmount)}</span>
                                    </div>
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