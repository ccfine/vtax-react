/**
 * Created by liurunbin on 2018/1/11.
 * 确认结转收入
 */
import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,getUrlParam,request,listMainResultStatus,composeBotton} from 'utils'
import ManualMatchRoomModal from './SummarySheetModal'
import { withRouter } from 'react-router'
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
const searchFields =(disabled)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                disabled,
            },
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
                format:'YYYY-MM',
                disabled:disabled
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
        }
    ]
}
const columns = [
    {
        title:'房间交易档案',
        children:[
            {
                title:'分期',
                dataIndex:'itemName'
            },
            {
                title:'楼栋',
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
                render:text=>text? `${text}%`: text,
            },
        ]
    },
    {
        title:'上期末合计金额',
        children:[
            {
                title:'增值税收入确认金额',
                dataIndex:'sumTotalPrice',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'sumTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售金额',
                dataIndex:'sumNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
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
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'totalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'noInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
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
                className:'table-money'
            },
            {
                title:'增值税开票金额',
                dataIndex:'endTotalAmount',
                render:text=>fMoney(text),
                className:'table-money'
            },
            {
                title:'未开具发票销售额',
                dataIndex:'endNoInvoiceSales',
                render:text=>fMoney(text),
                className:'table-money'
            },
        ]
    },
    {
        title:'未开具发票销售额',
        dataIndex:'totalNoInvoiceSales',
        render:text=>fMoney(text),
        className:'table-money'
    }
];
class unBilledSalesEstate extends Component{
    state={
        tableKey:Date.now(),
        visible:false,
        doNotFetchDidMount:true,
        searchTableLoading:false,
        filters:{

        },
        resultFieldsValues:{

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
    fetchResultStatus = ()=>{
        request.get('/account/output/notInvoiceSale/realty/listMain',{
            params:this.state.filters
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam:data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {tableKey,visible,filters={},doNotFetchDidMount,statusParam={},searchTableLoading,totalSource} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={doNotFetchDidMount}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                spinning={searchTableLoading}
                tableOption={{
                    cardProps:{
                        title:'未开票销售台账-地产'
                    },
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/realty/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            filters:params,
                            resultFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !=='{}' && <Button size="small" style={{marginRight:5}} disabled={!filters.mainId} onClick={()=>this.toggleModalVisible(true)}><Icon type="search" />查看汇总</Button>
                        }
                        {
                            JSON.stringify(filters) !=='{}' && composeBotton([
                            {
                                type:'reset',
                                url:'/account/output/notInvoiceSale/realty/reset',
                                params:filters,
                                onSuccess:this.refreshTable,
                                userPermissions:[],
                            },{
                                type:'submit',
                                url:'/account/output/notInvoiceSale/realty/submit',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/output/notInvoiceSale/realty/revoke',
                                params:filters,
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'本页合计',
                                    total:[
                                        {title: '上期-增值税收入确认金额合计', dataIndex: 'pageSumTotalPrice'},
                                        {title: '上期-增值税开票金额', dataIndex: 'pageSumTotalAmount'},
                                        {title: '上期末合计金额-未开具发票销售额', dataIndex: 'pageSumNoInvoiceSales'},

                                        {title: '本期-增值税收入确认金额合计', dataIndex: 'pageTotalPrice'},
                                        {title: '本期-增值税开票金额', dataIndex: 'pageTotalAmount'},
                                        {title: '本期-未开具发票销售额', dataIndex: 'pageNoInvoiceSales'},

                                        {title: '本期末合计-增值税收入确认金额合计', dataIndex: 'pageEndTotalPrice'},
                                        {title: '本期末合计-增值税开票金额', dataIndex: 'pageEndTotalAmount'},
                                        {title: '本期末合计-未开具发票销售额', dataIndex: 'pageEndNoInvoiceSales'},
                                    ],
                                },{
                                title:'总计',
                                total:[
                                    {title: '上期-增值税收入确认金额合计', dataIndex: 'allSumTotalPrice'},
                                    {title: '上期-增值税开票金额', dataIndex: 'allSumTotalAmount'},
                                    {title: '上期末合计金额-未开具发票销售额', dataIndex: 'allSumNoInvoiceSales'},

                                    {title: '本期-增值税收入确认金额合计', dataIndex: 'allTotalPrice'},
                                    {title: '本期-增值税开票金额', dataIndex: 'allTotalAmount'},
                                    {title: '本期-未开具发票销售额', dataIndex: 'allNoInvoiceSales'},

                                    {title: '本期末合计-增值税收入确认金额合计', dataIndex: 'allEndTotalPrice'},
                                    {title: '本期末合计-增值税开票金额', dataIndex: 'allEndTotalAmount'},
                                    {title: '本期末合计-未开具发票销售额', dataIndex: 'allEndNoInvoiceSales'},
                                ],
                            }
                            ]
                        } />
                    </div>,
                    scroll:{
                        x:'200%'
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
export default withRouter(unBilledSalesEstate)
