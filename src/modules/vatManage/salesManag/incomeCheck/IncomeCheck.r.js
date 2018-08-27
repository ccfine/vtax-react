/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton} from 'utils'
//import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

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
            label:'截至月份',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            formItemStyle,
            /*fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },*/

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
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || false,
                url: `/taxsubject/projectByProfitCenter/${getFieldValue('profitCenterId') || ''}`
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
                url:`/taxsubject/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label: '房间编码',
            fieldName: 'roomCode',
            formItemStyle,
            span:6,
            type: 'input',
        },
        {
            label:'是否存在差异',
            fieldName:'dif',
            type:'select',
            formItemStyle,
            span:6,
            options:[
                {
                    text:'否',
                    value:'0'
                },
                {
                    text:'是',
                    value:'1'
                }
            ]
        }
    ]
}
const columns=[
    {
        title:'利润中心',
        dataIndex:'profitCenterName',
        width:'200px',
    },
    {
        title:'项目名称',
        dataIndex:'itemName',
        width:'200px',
    },
    {
        title:'项目分期',
        dataIndex:'stagesName',
        width:'150px',
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'150px',
    },
    {
        title:'路址',
        dataIndex:'htRoomName',
        //width:'100px',
    },
    {
        title: "确收时间",
        dataIndex: "confirmedDate",
        width:'100px',
    },
    {
        title:'增值税申报销售额',
        dataIndex: "newSdValorem",
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title:'财务确认收入金额',
        dataIndex: "amount",
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title: "差异金额",
        dataIndex: "difAmount",
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title:'是否存在差异',
        dataIndex:'dif',
        render:(text)=>{
            // 0-否  1-是
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
            return res;
        },
        width:'100px',
    }
];
export default class IncomeCheck extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    render(){
        const {updateKey,filters,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
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
                    backCondition={(filters)=>{
                        this.setState({
                            filters
                        })
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:columns,
                        url:'/output/income/check/list',
                        cardProps: {
                            title: "收入检查",
                            extra: (
                                <div>
                                    {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'output/income/check/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1511007'],
                                        }])
                                    }
                                    <TableTotal type={3} totalSource={totalSource} data={
                                        [
                                            {
                                                title:'合计',
                                                total:[
                                                    {title: '差异金额', dataIndex: 'allDifAmount'},
                                                    {title: '收入金额', dataIndex: 'allAmount'},
                                                    {title: '结算价', dataIndex: 'allNewSdValorem'},
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
                        scroll:{
                            x:1600,
                            y:window.screen.availHeight-380-(disabled?50:0),
                        },
                    }}
                />
            </div>
        )
    }
}
