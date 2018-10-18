/*
 * @Author: zhouzhe 
 * @Date: 2018-10-13 11:47:06 
 * @Description: '' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-18 17:14:14
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,listMainResultStatus,requestResultStatus,composeBotton} from 'utils'

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
        title:'固定资产名称',
        dataIndex:'assetName',
        width:'100px',
    },
    {
        title:'固定资产编号',
        dataIndex:'assetNo',
        width:'100px',
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
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {updateKey,filters,statusParam,totalSource} = this.state;
        const { declare, searchFields } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
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
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/fixedAssetCard/externalList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">固定资产信息采集 / </label>外部获取固定资产</span>,
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'fixedAssetCard/external/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1511007'],
                                    }], statusParam)
                                }
                                {
                                    (disabled && declare.decAction==='edit') &&  composeBotton([{
                                        type:'submit',
                                        url:'/fixedAssetCard/submit',
                                        params:filters,
                                        userPermissions:['1511010'],
                                        onSuccess:()=>{
                                            this.props.refreshTabs();
                                        },
                                    },{
                                        type:'revoke',
                                        url:'/fixedAssetCard/revoke',
                                        params:filters,
                                        userPermissions:['1511011'],
                                        onSuccess:()=>{
                                            this.props.refreshTabs();
                                        },
                                    }],statusParam)
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
