import React from 'react'
import Main from './main'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane


class ApplyDeclare extends React.Component {
	static defaultProps = {
		record:{
            "id" : "1014110937159667713",
            "createdDate" : "2018-07-03 19:37:43",
            "lastModifiedDate" : "2018-07-03 19:37:43",
            "createdBy" : "5bfdf8840d3c4afab603d5e6fef5d5f0",
            "lastModifiedBy" : "5bfdf8840d3c4afab603d5e6fef5d5f0",
            "handleState" : "申报办理",
            "lastDate" : "",
            "region" : "江中区域",
            "orgName" : "凤凰碧桂园房地产开发有限公司01",
            "mainName" : "凤凰碧桂园01",
            "partTerm" : "2018-09",
            "taxType" : "1",
            "excelTaxType" : "增值税",
            "subordinatePeriodStart" : "2018-09-01",
            "subPeriodStart" : "",
            "subordinatePeriodEnd" : "2018-09-30",
            "subPeriodEnd" : "",
            "isProcess" : "一般纳税人-独立纳税",
            "declareBy" : "",
            "declarationDate" : "2018-07-03",
            "decDate" : "",
            "mainId" : "1011854657783144449",
            "month" : "2018-09",
            "orgId" : "e86913c631c44f2f95b2f33b160971bc",
            "status" : 1,
            "isProcessId" : "71",
            "taxDeclaration" : "一般纳税人申报表（通用）",
            "taxDeclarationId" : "23",
            "taxModality" : "独立纳税",
            "taxModalityId" : "69",
            "remark" : ""
          }
	}
	constructor(props){
		super(props)
		this.state ={
			panes: [
				{ title: '申报办理', content: <Main addPane={this.add}/>, key: 'main',closable:false},
			],
			activeKey: 'main'
		}
	}
	onChange = activeKey => {
		this.setState({ activeKey })
	}

	onEdit = (targetKey, action) => {
		this[action](targetKey)
	}

	add = (title,Component) => {
		if(!Component){return}
		const panes = this.state.panes
		const activeKey = `newTab${this.newTabIndex++}`
		panes.push({
			title: title,
		content: <Component declare={{mainId:this.props.record.mainId,authMonth:this.props.record.partTerm}}/>,
			key: activeKey
		})
		this.setState({ panes, activeKey })
	}

	remove = targetKey => {
		let activeKey = this.state.activeKey
		let lastIndex
		this.state.panes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1
			}
		})
		const panes = this.state.panes.filter(pane => pane.key !== targetKey)
		if (lastIndex >= 0 && activeKey === targetKey) {
			activeKey = panes[lastIndex].key
		}
		this.setState({ panes, activeKey })
	}
	render() {
		return (
            <Tabs
                tabBarStyle={{marginBottom:0}}
				onChange={this.onChange}
				activeKey={this.state.activeKey}
				type="editable-card"
				onEdit={this.onEdit}>
				{this.state.panes.map(pane => (
					<TabPane
						tab={pane.title}
						key={pane.key}
						closable={pane.closable}>
						{pane.content}
					</TabPane>
				))}
			</Tabs>
		)
	}
}

export default ApplyDeclare
