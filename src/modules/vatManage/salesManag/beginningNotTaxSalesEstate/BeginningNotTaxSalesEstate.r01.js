/**
 * Created by liuliyuan on 2018/8/7.
 * 期初未纳税销售额台账-地产
 */
import React, { Component } from 'react'
// import {Button,Icon} from 'antd'
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
            label:'纳税申报期',
            fieldName:'month',
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
            fieldName:'projectName',
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
            label:'项目名称',
            fieldName:'stagesName',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url: `/project/list/${getFieldValue('main') && getFieldValue('main').key}`
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
            label:'确收时点',
            fieldName:'confirmedDate ',
            type:'datePicker',
            span:8,
            formItemStyle,
            componentProps:{
                // format:'YYYY-MM',
                disabled:disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            },
        },
        {
            label: '房间号',
            fieldName: 'roomCode',
            formItemStyle,
            span:8,
            type: 'input',
        },
        {
            label:'状态',
            fieldName:'status',
            type:'select',
            formItemStyle,
            span:8,
            options:[
                {
                    text:'未缴税',
                    value:'0'
                },
                {
                    text:'已缴税',
                    value:'1'
                }
            ]
        }
    ]
}
const columns = [
    // {
    //     title: '操作',
    //     key: 'actions',
    //     fixed: 'left',
    //     width: '70px',
    //     className: 'text-center'
    // },
    {
        title:'利润中心',
        dataIndex:'projectName',
        width:'150px',
    },
    {
        title:'项目分期',
        dataIndex:'stagesId',
        width:'150px',
    },
    {
        title:'房间路址',
        dataIndex:'htRoomName',
        width:'100px',
    },
    {
        title:'房间号',
        dataIndex:'roomCode',
        width:'100px',
    },{
        title:'确收时点',
        dataIndex:'confirmedDate',
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
        title:'应申报销售额',
        dataIndex:'reportSalesAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    // {
    //     title:'结算价',
    //     render:text=>fMoney(text),
    //     className:'table-money',
    //     width:'100px',
    // },
    {
        title:'期初增值税已纳税销售额',
        dataIndex:'initialTaxableSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'期初已纳税金',
        dataIndex:'initialTaxableTaxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'期初已开票金额',
        dataIndex:'initialTaxableTotalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'本期开票金额',
        dataIndex:'currentTaxableTotalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'未纳税销售额',
        dataIndex:'noTaxableSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'本期申报的未纳税销售额',
        dataIndex:'currentNoTaxableSales',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'本期申报的未纳税销项税额',
        dataIndex:'currentNoTaxableTaxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'150px',
    },
    {
        title:'状态',
        dataIndex:'status',
        width:'100px',
    }
];
const markFieldsData = [
    {
        label:'作为本期缴税房间凭证',
        fieldName:'deductionFlag',
        type:'select',
        notShowAll:true,
        formItemStyle:{
            labelCol:{
                span:10
            },
            wrapperCol:{
                span:14
            }
        },
        span:22,
        options:[  //1-标记;0-不标记；不传则所有状态
            {
                text:'是',
                value:'1'
            },{
                text:'否',
                value:'0'
            }
        ],
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择标记类型'
                }
            ]
        }
    }
]
class unBilledSalesEstate extends Component{
    state={
        tableKey:Date.now(),
        visible:false,
        searchTableLoading:false,
        filters:{

        },
        resultFieldsValues:{

        },
        selectedRowKeys:[],
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
        requestResultStatus('/accountInitialUntaxedSales/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    getCheckboxProps= record => ({
        disabled: record.doCheck === 1,
    })
    render(){
        const {tableKey,filters={},statusParam={},searchTableLoading,selectedRowKeys} = this.state;
        const { declare } = this.props;
        const rowSelection ={
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps:this.getCheckboxProps
        };
        let disabled = !!declare;
      /*  const dataOne=[
            {
                id:'1',
                projectName:111,
                itemName:222,
                roomAddress:"福田",
                roomCode:502,
                htRoomName:"2018/08",
                taxRate:18,
                declaredSales:300,
                sumTotalPrice:400,
                sumTotalAmount:500,
                sumNoInvoiceSales:600,
                totalPrice:700,
                totalAmount:410,
                noInvoiceSales:520,
                endTotalPrice:620,
                endTotalAmount:0,
            },{
                id:'2',
                projectName:111,
                itemName:222,
                roomAddress:"福田",
                roomCode:502,
                htRoomName:"2018/08",
                taxRate:18,
                declaredSales:300,
                sumTotalPrice:400,
                sumTotalAmount:500,
                sumNoInvoiceSales:600,
                totalPrice:700,
                totalAmount:410,
                noInvoiceSales:520,
                endTotalPrice:620,
                endTotalAmount:1,
            }
        ];*/
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
                    // dataSource:dataOne,
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    rowSelection,
                    url:'/accountInitialUntaxedSales/list',
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
                             // JSON.stringify(filters)!=='{}' &&
                             composeBotton([
                                {
                                    type:'mark',
                                    buttonOptions:{
                                        text:'本期缴税房间',
                                        icon:'pushpin-o'
                                    },
                                    formOptions: {
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url: "/accountInitialUntaxedSales/check",
                                        fields: markFieldsData,
                                        onSuccess: this.refreshTable,
                                        userPermissions: ['1545000'],
                                    }
                                },
                            ],statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') && composeBotton([
                                {

                                },
                                {
                                    type:'reset',
                                    url:'/accountInitialUntaxedSales/reset',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                },
                                {
                                    type:'submit',
                                    url:'/accountInitialUntaxedSales/submit',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1351010'],
                                },
                                {
                                    type:'revoke',
                                    url:'/accountInitialUntaxedSales/revoke',
                                    params:filters,
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1351011'],
                                }
                            ],statusParam)
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
