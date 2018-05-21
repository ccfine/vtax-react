/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:44:13 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-21 10:56:58
 */
import React from 'react'
import { SearchTable } from 'compoments'
import {
	fMoney,
	getUrlParam,
    composeBotton
} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'

const formItemStyle = {
	labelCol: {
		sm: {
			span: 10
		},
		xl: {
			span: 8
		}
	},
	wrapperCol: {
		sm: {
			span: 14
		},
		xl: {
			span: 16
		}
	}
}
const searchFields = disabled => getFieldValue => {
	return [
		{
			label: '纳税主体',
			fieldName: 'mainId',
			type: 'taxMain',
			span: 6,
			formItemStyle,
			componentProps: {
				disabled
			},
			fieldDecoratorOptions: {
				initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
			span: 6,
			formItemStyle,
			componentProps: {
				format: 'YYYY-MM',
				disabled: disabled
			},
			fieldDecoratorOptions: {
				initialValue:
					(disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) ||
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
			span: 6,
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
			span: 6,
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

const columns = [
	{
		title: '纳税主体',
		dataIndex: 'mainName'
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
	},
	{
		title: '可售面积',
		dataIndex: 'upAreaSale'
	},
	{
		title: '分摊抵扣的土地价款',
		dataIndex: 'deductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money'
	},
	{
		title: '单方土地成本',
		dataIndex: 'singleLandCost',
		render: text => fMoney(text),
		className: 'table-money'
	},
	{
		title: '累计销售面积',
		dataIndex: 'saleArea'
	},
	{
		title: '累计已扣除土地价款',
		dataIndex: 'actualDeductibleLandPrice',
		render: text => fMoney(text),
		className: 'table-money'
	},
	{
		title: '当期销售建筑面积',
		dataIndex: 'salesBuildingArea'
	},
	{
		title: '当期应扣除土地价款',
		dataIndex: 'deductPrice',
		render: text => fMoney(text),
		className: 'table-money'
	},
	{
		title: '收入确认金额',
		dataIndex: 'price',
		render: text => fMoney(text),
		className: 'table-money'
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
		render: text => parseInt(text, 10) && text + '%'
	},
	{
		title: '税额',
		dataIndex: 'taxAmount',
		render: text => fMoney(text),
		className: 'table-money'
	}
]
class ShouldDeduct extends React.Component {
	state = {
		tableKey: Date.now(),
		doNotFetchDidMount: true,
		searchFieldsValues: {},
		statusParams: undefined,

		dataSource: undefined
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
	componentDidMount() {
		const { search } = this.props.location
		if (!!search) {
			this.setState(
				{
					doNotFetchDidMount: false
				},
				() => {
					this.refreshTable()
				}
			)
		} else {
			this.setState({
				doNotFetchDidMount: true
			})
		}
	}
	render() {
		const {
			tableKey,
			searchFieldsValues = {},
			doNotFetchDidMount
		} = this.state
		const { search } = this.props.location
		let disabled = !!search
		let submitIntialValue = {
			...searchFieldsValues,
			taxMonth: searchFieldsValues.month
		}
		return (
			<SearchTable
				style={{
					marginTop: -16
				}}
				doNotFetchDidMount={doNotFetchDidMount}
				searchOption={{
					fields: searchFields(disabled),
					cardProps: {
						style: {
							borderTop: 0
						}
					}
				}}
				// spinning={searchTableLoading}
				tableOption={{
					cardProps: {
						title: '土地价款当期应抵扣'
					},
					key: tableKey,
					pageSize: 10,
					columns: columns,
					url: '/account/landPrice/deductedDetails/list',
					onSuccess: (params, data) => {
						this.setState({
							searchFieldsValues: params
						})
					},
					extra: (
						<div>
							{
								composeBotton([
									{
										type: 'reset',
										url:
											'/account/landPrice/deductedDetails/reset',
										params: { ...submitIntialValue },
										onSuccess: this.refreshTable
									}
								])
							}
						</div>
					),
				}}
			/>
		)
	}
}

export default withRouter(ShouldDeduct)
