/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:42:14 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-03 14:14:04
 */
import React from 'react'
// import HasDeduct from './hasDeduct'
// import ShouldDeduct from './shouldDeduct'
import moment from 'moment'
import { SearchTable,TableTotal,PopDetailsModal } from 'compoments'
import { fMoney, composeBotton,requestResultStatus,request,parseJsonToParams} from 'utils'
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
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:8,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
            }
        },
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


const columns = context => [
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
	/*{
		title: '纳税主体',
        dataIndex: 'mainName',
        width:'200px',
	},*/
	{
		title: '项目分期名称',
		dataIndex: 'stagesName',
        //width:'200px',
	},
	{
		title: '期初可抵扣土地价款',
		dataIndex: 'initialDeductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money',
        width:'150px',
    },
    {
        title: "当期发生的已标记的可抵扣土地价款",
        dataIndex: "actualAppendDeductPrice",
        width: "250px",
        className:'table-money',
    },
    {
        title: '项目分期可抵扣的土地价款',
        dataIndex: 'deductibleLandPrice',
        render: text => fMoney(text),
        className: 'table-money',
        width:'200px',
    },
    {
        title: '累计扣除土地价款',
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
        width:'150px',
    },
	{
		title: '分期可售建筑面积',
        dataIndex: 'upAreaSale',
        width:'150px',
    },
    {
		title: '项目分期自持产品建筑面积',
        dataIndex: 'buildingArea',
        width:'200px',
	},
	{
		title: '累计销售建筑面积',
		dataIndex: 'saleArea',
        width:'150px',
	},
	{
		title: '未销售建筑面积',
		dataIndex: 'unSaleArea',
        width:'150px',
	},
	{
		title: '土地单方价款',
		dataIndex: 'singleLandCost',
		render: text => fMoney(text),
		className: 'table-money',
        width:'150px',
	},
	{
		title: '当期销售建筑面积',
        dataIndex: 'salesBuildingArea',
        render: (text, record) => (
            <a title="查看详情"
               onClick={ () => context.toggleModalVoucherVisible(true, record.stagesId) }
            >
                { text }
            </a>
        ),
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
        render: (text, record) =>  (
            <a title="查看详情"
               onClick={ () => context.toggleModalVoucherVisible(true, record.stagesId) }
            >
                { fMoney(text) }
            </a>
        ),
		className: 'table-money',
        width:'100px',
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
        render:text=>text? `${text}%`: text,
        width:'100px',
        className:'text-right',
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

const voucherSearchFields = [
    {
        label: "房间编码",
        fieldName: "roomCode",
        span: 8,
        formItemStyle
    }
]
const voucherColumns = [
    {
        title: "利润中心",
        dataIndex: "profitCenterName",
        width: 150
    },
    {
        title: "项目分期名称",
        dataIndex: "itemName",
        width: 200
    },
    {
        title: "房间编码",
        dataIndex: "roomCode",
        width: 150
    },
    {
        title: "路址",
        dataIndex: "htRoomName",
        // width: 300
    },
    {
        title: "房间建筑面积",
        dataIndex: "roomArea",
        width: 150
    },
    {
        title: "确收时点",
        dataIndex: "confirmedDate",
        width: 150
    },{
        title: "前期累计开票金额",
        dataIndex: "sumTotalAmount",
        className:'table-money',
        width: 150
    },{
        title: "本期开票金额",
        className:'table-money',
        dataIndex: "totalAmount",
        width: 150
    },
    {
        title: "结算价",
        dataIndex: "valorem",
        width: 150,
        className:'table-money',
    },
    {
        title: "确收金额",
        dataIndex: "confirmedPrice",
        width: 150,
        className:'table-money',
    },
    {
        title: "收入确认金额",
        dataIndex: "price",
        width: 150,
        className:'table-money',
    },
    {
        title: "当期销售建筑面积",
        dataIndex: "salesBuildingArea2",
        width: 150
    },
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
        voucherVisible: false,
        voucherFilter: {},
        stagesId: ""
	}
	toggleModalVisible = visible => {
		this.setState({
			visible
		})
    }
    toggleModalVoucherVisible = (voucherVisible, stagesId) => {
        this.setState({
            voucherVisible,
            stagesId
        })
    }
	refreshTable = () => {
		this.setState({
			tableKey: Date.now()
		})
	}
	fetchResultStatus = ()=>{
        requestResultStatus('',this.state.filters,result=>{
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
		const { tableKey, filters = {}, statusParam={},canFinish,visible,totalSource,voucherVisible,voucherFilter,stagesId} = this.state
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
                        columns: columns(this),
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
                            x:2950,
                            y:window.screen.availHeight-400-(disabled?50:0),
                        },
                        extra: (
                            <div>
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
                >
                <PopDetailsModal
                    title="详情"
                    visible={voucherVisible}
                    fields={voucherSearchFields}
                    toggleModalVoucherVisible={this.toggleModalVoucherVisible}
                    tableOption={{
                        cardProps: {
                            title: "详情列表"
                        },
                        columns: voucherColumns,
                        url: `/account/landPrice/deductedDetails/detailsList?${parseJsonToParams(filters)}&stagesId=${stagesId}`,
                        scroll: { x: "2000px", y: "250px" },
                        onSuccess: params => {
                            this.setState({
                                voucherFilter: params
                            })
                        },
                        extra: (
                            <div>
                                {
                                    JSON.stringify(voucherFilter) !== "{}" && composeBotton([{
                                        type: "fileExport",
                                        url: `account/landPrice/deductedDetails/details/export`,
                                        params: Object.assign(voucherFilter, filters, {stagesId: stagesId}),
                                        title: "导出",
                                        userPermissions: ["1261007"]
                                    }])
                                }
                            </div>
                        )
                    }}
                />
                </SearchTable>
		)
	}
}


export default DeductProjectSummary