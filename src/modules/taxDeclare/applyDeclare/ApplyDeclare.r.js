import React from 'react'
import Main from './main'
import { Tabs,message } from 'antd'
import {request} from 'utils'
import {withRouter} from 'react-router-dom';
const TabPane = Tabs.TabPane

class ApplyDeclare extends React.Component {
	state ={
		panes: [],
		activeKey: null,
		record:null,
		mainUpdateKey:Date.now(),
	}
	componentDidMount(){
		this.fetchRecordById(this.props.match.params.id)
	}
	fetchRecordById=(id)=>{
		request.get(`/tax/declaration/find/${id}`).then(({data}) => {
			if(data.code === 200){
				this.setState({
					record:data.data,
					activeKey:'main',
				})
			}else{
				message.error(data.msg)
			}
		}).catch(err=>{
			message.error(err.message)
		})
	}
	onChange = activeKey => {
		this.setState({ activeKey,mainUpdateKey:Date.now() })
	}
	onEdit = (targetKey, action) => {
		this[action](targetKey)
	}
	add = (key,title,Component) => {
		const panes = this.state.panes,
			activeKey =key,
			{record} = this.state;
		if(!Component ){return}else if(panes.some(ele=>ele.key === key)){
			this.setState({ activeKey })
			return;
		}
		
		panes.push({
			title: title,
		content: <Component declare={{mainId:record.mainId,authMonth:record.partTerm,decAction:'edit'}}/>,
			key: activeKey
		})
		this.setState({ panes, activeKey })
	}
	remove = targetKey => {
		let activeKey = this.state.activeKey,
		newState = {};
		const panes = this.state.panes.filter(pane => pane.key !== targetKey)
		newState.panes = panes
		if (activeKey === targetKey) {
			if(panes.length>0){
				newState.activeKey = panes[panes.length-1].key
			}else{
				newState.activeKey = 'main'
				newState.mainUpdateKey = Date.now()
			}
		}
		this.setState(newState)
	}
	render() {
		const {record,mainUpdateKey} = this.state;
		return (
            <Tabs
				hideAdd={true}
                tabBarStyle={{marginBottom:0}}
				onChange={this.onChange}
				activeKey={this.state.activeKey}
				type="editable-card"
				onEdit={this.onEdit}>
				<TabPane tab='申报处理' key='main' closable={false}>
					<Main addPane={this.add} record={record} updateKey={mainUpdateKey}/>
				</TabPane>
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

export default withRouter(ApplyDeclare)
