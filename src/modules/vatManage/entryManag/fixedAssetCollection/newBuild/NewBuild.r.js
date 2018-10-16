/*
 * @Author: zhouzhe 
 * @Date: 2018-10-13 11:47:47 
 * @Description: '' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-16 16:47:39
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {listMainResultStatus,requestResultStatus,composeBotton} from 'utils'

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
                    url:'/fixedAssetCard/separateList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">固定资产信息采集 / </label>单独新建固定资产</span>,
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'fixedAssetCard/separate/export',
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
