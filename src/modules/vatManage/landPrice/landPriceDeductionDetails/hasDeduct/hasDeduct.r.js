/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:44:13 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-19 16:40:13
 */
import React from 'react'
import {message} from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,getUrlParam,request,listMainResultStatus,composeBotton} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'

const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields =(disabled)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                disabled,
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },
        },
        {
            label:'纳税申报期',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            formItemStyle,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税申报期'
                    }
                ]
            },
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
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
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
        }
    ]
}


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
class HasDeduct extends React.Component{
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                doNotFetchDidMount:false
            },()=>{
                this.refreshTable()
            })

        }else{
            this.setState({
                doNotFetchDidMount:true
            })
        }
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
        const {tableKey,filters={},doNotFetchDidMount,statusParam={}} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={doNotFetchDidMount}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                // spinning={searchTableLoading}
                tableOption={{
                    cardProps:{
                        title:'土地价款当期实际扣除'
                    },
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/account/landPrice/deductedDetails/list',
                    onSuccess:(params,data)=>{
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
                            JSON.stringify(filters) !=='{}' && composeBotton([{
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

export default withRouter(HasDeduct)