/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:44:13 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-19 16:40:13
 */
import React from 'react'
import {message} from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,request,listMainResultStatus,composeBotton} from 'utils'

const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    },
	{
		title: (
			<div className="apply-form-list-th">
				<p className="apply-form-list-p1">项目名称</p>
				<p className="apply-form-list-p2">项目分期</p>
			</div>
		),
		dataIndex: 'projectName',
		render: (text, record) => (
			<div>
				<p className="apply-form-list-p1">{text}</p>
				<p className="apply-form-list-p2">{record.stagesName}</p>
			</div>
		)
	},{
        title: '可售面积',
        dataIndex: 'upAreaSale',
    },{
        title: '分摊抵扣的土地价款',
        dataIndex: 'deductibleLandPrice',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '单方土地成本',
        dataIndex: 'singleLandCost',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '累计销售面积',
        dataIndex: 'saleArea',
    },{
        title: '累计已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '当期销售建筑面积',
        dataIndex: 'salesBuildingArea',
    },{
        title: '当期实际扣除土地价款',
        dataIndex: 'actualDeductPrice',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '收入确认金额',
        dataIndex: 'price',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>parseInt(text,10) && text+'%',
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
        className:'table-money',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
    }
];
export default class HasDeduct extends React.Component{
    state={
        tableKey:Date.now(),
        doNotFetchDidMount:true,
        filters:{

        },
        statusParam:undefined,
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        request.get('/account/landPrice/deductedDetails/listMain',{
            params:{
                ...this.state.filters
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam:data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {tableKey,filters={},statusParam={}} = this.state;
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
                    cardProps:{
                        title:'土地价款当期实际扣除'
                    },
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/account/landPrice/deductedDetails/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'reset',
                                url:'/account/landPrice/deductedDetails/reset',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'submit',
                                url:'/account/landPrice/deductedDetails/submit',
                                params:filters,
                                monthFieldName:'authMonth',
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/landPrice/deductedDetails/revoke',
                                params:filters,
                                monthFieldName:'authMonth',
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                    </div>,
                }}
            >
            </SearchTable>
        )
    }
}