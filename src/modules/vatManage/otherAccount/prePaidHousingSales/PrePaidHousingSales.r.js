/**
 * Created by liurunbin on 2018/1/17.
 * 售房预缴台账
 */
import React,{Component} from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../compoments'
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
        {
            label:'项目分期',
            fieldName:'stagesId',
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
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'过滤期间',
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
            label:'楼栋名称',
            type:'input',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldName:'buildingName'
        },
        {
            label:'房号',
            type:'input',
            fieldName:'roomNumber',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
        },
        {
            label:'收款时房屋状态',
            fieldName:'housingStatus',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房',
                    value:'2'
                },
                {
                    text:'期房',
                    value:'1'
                }
            ]
        },
        {
            label:'现房缴费',
            fieldName:'roomState',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房需要预缴',
                    value:'1'
                },
                {
                    text:'现房且结转收入不预缴',
                    value:'2'
                },
                {
                    text:'现房不预缴',
                    value:'3'
                }
            ]
        }
    ]
}
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName',
        width:'150px'
    },
    {
        title:'项目',
        dataIndex:'projectName',
        width:'120px'
    },
    {
        title:'分期',
        dataIndex:'stagesName',
        width:'100px'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'100px'
    },
    {
        title:'单元',
        dataIndex:'element',
        width:'60px'
    },
    {
        title:'房号',
        dataIndex:'roomNumber',
        width:'60px'
    },
    {
        title:'交付时间',
        dataIndex:'deliveryTime',
        width:'75px',
        className:'text-center',
    },
    {
        title:'收款日期',
        dataIndex:'receiveMonth',
        width:'70px',
        className:'text-center',
    },
    {
        title:'收款时房屋状态',
        dataIndex:'housingStatus',
        width:'100px',
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
        title:'累计预售价款',
        dataIndex:'cumulativePrepaidPayment',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'当期结转收入金额',
        dataIndex:'currentIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'累计结转收入金额',
        dataIndex:'cumulativeIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'预缴销售额',
        dataIndex:'prepaidSales',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'110px',
    }
];

export default class PrePaidHousingSales extends Component{
    state={
        selectedRowKeys:[],
        tableKey:Date.now(),
        searchTableLoading:false,
        searchFieldsValues:{}
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
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
                request.delete(`/account/salehouse/delete/${this.state.selectedRowKeys.toString()}`)
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
    handleClickActions = action => () =>{
        let actionText,
            actionUrl;
        switch (action){
            case 'submit':
                actionText='提交';
                actionUrl='/account/salehouse/submit';
                break;
            case 'restore':
                actionText='撤回';
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
        const {selectedRowKeys,searchTableLoading,tableKey,} = this.state;
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
                    onRowSelect:(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    },
                    extra:<div>
                        <FileImportModal
                            url="/account/salehouse/upload"
                            fields={[
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
                                            span:10
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
                                    label:'导入月份',
                                    fieldName:'receiveMonth',
                                    type:'monthPicker',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:6
                                        },
                                        wrapperCol:{
                                            span:10
                                        }
                                    },
                                    fieldDecoratorOptions:{
                                        rules:[
                                            {
                                                required:true,
                                                message:'请选择导入月份'
                                            }
                                        ]
                                    },
                                }
                            ]}
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
                            style={{marginRight:5}} />
                        <FileExport
                            url={`account/salehouse/download`}
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" style={{marginRight:5}} type='danger' onClick={this.deleteData} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
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
                        x:'1430px',
                        y:'400px'
                    },
                    rowSelection:{
                        getCheckboxProps:record=>({
                            /**
                             * 设置该数据是否可以选中
                             * 条件为数据状态是暂存的才可以被删除
                             * */
                            disabled:parseInt(record.status,0) === 2
                        })
                    }
                }}
            >
            </SearchTable>
        )
    }
}