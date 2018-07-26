/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:42:14 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-25 16:12:49
 */
import React from 'react'
import {connect} from 'react-redux'
// import HasDeduct from './hasDeduct'
// import ShouldDeduct from './shouldDeduct'
import moment from 'moment'
import { SearchTable,TableTotal } from 'compoments'
import { fMoney, composeBotton,requestResultStatus,listMainResultStatus,request} from 'utils'
import PopModal from './popModal'

const formItemStyle = {
    labelCol: {
        sm: { span: 10 },
        xl: { span: 8 }
    },
    wrapperCol: {
        sm: { span: 14 },
        xl: { span: 16 }
    }
}
const searchFields = (disabled,declare) => getFieldValue => {
    return [
        {
            label: '纳税主体',
            fieldName: 'main',
            type: 'taxMain',
            span: 8,
            formItemStyle,
            componentProps: {
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税主体'
                    }
                ]
            }
        },
        {
            label: '纳税申报期',
            fieldName: 'authMonth',
            type: 'monthPicker',
            span: 8,
            formItemStyle,
            componentProps: {
                format: 'YYYY-MM',
                disabled: disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                (disabled && moment(declare.authMonth, 'YYYY-MM')) ||
                undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择纳税申报期'
                    }
                ]
            }
        },
        {
            label: '项目名称',
            fieldName: 'projectId',
            type: 'asyncSelect',
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: 'itemName',
                fieldValueName: 'id',
                doNotFetchDidMount: true,
                fetchAble: getFieldValue('mainId') || false,
                url: `/project/list/${getFieldValue('mainId')}`
            }
        },
        {
            label: '项目分期',
            fieldName: 'stagesId',
            type: 'asyncSelect',
            span: 8,
            formItemStyle,
            componentProps: {
                fieldTextName: 'itemName',
                fieldValueName: 'id',
                doNotFetchDidMount: true,
                fetchAble: getFieldValue('projectId') || false,
                url: `/project/stages/${getFieldValue('projectId') || ''}`
            }
        }
    ]
}

/*class DeductProjectSummary extends Component {
    state = {
        activeKey:'1'
    }
    onTabChange = activeKey =>{
        this.setState({
            activeKey
        })
    }
    refreshTabs = ()=>{
        this.setState({
            tabsKey:Date.now()
        })
    }
    render(){
        const {activeKey,tabsKey} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
                <Tabs key={tabsKey} onChange={this.onTabChange} type="card" activeKey={activeKey}>
                    <TabPane tab="土地价款当期应抵扣" key="1">
                        <ShouldDeduct declare={declare} searchFields={searchFields(disabled,declare)}/>
                    </TabPane>
                    <TabPane tab="土地价款当期实际扣除" key="2">
                        <HasDeduct declare={declare} searchFields={searchFields(disabled,declare)} refreshTabs={this.refreshTabs}/>
                    </TabPane>
                </Tabs>
            )
    }
}*/


const columns = [
	{
		title: '纳税主体',
        dataIndex: 'mainName',
        width:'200px',
	},
	{
		title: '项目分期名称',
		dataIndex: 'stagesName',
        width:'200px',
	},
	{
		title: '期初可抵扣土地价款',
		dataIndex: 'initialDeductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'150px',
	},
	{
		title: '分期可售建筑面积',
        dataIndex: 'upAreaSale',
        width:'100px',
	},
	{
		title: '期初销售建筑面积',
		dataIndex: 'saleArea',
        width:'100px',
	},
	{
		title: '未销售建筑面积',
		dataIndex: 'unSaleArea',
        width:'100px',
	},
	{
		title: '项目分期抵扣的土地价款',
		dataIndex: 'deductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'200px',
	},
	{
		title: '期初扣除土地价款',
		dataIndex: 'actualDeductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'150px',
	},
	{
		title: '未抵扣土地价款',
		dataIndex: 'unDeductedLandPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '土地单方成本',
		dataIndex: 'singleLandCost',
		render: text => fMoney(text),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '当期销售建筑面积',
		dataIndex: 'salesBuildingArea',
        width:'150px',
	},
	{
		title: '当期应扣除土地价款',
		dataIndex: 'deductPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'150px',
	},
	{
		title: '收入确认金额',
		dataIndex: 'price',
		render: text => fMoney(text),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
        render: text => text && `${text}%`,
        width:'100px',
	},
	{
		title: '税额',
		dataIndex: 'taxAmount',
		render: text => fMoney(text),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '价税合计',
		dataIndex: 'totalAmount',
		render: text => fMoney(text),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '当期实际扣除土地价款',
		dataIndex: 'actualDeductPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'200px',
	}
]
class DeductProjectSummary extends React.Component {
	state = {
		tableKey: Date.now(),
		doNotFetchDidMount: true,
		filters: {},
        statusParam:{},
        canFinish:false,
        visible:false,
        totalSource:undefined,
	}
	toggleModalVisible = visible => {
		this.setState({
			visible
		})
    }
	refreshTable = () => {
		this.setState({
			tableKey: Date.now()
		})
	}
	fetchResultStatus = ()=>{
        requestResultStatus('/account/landPrice/deductedDetails/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    fetchIsFinish=()=>{
        request.get('/account/landPrice/deductedDetails/loadFinishCount',{params:this.state.filters}).then(({data})=>{
            if(data.code===200){// && data.data >0
                this.setState({
                    canFinish:data.data>0
                })
            }
        })
    }
	render() {
		const { tableKey, filters = {}, statusParam={},canFinish,visible,totalSource} = this.state
        const { declare } = this.props;
        let disabled = !!declare;
		return (
			<SearchTable
				doNotFetchDidMount={!disabled}
				searchOption={{
					fields: searchFields(disabled,declare),
					cardProps: {
						style: {
							borderTop: 0
						}
					}
				}}
				tableOption={{
					cardProps: {
						title: '土地价款扣除明细台账',
					},
					key: tableKey,
					pageSize: 100,
					columns: columns,
					url: '/account/landPrice/deductedDetails/list',
					onSuccess: (params) => {
						this.setState({
							filters: params
						},()=>{
                            this.fetchResultStatus()
                            this.fetchIsFinish()
                        })
                    },
                    scroll:{
                        x:2400,
                        y:window.screen.availHeight-400,
                    },
					extra: (
						<div>
							{
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/landPrice/deductedDetails/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1261007'],
                                }])
                            }
                            {
                                (disabled && declare.decAction==='edit') && canFinish && composeBotton([{
                                    type:'consistent',
                                    icon:'exception',
                                    btnType:'default',
                                    text:'分期结转',
                                    userPermissions:['1265014'],
                                    onClick:()=>{
                                        this.toggleModalVisible(true)
                                    }
                                }],statusParam)
                            }
                            <PopModal visible={visible} filters={filters} toggleModalVisible={this.toggleModalVisible} refreshTable={this.refreshTable}/>
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([{
                                    type:'reset',
                                    url:'/account/landPrice/deductedDetails/reset',
                                    params:filters,
                                    userPermissions:['1261009'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/account/landPrice/deductedDetails/submit',
                                    params:filters,
                                    userPermissions:['1261010'],
                                    onSuccess:()=>{
                                        this.refreshTable()
                                        this.props.refreshTabs()
                                    }
                                },{
                                    type:'revoke',
                                    url:'/account/landPrice/deductedDetails/revoke',
                                    params:filters,
                                    userPermissions:['1261011'],
                                    onSuccess:()=>{
                                        this.refreshTable()
                                        this.props.refreshTabs()
                                    }
                                }],statusParam)
                            }
							<TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '当期实际扣除土地价款', dataIndex: 'amount'},
                                        ],
                                    }
                                ]
                            } />
						</div>
					),
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
				}}
			/>
		)
	}
}


export default connect(state=>({
    declare:state.user.get('declare')
}))(DeductProjectSummary)