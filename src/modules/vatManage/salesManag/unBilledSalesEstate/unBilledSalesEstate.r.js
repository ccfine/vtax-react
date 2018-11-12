/**
 * Created by liurunbin on 2018/1/11.
 * 确认结转收入
 */
import React, { Component } from 'react'
import {Button,Icon} from 'antd'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import ManualMatchRoomModal from './SummarySheetModal'
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
        }
    ]
}
const columns = [
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title:'房间交易档案',
        children:[ {
                /*title:'项目',
                dataIndex:'projectName',
                width:'150px',
            },
            {*/
                title:'项目分期',
                dataIndex:'itemName',
                width:'150px',
            },
            {
                title:'房间编码',
                dataIndex:'roomCode',
                width:'100px',
            },{
                title:'路址',
                dataIndex:'htRoomName',
                width:'150px',
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
            /*{
                title:'房间交付日期',
                dataIndex:'deliveryDate',
                width:'100px',
            },*/
        ]
    },
    {
        title:'上期末合计金额',
        children:[
            {
                title:'增值税收入确认金额',
                dataIndex:'sumTotalPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
            {
                title:'增值税开票金额',
                dataIndex:'sumTotalAmount',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
            {
                title:'未开具发票销售金额',
                dataIndex:'sumNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
        ]
    },
    {
        title:'本期发生额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'totalPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
            {
                title:'增值税开票金额',
                dataIndex:'totalAmount',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
            {
                title:'未开具发票销售额',
                dataIndex:'noInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
        ]
    },
    {
        title:'本期末合计金额',
        children:[
            {
                title:'增值税收入确认金额合计',
                dataIndex:'endTotalPrice',
                render:text=>fMoney(text),
                className:'table-money',
                width:'150px',
            },
            {
                title:'增值税开票金额',
                dataIndex:'endTotalAmount',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
            {
                title:'未开具发票销售额',
                dataIndex:'endNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money',
                width:'100px',
            },
        ]
    },
    {
        title:'应申报未开具发票销售额',
        dataIndex:'totalNoInvoiceSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'未开具发票销售税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    }
];
class unBilledSalesEstate extends Component{
    state={
        tableKey:Date.now(),
        visible:false,
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
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/output/notInvoiceSale/realty/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableKey,visible,filters={},statusParam={},searchTableLoading,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
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
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    cardProps:{
                        title:'未开票销售台账-地产'
                    },
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/realty/list',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" && <Button size="small" style={{marginRight:5}} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />查看汇总</Button>
                        }
                        {
                            JSON.stringify(filters)!=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'account/output/notInvoiceSale/realty/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1351007'],
                            }])
                        }
                        {
                            (disabled && declare.decAction==='edit') && composeBotton([
                            {
                                type:'reset',
                                url:'/account/output/notInvoiceSale/realty/reset',
                                params:filters,
                                onSuccess:this.refreshTable,
                                userPermissions:['1351009'],
                            },{
                                type:'submit',
                                url:'/account/output/notInvoiceSale/realty/submit',
                                params:filters,
                                onSuccess:this.refreshTable,
                                userPermissions:['1351010'],
                            },{
                                type:'revoke',
                                url:'/account/output/notInvoiceSale/realty/revoke',
                                params:filters,
                                onSuccess:this.refreshTable,
                                userPermissions:['1351011'],
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '应申报未开具发票销售额', dataIndex: 'allTotalNoInvoiceSales'},

                                        {title: '上期末增值税收入确认金额', dataIndex: 'allSumTotalPrice'},
                                        {title: '上期末增值税开票金额', dataIndex: 'allSumTotalAmount'},
                                        {title: '上期末未开具发票销售额', dataIndex: 'allSumNoInvoiceSales'},

                                        {title: '本期增值税收入确认金额', dataIndex: 'allTotalPrice'},
                                        {title: '本期增值税开票金额', dataIndex: 'allTotalAmount'},
                                        {title: '本期未开具发票销售额', dataIndex: 'allNoInvoiceSales'},

                                        {title: '本期末增值税收入确认金额', dataIndex: 'allEndTotalPrice'},
                                        {title: '本期末增值税开票金额', dataIndex: 'allEndTotalAmount'},
                                        {title: '本期末未开具发票销售额', dataIndex: 'allEndNoInvoiceSales'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                    scroll:{
                        x:2150,
                        y:window.screen.availHeight-430-(disabled?50:0),
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                }}
            >
                <ManualMatchRoomModal title="汇总信息" params={filters} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default unBilledSalesEstate
