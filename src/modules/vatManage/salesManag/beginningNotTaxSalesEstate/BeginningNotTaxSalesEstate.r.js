/**
 * Created by liuliyuan on 2018/8/7.
 * 期初未纳税销售额台账-地产
 */
import React, { Component } from 'react'
import {Button,Icon} from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
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
            label:'房间交付日期',
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
            fieldName:'projectId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/project/list/${getFieldValue('main') && getFieldValue('main').key}`,
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
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label: '房间号',
            fieldName: 'commodityName',
            formItemStyle,
            span:8,
            type: 'input',
        },
        {
            label:'状态',
            fieldName:'matchingStatus',
            type:'select',
            formItemStyle,
            span:8,
            options:[
                {
                    text:'未匹配',
                    value:'0'
                },
                {
                    text:'已匹配',
                    value:'1'
                }
            ]
        }
    ]
}
const columns = [
    {
        title:'利润中心',
        dataIndex:'projectName',
        width:'150px',
    },
    {
        title:'项目分期',
        dataIndex:'itemName',
        width:'150px',
    },
    {
        title:'房间号',
        dataIndex:'roomCode',
        width:'100px',
    },{
        title:'房间交付日期',
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
        title:'结算价',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'期初增值税已纳税销售额',
        dataIndex:'sumTotalPrice',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'期初已纳税金',
        dataIndex:'sumTotalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'期初已开票金额',
        dataIndex:'sumNoInvoiceSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'本期开票金额',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'期初未纳税销售额',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'本期申报的未纳税销售额',
        dataIndex:'noInvoiceSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'本期申报的未纳税销项税额',
        dataIndex:'endTotalPrice',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'状态',
        dataIndex:'endTotalAmount',
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
        resultFieldsValues:{

        },

        statusParam:undefined,
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
        const {tableKey,filters={},statusParam={},searchTableLoading} = this.state;
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
                tableOption={{
                    cardProps:{
                        title:'期初未纳税销售额台账-地产'
                    },
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/realty/list',
                    onSuccess:(params)=>{
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
                    </div>,
                    scroll:{
                        x:1950,
                        y:window.screen.availHeight-430-(disabled?50:0),
                    },
                }}
            />
        )
    }
}
export default unBilledSalesEstate
