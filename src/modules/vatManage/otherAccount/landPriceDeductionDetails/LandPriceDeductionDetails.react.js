/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {fMoney,request} from '../../../../utils'
import {SearchTable,FileExport} from '../../../../compoments'
import {Button,Icon,message} from 'antd'
import PageTwo from './TabPage2.r'

const searchFields = (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },
        }, {
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
        }, {
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
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            componentProps:{
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            },
        }
    ]
}
const columns= [
    {
        title: '纳税主体',
        dataIndex: 'taxMethod',
    }, {
        title: '项目名称',
        dataIndex: 'name',
    },{
        title: '土地出让合同',
        dataIndex: 'invoiceTypeSNumber',
    },{
        title: '项目分期',
        dataIndex: 'invoiceTypeSSale',
    },{
        title: '是否清算 ',
        dataIndex: 'invoiceTypeSTaxAmount',
    },{
        title: '可售面积(㎡)',
        dataIndex: 'invoiceTypeCNumber',
    },{
        title: '计税方法',
        dataIndex: 'invoiceTypeCSale',
    },{
        title: '分摊抵扣的土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '单方土地成本',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '上期累计销售的建筑面积(㎡)',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '上期累计已扣除土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积（㎡）',
        dataIndex: 'invoiceTypeCTaxAmount',
    },{
        title: '当期应扣除土地价款',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '收入确认金额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'invoiceTypeCTaxAmount',
        render:text=>fMoney(text),
    }
];
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class LandPriceDeductionDetails extends Component{
    state={
        updateKey:Date.now(),
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        selectedRowKeys:[],
        selectedRows:[],
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

    render(){
        const {tableKey,updateKey,searchTableLoading,selectedRowKeys,selectedRows,searchFieldsValues,dataSource} = this.state;
        return(
            <div>
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    backCondition={(values)=>{
                        this.setState({
                            searchFieldsValues:values
                        })
                    }}
                    tableOption={{
                        key:tableKey,
                        pageSize:10,
                        columns:columns,
                        cardProps:{
                          title:'项目分期信息'
                        },
                        rowSelection:{
                            type:'radio',
                        },
                        onRowSelect:(selectedRowKeys)=>{
                            this.setState({
                                selectedRowKeys
                            })
                        },
                        url:'/carryover/incomeDetails/list',
                        extra: <div>
                            {
                                dataSource.length > 0 && <span>
                                            <div style={{marginRight:30,display:'inline-block'}}>
                                                <span style={{marginRight:20}}>状态：<label style={{color:parseInt(dataSource[0].status, 0) === 1 ? 'red' : 'green'}}>{parseInt(dataSource[0].status, 0) === 1 ? '保存' : '提交'}</label></span>
                                                <span>提交时间：{dataSource[0].lastModifiedDate}</span>
                                            </div>
                                    {
                                        parseInt(dataSource[0].status, 0) === 1 ? <span>
                                                <FileExport
                                                    url={`/account/other/reduceTaxDetail/export?${parseJsonToParams(searchFieldsValues)}`}
                                                    title="导出"
                                                    size="small"
                                                    setButtonStyle={{marginRight:5}}
                                                />
                                                <Button size='small' style={{marginRight:5}}>
                                                    <Icon type="retweet" />
                                                    重算
                                                </Button>
                                                {/*<Button size='small' style={{marginRight:5}}>
                                                    <Icon type="check" />
                                                    清算
                                                </Button>*/}
                                                <Button size='small' style={{marginRight:5}} onClick={()=>this.handleClick('提交')}>
                                                    <Icon type="check" />
                                                    提交
                                                </Button>
                                                <Button size="small" type='danger' onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
                                            </span>
                                            :
                                            <span>
                                                <Button size='small' style={{marginRight:5}} onClick={()=>this.handleClick('撤回')}>
                                                    <Icon type="rollback" />
                                                    撤回提交
                                                </Button>
                                            </span>
                                    }
                                    </span>
                            }
                        </div>,
                        renderFooter:data=>{
                            return(
                                <div>
                                    <div style={{marginBottom:10}}>
                                        <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                        金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                        税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                        减免税金额：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
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

                <PageTwo id={selectedRowKeys} selectedRows={selectedRows} filters={searchFieldsValues} updateKey={updateKey}/>
            </div>
        )
    }
}