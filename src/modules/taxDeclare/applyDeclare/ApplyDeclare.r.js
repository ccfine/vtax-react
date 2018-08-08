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

		// 用来区分 销项发票匹配 中 '销项发票数据匹配' 和 '房间交易档案'
		activeTab:'1',
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
	add = (key,title,Component,props={}) => {
		const panes = this.state.panes,
			activeKey =key;
			// {record} = this.state,
			// {decAction} = this.props;
		if(!Component ){return}else if(panes.some(ele=>ele.key === key)){
			this.setState({ activeKey,...props })
			return;
		}
		
		panes.push({
			title: title,
			Component: Component,
			key: activeKey
		})
		this.setState({ panes, activeKey ,...props })
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
		const {record,mainUpdateKey,recordLoading,activeTab} = this.state,
		{url,decAction} = this.props; 
		return recordLoading?'加载中...'
		:(
			!record?'加载异常，请检查网络！':
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
						<pane.Component declare={{mainId:record.mainId,mainName:record.mainName,authMonth:record.partTerm,decAction:decAction}} activeTab={pane.title==='销项发票匹配'?activeTab:undefined}/>
					</TabPane>
				))}
				
			</Tabs>
		)
	}
}

export default withRouter(ApplyDeclare)
