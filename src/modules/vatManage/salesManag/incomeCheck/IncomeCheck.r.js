/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
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
            fieldName:'profitCenter',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/project/stages/${getFieldValue('main') && getFieldValue('main').key}`,
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
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/project/list/${getFieldValue('main') && getFieldValue('main').key}`,
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
        },
        {
            label: '房间号',
            fieldName: 'commodityName',
            formItemStyle,
            span:6,
            type: 'input',
        },
        {
            label:'是否存在差异',
            fieldName:'matchingStatus',
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
        dataIndex:'profitCenter',
        width:'200px',
    },
    {
        title:'项目名称',
        dataIndex:'projectName',
        width:'200px',
    },
    {
        title:'项目代码',
        dataIndex:'projectNum',
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
        dataIndex: "accountDate",
        width:'100px',
    },
    {
        title:'财务确认收入',
        children:[
            {
                title:'科目名称',
                dataIndex:'creditSubjectName',
                width:'200px',
            },
            {
                title:'科目代码',
                dataIndex:'creditSubjectCode',
                width:'150px',
            },
            {
                title:'收入金额',
                dataIndex: 'creditAmount',
                render:text=>fMoney(text),
                className: "table-money",
                width:'150px',
            },
        ]
    },
    {
        title:'税务确认收入',
        children:[
            {
                title:'确收日期',
                dataIndex:'confirmedDate',
                width:'100px',
            },
            {
                title:'结算价',
                dataIndex:'sdValorem',
                render: text => fMoney(text),
                className: "table-money",
                width:'150px',
            },
        ]
    },
    {
        title:'是否存在差异',
        dataIndex:'acquisitionMode',
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
    },
    {
        title: "差异金额",
        dataIndex: "gainValue",
        render: text => fMoney(text),
        className: "table-money",
        width:'150px',
    }
];
class IncomeCheck extends Component{
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
        requestResultStatus('/fixedAssetCard/listMain',this.state.filters,result=>{
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
                        fields:searchFields(disabled,declare),
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        }
                    }}
                    backCondition={(filters)=>{
                        this.setState({
                            filters,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:columns,
                        url:'/fixedAssetCard/manageList',
                        cardProps: {
                            title: "收入检查",
                            extra: (
                                <div>
                                    {
                                        listMainResultStatus(statusParam)
                                    }
                                    {
                                        JSON.stringify(filters)!=='{}' && composeBotton([{
                                            type:'fileExport',
                                            url:'fixedAssetCard/export',
                                            params:filters,
                                            title:'导出',
                                            userPermissions:['1511007'],
                                        }])
                                    }
                                    {
                                        (disabled && declare.decAction==='edit') &&  composeBotton([{
                                            type:'submit',
                                            url:'/fixedAssetCard/submit',
                                            params:filters,
                                            userPermissions:['1511010'],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            url:'/fixedAssetCard/revoke',
                                            params:filters,
                                            userPermissions:['1511011'],
                                            onSuccess:this.refreshTable,
                                        }],statusParam)
                                    }
                                    <TableTotal type={3} totalSource={totalSource} data={
                                        [
                                            {
                                                title:'合计',
                                                total:[
                                                    {title: '差异金额', dataIndex: 'allTotalNoInvoiceSales'},
                                                    {title: '收入金额', dataIndex: 'allSumTotalPrice'},
                                                    {title: '结算价', dataIndex: 'allSumTotalAmount'},
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
                            x:2200,
                            y:window.screen.availHeight-380-(disabled?50:0),
                        },
                    }}
                />
            </div>
        )
    }
}
export default IncomeCheck
