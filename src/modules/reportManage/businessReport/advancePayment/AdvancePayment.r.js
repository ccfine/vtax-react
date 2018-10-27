/**
 * Created by liuliyuan on 2018/10/27.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import moment from 'moment';
import {SearchTable,TableTotal} from 'compoments'
import {fMoney} from 'utils'
//import {fMoney,composeBotton} from 'utils'
//import createSocket from '../socket'
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
            span:6,
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
            span:6,
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
                 message:'请选择查询期间'
                 }
                 ]*/
            },

        },
        {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
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
            label:'项目分期',
            fieldName:'stageId',
            type:'asyncSelect',
            span:6,
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
            label: '科目代码',
            fieldName: 'subjectCode',
            formItemStyle,
            span:6,
            type: 'input',

        },
        {
            label: '科目名称',
            fieldName: 'subjectName',
            formItemStyle,
            span: 6,
            type: 'input',
        },
        {
            label: 'SAP凭证号',
            fieldName: 'voucherNumSap',
            formItemStyle,
            span: 6,
            type: 'input',
        },
        {
            label: '转租业务',
            fieldName: 'subletBusiness',
            formItemStyle,
            span: 6,
            type: 'select',
            options: [
                {
                     text:'是',
                     value:'1'
                },{
                     text:'否',
                     value:'0'
                }
            ],
        },
    ]
}
const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'profitCenterNum',
        width:'200px',
    },
    {
        title: '项目分期名称',
        dataIndex: 'stageName',
        width:'200px',
    },
    {
        title: '科目代码',
        dataIndex: 'subjectCode',
        width:'200px',
    },
    {
        title: '科目名称',
        dataIndex: 'subjectName',
        width:'200px',
    },
    {
        title: 'SAP凭证号',
        dataIndex: 'voucherNumSap',
        width:'200px',
    },
    {
        title: '款项明细',
        dataIndex: 'zkxmx',
        //width:'100px',
    },
    {
        title: '税率',
        dataIndex: 'taxRate',
        width:'100px',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    },
    {
        title: '本币不含税金额',
        dataIndex: 'amountWithoutTax',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '期间（月份）',
        dataIndex: 'month',
        width:'150px',
    },
    {
        title: '年度',
        dataIndex: 'accountYear',
        width:'150px',
    },
    {
        title: '转租业务',
        dataIndex: 'subletBusiness',
        width:'100px',
        render: text => {
            // 0-否
            // 1-是
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "否";
                    break;
                case 1:
                    res = "是";
                    break;
                default:
                    break;
            }
            return res
        }
    }
];
class AdvancePayment extends Component{
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
        const {updateKey,totalSource} = this.state;
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
                        url:'/advanceRentPayments/list',
                        scroll:{ x: 2100,y:window.screen.availHeight-450 },
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
                            title: '预缴账款-租金表',
                            extra: (
                                <div>
                                    {/*{
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'reportAccountBalance/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1891007'],
                                        }])
                                    }
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
                                    }*/}
                                    <TableTotal totalSource={totalSource} type={3} data={[
                                        {
                                            title:'总计',
                                            total:[
                                                {title: '本币不含税金额', dataIndex: 'amount'},
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
}))(AdvancePayment);