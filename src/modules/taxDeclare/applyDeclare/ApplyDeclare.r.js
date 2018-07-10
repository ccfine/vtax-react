import React from 'react'
import Main from './main'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane


class ApplyDeclare extends React.Component {
	state = {
		panes: [
			{ title: '申报办理', content: <Main/>, key: 'main',closable:false},
		],
		activeKey: 'main'
	}
	onChange = activeKey => {
		this.setState({ activeKey })
	}

	onEdit = (targetKey, action) => {
		this[action](targetKey)
	}

	add = () => {
		const panes = this.state.panes
		const activeKey = `newTab${this.newTabIndex++}`
		panes.push({
			title: 'New Tab',
			content: 'Content of new Tab',
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
