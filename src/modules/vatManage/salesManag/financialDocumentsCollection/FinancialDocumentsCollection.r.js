/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,listMainResultStatus,requestResultStatus,composeBotton} from 'utils'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

const searchFields = (disabled,declare) => {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:8,
            formItemStyle,
            componentProps:{
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
        }
    ]
}
const columns=[
    {
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
    },
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },
    {
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'100px',
    },
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: '记账日期',
        dataIndex: 'billingDate',
        width:'100px',
    },
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
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
        width:'100px',
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
        width:'200px',
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
    }
];
class FinancialDocumentsCollection extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/inter/financial/voucher/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {updateKey,filters,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare)
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/inter/financial/voucher/manageList',
                    scroll:{ x: 3200 ,y:window.screen.availHeight-420},
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: "财务凭证采集",
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    (disabled && declare.decAction==='edit') &&  composeBotton([{
                                        type:'submit',
                                        url:'/inter/financial/voucher/submit',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1231010'],
                                    },
                                    {
                                        type:'revoke',
                                        url:'/inter/financial/voucher/revoke',
                                        params:filters,
                                        onSuccess:this.refreshTable,
                                        userPermissions:['1231011'],
                                    }],statusParam)
                                }
                                <TableTotal type={3} totalSource={totalSource} data={
                                    [
                                        {
                                            title:'合计',
                                            total:[
                                                {title: '贷方金额', dataIndex: 'creditAmount'},
                                            ],
                                        }
                                    ]
                                } />
                            </div>
                        )
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            />
            </div>
        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(FinancialDocumentsCollection)