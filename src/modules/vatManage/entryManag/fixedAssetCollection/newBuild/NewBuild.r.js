/*
 * @Author: zhouzhe 
 * @Date: 2018-10-13 11:47:47 
 * @Description: '' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 10:16:50
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {composeBotton} from 'utils'

const columns=[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'150px',
    },
    {
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'150px',
    },
    {
        title:'产品名称',
        dataIndex:'productName',
        width:'100px',
    },
    {
        title:'产品编号',
        dataIndex:'productNum',
        width:'100px',
    },
    {
        title:'转固单号',
        dataIndex:'rotaryNum',
        width:'200px',
    },
    {
        title:'匹配的不动产编码',
        dataIndex:'assetNo',
        width:'300px',
    },
    {
        title: "产品类型",
        dataIndex: "productType",
        width:'100px',
    },
    {
        title: "占地面积",
        dataIndex: "coveredArea",
        width:'100px',
    },
    // {
    //     title: "产品状态",
    //     dataIndex: "assetsState",
    //     width:'100px',
    // },
    // {
    //     title: "最新更新时间",
    //     dataIndex: "accountDate1",
    //     width:'100px',
    // },
];

class NewBuildCollection extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {updateKey,filters} = this.state;
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
                        filters
                    })
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/fixedAssetCard/productList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产信息采集 / </label>自持产品清单</span>,
                        extra: (
                            <div>
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'fixedAssetCard/productList/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1511007'],
                                    }])
                                }
                            </div>
                        )
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
export default NewBuildCollection
