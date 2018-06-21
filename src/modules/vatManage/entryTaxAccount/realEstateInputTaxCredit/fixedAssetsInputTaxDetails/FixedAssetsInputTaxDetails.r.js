/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'
const columns = context =>[
    {
        title:'纳税主体',
        dataIndex: "taxSubjectName",
    },{
        title:'项目分期名称',
        dataIndex:'stageName',
    },{
        title:'固定资产名称',
        dataIndex:'assetName',
    },{
        title:'固定资产编号',
        dataIndex:'assetNo',
    },{
        title: "入账日期",
        dataIndex: "accountDate"
    },{
        title:'取得方式',
        dataIndex:'acquisitionMode',
        render: (text, record) => {
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
    },{
        title:'取得价值',
        dataIndex:'gainValue',
        render:(text)=>fMoney(text)
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered"
    },
    {
        title: "税额",
        dataIndex: "inTax",
        render:(text)=>fMoney(text)
    },
    {
        title: "税率",
        dataIndex: "intaxRate",
        render:(text)=>text && `${text}%`,
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
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod"
    },{
        title: "资产类别",
        dataIndex: "assetType"
    },{
        title: "资产状态",
        dataIndex: "assetsState"
    },
];
export default class FixedAssetsInputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
		filters: {},
		statusParam:{}
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/estate/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableKey,statusParam,filters} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:20,
                    columns:columns(this),
                    url:'/account/income/estate/fixedList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>固定资产进项税额明细</span>,
                    },
                    onSuccess: (params) => {
                        this.setState({
                            filters: params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra: (
                        <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([
                                    {
                                        type: 'reset',
                                        url:'/account/income/estate/reset',
                                        params:filters,
                                        userPermissions:['1251009'],
                                        onSuccess:()=>{
                                            this.props.refreshTabs()
                                        },
                                    }
                                ],statusParam)
                            }
                        </div>
                    ),
                    scroll:{
                     x:1400
                     },
                }}
            />
        )
    }
}