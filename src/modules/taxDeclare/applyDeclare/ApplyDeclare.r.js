import React from 'react'
import Main from './main'
import { Tabs,message } from 'antd'
import {request} from 'utils'
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types'
const TabPane = Tabs.TabPane

class ApplyDeclare extends React.Component {
	static propTypes={
		url:PropTypes.string,
		decAction:PropTypes.oneOf(['edit',''])
		}
	state ={
		panes: [],
		activeKey: 'main',
		record:null,
		mainUpdateKey:Date.now(),
		recordLoading:true,
	}
	componentDidUpdate(){
		document.title=this.props.decAction==='edit'?'申报办理':'查看申报';
	}
	componentDidMount(){
		this.fetchRecordById(this.props.match.params.id)
	}
	toggleRecordLoading(recordLoading){
		this.setState({recordLoading})
	}
	fetchRecordById=(id)=>{
		this.toggleRecordLoading(true)
		request.get(`/tax/declaration/find/${id}`).then(({data}) => {
			if(data.code === 200){
				this.setState({
					record:data.data,
					activeKey:'main',
				})
			}else{
				message.error(data.msg)
			}
			this.toggleRecordLoading(false)
		}).catch(err=>{
			message.error(err.message)
			this.toggleRecordLoading(false)
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
			{record} = this.state,
			{decAction} = this.props;
		if(!Component ){return}else if(panes.some(ele=>ele.key === key)){
			this.setState({ activeKey })
			return;
		}
		
		panes.push({
			title: title,
		content: <Component declare={{mainId:record.mainId,authMonth:record.partTerm,decAction:decAction}}/>,
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
		const {record,mainUpdateKey,recordLoading} = this.state,
		{url,decAction} = this.props; 
		return recordLoading?'加载中...'
		:(
            <Tabs
				hideAdd={true}
                tabBarStyle={{marginBottom:0}}
				onChange={this.onChange}
				activeKey={this.state.activeKey}
				type="editable-card"
				onEdit={this.onEdit}
				tabBarGutter={0}>
				<TabPane tab={decAction==='edit'?'申报办理':'查看申报'} key='main' closable={false}>
					<Main addPane={this.add} record={record} updateKey={mainUpdateKey} url={url}/>
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
