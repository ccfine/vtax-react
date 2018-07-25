/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:36
 * description  :
 */
import React, { Component } from 'react'
import { Icon, Modal, Row, Col, Steps, List, Card, message,Spin } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { composeMenus, request } from 'utils'
import routes from 'modules/routes'
import { saveDeclare } from 'redux/ducks/user'
import './styles.less'

// 所有的路由信息--平铺
let allPlainRoutes = null;

// 将后台数据转换为方便处理的数据
const transformDeclaration = data => {
	let res = []

	// 所有的路由信息
	allPlainRoutes = (function() {
		if(allPlainRoutes){
			return allPlainRoutes;
		}else{
			return composeMenus(routes).filter(item => !(!item.name || item.path === '/web'))
		}
	})()

	data.forEach((ele, index) => {
		if (ele.length > 0) {
			res.push({
				title: index === 0 ? '数据采集': index === 1? '数据处理': '生成台账',
				options: ele.map(decla => {
                    //特殊处理下 销项发票数据匹配||房间交易档案采集
                    let tab=1;
                    if(decla.name==='房间交易档案采集' || (decla.name==='销项发票数据匹配' && ++tab) ){
                        let route = allPlainRoutes.find(
                            ele => ele.name === '销项发票匹配'
                        )
                        return {
                            ...decla,
                            path: route && `${route.path}?tab=${tab}`
                        }
                    }else{
                        let route = allPlainRoutes.find(
                            ele => ele.name === decla.name
                        )
                        return {
                            ...decla,
                            path: route && route.path
                        }
                    }
				})
			})
		}
	})

	return res
}

// 申报任务状态转换
const getStatuText =(status)=> {
    status = parseInt(status, 0)
    let span = undefined
    switch (status) {
        case 1:
            span = <span style={{ color: '#f5222d' }}>未提交</span>
            break
        case 2:
            span = <span style={{ color: '#333' }}>已提交</span>
            break
        default:
    }
    return span ? <span>【{span}】</span> : ''
}

// 步骤数据
const Step = Steps.Step
const steps = [
	{
		title: '销项管理',
		decConduct: 0
	},
	{
		title: '进项管理',
		decConduct: 1
	},
	{
		title: '其他管理',
		decConduct: 2
	},
	{
		title: '税款计算',
		decConduct: 3
	},
	{
		title: '纳税申报表',
		decConduct: 4
	}
]

class ApplyDeclarationPopModal extends Component {
	static propTypes = {
		onSuccess: PropTypes.func,
		url:PropTypes.string,
	}
	static defaultProps = {
		title: '申报办理',
		url:'/tax/decConduct/list',
	}
	state = {
		loading: false,
		data: [],
		current: 0,
        path:'',
	}
	toggleLoading = loading => {
		this.setState({
			loading
		})
	}
	handleCurrent = current => {
		this.setState({ current }, () => {
			this.fetchDeclarationById({
				decConduct: current,
				mainId: this.props.record.mainId,
				authMonth: this.props.record.partTerm
			})
		})
	}
	getOneContent = (singleData, index) => {
		return (
			<List
				key={index}
				grid={{ gutter: 16, column: 1 }}
				dataSource={singleData}
				renderItem={item => (
					<List.Item>
						<Card>
							{item.path ? (
								<a
								   onClick={e => {
                                       e && e.preventDefault();
                                       this.LockPageRefresh(item.path)
                                   }}
									>
                                    {item.name}
                                    {getStatuText(item.status)}
								</a>
							) : (
								<span
									style={{
										color: 'rgba(0, 0, 0, 0.65)'
									}}>
									{item.name}
									{getStatuText(item.status)}
								</span>
							)}
						</Card>
					</List.Item>
				)}
			/>
		)
	}
	getContent = (current, routes) => {
		let { data: dataSource } = this.state
		// 计算没一列的span
		let everySpan = 7
		everySpan = Math.floor((25 - dataSource.length) / dataSource.length)

		return (
			<Row gutter={0} justify="center" type="flex">
				{dataSource.map((item, index) => {
					let res = []
					if (index !== 0) {
						res.push(
							<Col span={1}>
								<div className="steps-icon">
									<Icon type="arrow-right" />
								</div>
							</Col>
						)
					}
					res.push(
						<Col span={index===dataSource.length-1?(24-(dataSource.length-1)*(everySpan+1)):everySpan}>
							<h4 className="steps-title">{item.title}</h4>
							<div className="steps-content">
								{this.getOneContent(item.options, 0)}
							</div>
						</Col>
					)
					return res
				})}
			</Row>
		)
	}

    LockPageRefresh = path => {
        const location = window.location;
        const url = location.protocol + "//" + location.host + path;
        const { saveDeclare, record} = this.props;
        saveDeclare({
            mainId: record.mainId,
            authMonth: record.partTerm,
            authMonthEnd: record.subordinatePeriodEnd,
            status: record.status,
            decAction: record.decAction
        })
		setTimeout(()=>{
        	//TODO: 给ie10用的 为了防止被浏览器拦截
            //window.open(url, '_blank').location;
            const ref = Modal.warning({
                title: '友情提醒',
                content: <h2>操作完成后，请刷新当前页面！</h2>,
                okText: '刷新',
                onOk: () => {
                    ref.destroy()
                    const { record } = this.props;
                    this.fetchDeclarationById({
                        decConduct: this.state.current,
                        mainId: record.mainId,
                        authMonth: record.partTerm
                    })
                }
            })

            window.open(url)
        },500)

    }



	fetchDeclarationById = (data,url=this.props.url) => {
        this.toggleLoading(true)
		request
			.get(url, {
				params: data
			})
			.then(({ data }) => {
                if(data.code===200){
                    this.setState({
                        data: transformDeclaration(data.data)
                    })
                }

                this.toggleLoading(false)
			})
			.catch(err => {
                this.toggleLoading(false)
				message.error(err.message)
			})
	}
	componentWillReceiveProps(nextProps) {

		if (!this.props.visible && nextProps.visible) {
            const { record } = nextProps;
			this.fetchDeclarationById({
				decConduct: this.state.current,
				mainId: record.mainId,
				authMonth: record.partTerm
			},nextProps.url)
		}
	}

	render() {
		const props = this.props
		const { data, loading, current } = this.state
		return (
			<Modal
				maskClosable={false}
				destroyOnClose={true}
				title={props.title}
				visible={props.visible}
				confirmLoading={loading}
				onCancel={() => {
					props.toggleApplyVisible(false)
					props.onSuccess && props.onSuccess()
				}}
				width={900}
                style={{ top: 50,width:1000, maxWidth: '80%'}}
                bodyStyle={{minHeight:400}}
				footer={false}>
				<div className="steps-main">
					<Steps current={current} size="small">
						{steps.map((item, i) => {
							return (
								<Step
									key={item.title}
									title={item.title}
									icon={item.icon}
									onClick={() => this.handleCurrent(i)}
								/>
							)
						})}
					</Steps>
                    <Spin spinning={loading}>
                        <div>
                            {data && this.getContent(this.state.current, routes)}
                        </div>
                    </Spin>
				</div>
			</Modal>
		)
	}
}

export default withRouter(
	connect(
		state => ({
            declare:state.user.get('declare')
		}),
		dispatch => ({
			saveDeclare: saveDeclare(dispatch)
		})
	)(ApplyDeclarationPopModal)
)
