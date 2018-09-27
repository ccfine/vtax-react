/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {message} from 'antd'
import {connect} from 'react-redux'
import createSocket from '../socket'
import {fMoney,composeBotton,request} from 'utils'
import TableTitle from 'compoments/tableTitleWithTime'
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
/*
const fields = [
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
    }, {
        label: '记账月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择记账月份'
                }
            ]
        },
    }
]*/
const apiFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label:'抽取月份',
        fieldName:'authMonth',
        type:'monthPicker',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择抽取月份',
            }]
        },
    },
]
const searchFields = (getFieldValue) =>[
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            fieldDecoratorOptions:{
                rules:[{
                    required:true,
                    message:'请选择纳税主体',
                }]
            },
        },
        {
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
            }
        },
        {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/taxsubject/profitCenterList/${getFieldValue('mainId')}`,
            }
        },
        {
            label:'借方科目名称',
            fieldName:'debitSubjectName',
            span:8,
            formItemStyle,
        },
        {
            label:'借方科目代码',
            fieldName:'debitSubjectCode',
            span:8,
            formItemStyle,
        },
        {
            label:'贷方科目名称',
            fieldName:'creditSubjectName',
            span:8,
            formItemStyle,
        },
        {
            label:'贷方科目代码',
            fieldName:'creditSubjectCode',
            span:8,
            formItemStyle,
        },
        {
            label:'凭证号',
            fieldName:'voucherNum',
            span:8,
            formItemStyle,
        }
    ]
const getColumns = context =>[
    /*{
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            // userPermissions:['1891008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    },*/
    /*{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'200px',
    },
    {
        title: '纳税主体编码',
        dataIndex: 'mainNum',
        width:'100px',
    },
    {
        title: '项目名称',
        dataIndex: 'projectName',
        width:'200px',
    },*/
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width: '200px',
    },
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },
    /*{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'100px',
    },*/
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: '过账日期',
        dataIndex: 'billingDate',
        width:'100px',
    },
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
        width:'100px',
        sorter: true,
    },
    {
        title: 'SAP凭证号',
        dataIndex: 'voucherNumSap',
        width:'100px',
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:'500px',
    },
    /*{
        title: '凭证类型',
        dataIndex: 'voucherType',
    },*/
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'200px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '借方辅助核算名称',
        dataIndex: 'debitProjectName',
        width:'150px',
    },
    {
        title: '借方辅助核算代码',
        dataIndex: 'debitProjectNum',
        width:'150px',
    },
    {
        title: '贷方科目名称',
        dataIndex: 'creditSubjectName',
        width:'300px',
    },
    {
        title: '贷方科目代码',
        dataIndex: 'creditSubjectCode',
        width:'100px',
    },
    {
        title: '贷方金额',
        dataIndex: 'creditAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '贷方辅助核算名称',
        dataIndex: 'creditProjectName',
        width:'150px',
    },
    {
        title: '贷方辅助核算代码',
        dataIndex: 'creditProjectNum',
        width:'150px',
    },
    {
        title:'辅助核算明细',
        children:[
            {
                title:'房间编码',
                dataIndex:'roomCode',
                width:'150px',
            },
            {
                title:'能源转售类型',
                dataIndex:'energyType',
                width:'150px',
            },
            {
                title:'付款成本项目',
                dataIndex:'paymentItem',
                width:'150px',
            }
        ]
    },
];
class FinancialDocuments extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        totalSource: undefined
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        })
    }
    deleteRecord(record){
        request.delete(`/inter/financial/voucher/report/delete/${record.id}`).then(({data}) => {
            if (data.code === 200) {
                message.success('删除成功', 4);
                this.refreshTable();
            } else {
                message.error(data.msg, 4);
            }
        }).catch(err => {
                message.error(err.message);
            })
    }
    render(){
        const {updateKey,filters,totalSource} = this.state;
        return(
            <div className='oneLine'> 
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/inter/financial/voucher/report/list',
                    scroll:{ x: 3300,y:window.screen.availHeight-450 },
                    onSuccess: (params) => {
                        this.setState({
                            filters: params,
                        });
                    },
                    onTotalSource: totalSource => {
                        this.setState({
                            totalSource
                        });
                    },
                    cardProps: {
                        title: <TableTitle time={totalSource && totalSource.extractTime}>财务凭证</TableTitle>,
                        extra: (
                            <div>
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'inter/financial/voucher/report/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1891007'],
                                    }/*,{
                                        type:'fileImport',
                                        url:'/inter/financial/voucher/report/upload',
                                        onSuccess:this.refreshTable,
                                        fields:fields,
                                        // userPermissions:['1891005'],
                                    }*/])
                                }
                                {/*
                                    composeBotton([{
                                        type: 'fileExport',
                                        url: 'inter/financial/voucher/report/download',
                                        // onSuccess: this.refreshTable,
                                    }])
                                */}
                                {
                                    composeBotton([{
                                        type:'modal',
                                        url:'/inter/financial/voucher/report/sendApi',
                                        title:'抽数',
                                        icon:'usb',
                                        fields:apiFields,
                                        userPermissions:['1895001'],
                                        onSuccess:()=>{
                                            createSocket(this.props.userid)
                                        }
                                    }])
                                }
                                <TableTotal totalSource={totalSource} type={3} data={[
                                    {
                                        title:'总计',
                                        total:[
                                            {title: '借方金额', dataIndex: 'debitAmount'},
                                            {title: '贷方金额', dataIndex: 'creditAmount'},
                                        ],
                                    }
                                ]}/>
                            </div>
                        )
                    },
                }}
            />
            </div>
        )
    }
}

export default connect(state=>({
    userid:state.user.getIn(['personal','id'])
}))(FinancialDocuments);