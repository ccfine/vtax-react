/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {SearchTable} from 'compoments'
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

const searchFields =  (disabled,declare) => {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && declare['mainId']) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },{
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
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
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
        title:'纳税主体名称',
        dataIndex:'taxSubjectName',
    },
    {
        title:'纳税主体代码',
        dataIndex:'taxSubjectNum',
    },
    {
        title:'项目分期名称',
        dataIndex:'stageName',
    },
    {
        title:'纳税主体代码',
        dataIndex:'stageNum',
    },
    {
        title:'固定资产名称',
        dataIndex:'assetName',
    },
    {
        title:'固定资产编号',
        dataIndex:'assetNo',
    },
    {
        title: "入账日期",
        dataIndex: "accountDate"
    },
    {
        title:'取得方式',
        dataIndex:'acquisitionMode',
        render:(text)=>{
            // 0-外部获取
            // 1-单独新建
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
                    break;
                case 1:
                    res = "单独新建";
                    break;
                case 2:
                    res = "自建转自用";
                    break;
                default:
                    break;
            }
            return res;
        }
    },
    {
        title: "取得价值",
        dataIndex: "gainValue"
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered"
    },
    {
        title: "购进税额",
        dataIndex: "inTax",
        render:(text)=>fMoney(text)
    },
    {
        title: "购进税率",
        dataIndex: "intaxRate",
        render:text=>text && `${text}%`
    },
    {
        title: "当期抵扣的进项税额",
        dataIndex: "taxAmount",
        render:(text)=>fMoney(text)
    },
    {
        title: "待抵扣的进项税额",
        dataIndex: "deductedTaxAmount",
        render:(text)=>fMoney(text)
    },
    {
        title: "资产类别",
        dataIndex: "assetType"
    },
    {
        title: "资产状态",
        dataIndex: "assetsState"
    },
];
 class FixedAssetCollection extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam: {},
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
        const {updateKey,filters,statusParam} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare)
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:20,
                    columns:columns,
                    url:'/fixedAssetCard/manageList',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: "固定资产信息采集",
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
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
                            </div>
                        )
                    },
                    scroll:{
                     x:1500
                     },
                }}
            />

        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(FixedAssetCollection)
