/*
 * @Author: zhouzhe 
 * @Date: 2018-10-13 11:47:06 
 * @Description: '' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 10:21:02
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton} from 'utils'

const columns=[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'150px',
    },
    {
        title:'项目分期名称',
        dataIndex:'stageName',
        width:'150px',
    },
    {
        title:'不动产名称',
        dataIndex:'assetName',
        width:'100px',
    },
    {
        title:'不动产编号',
        dataIndex:'assetNo',
        width:'100px',
    },
    {
        title:'转固单号',
        dataIndex:'rotaryNum',
        width:'200px',
    },
    {
        title:'匹配自持产品的产品编码',
        dataIndex:'productNum',
        width:'300px',
    },
    {
        title: "入账日期",
        dataIndex: "accountDate",
        width:'100px',
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
        },
        width:'100px',
    },
    {
        title: "取得价值",
        dataIndex: "gainValue",
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: "资产类别",
        dataIndex: "assetType",
        width:'100px',
    },
    {
        title: "资产状态",
        dataIndex: "assetsState",
        width:'100px',
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered",
        width:'100px',
    },
    {
        title: "税率",
        dataIndex: "intaxRate",
        render:text=>text && `${text}%`,
        className: "table-money",
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "inTax",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
];

 class ExternalCollection extends Component{
    state={
        updateKey:Date.now()+1,
        filters:{},
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {updateKey,filters,totalSource} = this.state;
        const { declare, searchFields } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
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
                backCondition={(filters)=>{
                    this.mounted && this.setState({
                        filters,
                    })
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/fixedAssetCard/fixedList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产信息采集 / </label>不动产卡片</span>,
                        extra: (
                            <div>
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'fixedAssetCard/fixedList/export',
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
                                                {title: '税额', dataIndex: 'inTax'},
                                                {title: '取得价值', dataIndex: 'gainValue'},
                                            ],
                                        }
                                    ]
                                } />
                            </div>
                        )
                    },
                    onTotalSource: (totalSource) => {
                        this.mounted && this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:1800,
                        y:window.screen.availHeight-380-(disabled?50:0),
                    },
                }}
            />
            </div>
        )
    }
}
export default ExternalCollection
