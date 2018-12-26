/**
 * Created by zhouzhe on 2018/12/24.
 * 退房处理台账
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus} from 'utils'
import moment from 'moment';
const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields =(disabled,declare)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:8,
            formItemStyle,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
            span:8,
            formItemStyle,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
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
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
            }
        },
        {
            label:'房间编码',
            fieldName:'roomCode',
            type:'input',
            span:8,
            formItemStyle
        },
    ]
}
const columns = [
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title:'项目分期',
        dataIndex:'stagesName',
        width:'200px',
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'100px',
    },
    {
        title:'房间路址',
        dataIndex:'htRoomName',
        width:'250px',
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:'100px',
    },
    {
        title:'确收时点',
        dataIndex:'confirmedDate',
        width:'100px',
    },
    {
        title:'待红冲合计',
        children:[
            {
                title:'待红冲增值税收入确认金额',
                dataIndex:'confirmedPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'待红冲增值税开票金额',
                dataIndex:'invoiced',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'待红冲未开具发票销售金额',
                dataIndex:'totalPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
        ]
    },
    {
        title:'本期红冲合计',
        children:[
            {
                title:'本期红冲增值税收入确认金额',
                dataIndex:'returnedConfirmedPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'本期红冲增值税开票金额',
                dataIndex:'returnedInvoiced',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'本期红冲未开具发票销售金额',
                dataIndex:'returnedTotalPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'本期红冲未开具发票销项税额',
                dataIndex:'returnedTaxPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
        ]
    },
];
class CheckOut extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{

        },

        statusParam:undefined,

        totalSource:undefined,
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableKey,filters={},statusParam={},searchTableLoading,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            handle = declare && declare.decAction==='edit';
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                spinning={searchTableLoading}
                backCondition={(params)=>{
                    this.setState({
                        filters:params,
                    },()=>{
                        handle && this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    cardProps:{
                        title:'退房处理台账'
                    },
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:`/accountOutputRoomReturned/list${handle ? '?handle=true' : ''}`,
                    extra:<div>
                        {
                            JSON.stringify(filters)!=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'/accountOutputRoomReturned/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['2201007'],
                            }])
                        }
                        {
                            (disabled && handle) && composeBotton([
                            {
                                type:'reset',
                                url:'/accountOutputRoomReturned/reset',
                                params:filters,
                                onSuccess:this.refreshTable,
                                userPermissions:['2201009'],
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '本期红冲增值税收入确认金额', dataIndex: 'returnedConfirmedPrice'},

                                        {title: '本期红冲增值税开票金额', dataIndex: 'returnedInvoiced'},
                                        {title: '本期红冲未开具发票销售金额', dataIndex: 'returnedTotalPrice'},
                                        {title: '本期红冲未开具发票销项税额', dataIndex: 'returnedTaxPrice'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                    scroll:{
                        x:2000,
                        // y:window.screen.availHeight-430-(disabled?50:0),
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            >
            </SearchTable>
        )
    }
}
export default CheckOut
