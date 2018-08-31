// Created by liuliyuan on 2018/8/15
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {connect} from 'react-redux'
import {fMoney,composeBotton} from 'utils'
import moment from 'moment';
import TableTitle from 'compoments/tableTitleWithTime'
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

/*const apiFields = (getFieldValue)=> [
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
]*/

const searchFields =(disabled,declare)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            componentProps:{
                labelInValue:true,
                disabled:disabled
            },
            formItemStyle,
            span:8,
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
            label:'会计期间',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                /*rules:[
                    {
                        required:true,
                        message:'请选择会计期间'
                    }
                ]*/
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
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
            }
        },
        {
            label: '科目名称',
            fieldName: 'subjectName',
            formItemStyle,
            span: 8,
            type: 'input',
        },
        {
            label: '科目代码',
            fieldName: 'subjectCode',
            formItemStyle,
            span:8,
            type: 'input',

        }
    ]
}
const getColumns = context =>[
    {
        title: '会计期间',
        dataIndex: 'month',
        width:'100px',
    },
    {
        title: '纳税主体编码',
        dataIndex: 'mainCode',
        width:'100px',
    },
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'200px',
    },
    {
        title: '利润中心代码',
        dataIndex: 'profitCenterNum',
        width:'200px',
    },
    {
        title: '利润中心名称',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title: '科目代码',
        dataIndex: 'subjectCode',
        width:'100px',
    },
    {
        title: '科目名称',
        dataIndex: 'subjectName',
        width:'100px',
    },
    {
        title: '期初余额',
        dataIndex: 'initialBalance',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '本期借方发生额',
        dataIndex: 'currentDebitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title: '本期贷方发生额',
        dataIndex: 'currentCreditAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title: '期末余额',
        dataIndex: 'endingBalance',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    }
];
class AccountBalanceSheet extends Component{
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
    render(){
        const {updateKey,filters,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(disabled,declare),
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:getColumns(this),
                        url:'/reportAccountBalance/list',
                        scroll:{ x: 2050,y:window.screen.availHeight-450 },
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
                            title: <TableTitle time={totalSource && totalSource.extractTime}>科目余额表</TableTitle>,
                            extra: (
                                <div>
                                    {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'reportAccountBalance/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1981007'],
                                        }])
                                    }
                                    {/*{
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
                                    }*/}
                                    <TableTotal totalSource={totalSource} type={3} data={[
                                        {
                                            title:'总计',
                                            total:[
                                                {title: '期末余额', dataIndex: 'endingBalanceTotal'},
                                                {title: '期初余额', dataIndex: 'initialBalanceTotal'},
                                                {title: '本期借方发生额', dataIndex: 'currentDebitAmountTotal'},
                                                {title: '本期贷方发生额', dataIndex: 'currentCreditAmountTotal'},
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
}))(AccountBalanceSheet);