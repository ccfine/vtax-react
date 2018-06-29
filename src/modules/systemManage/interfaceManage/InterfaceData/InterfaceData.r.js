import React from 'react'
import { Card, Form, Row, Col, Button,message } from 'antd'
import { getFields,request } from 'utils'
import { connect } from 'react-redux'

class InterfaceData extends React.Component {
	state = {
        texts: [],
        submitLoading:false,
	}
	socket = null
	connect = () => {
		this.pushMessage('开始连接...')
		this.socket = new WebSocket(
			window.wsURL + 'webSocketHandler/id=' + this.props.personal.id
		)
		this.socket.onopen = () => {
			// this.pushMessage('连接成功')
		}
		this.socket.onmessage = ({ data }) => {
			this.pushMessage(data)
		}
		this.socket.onerror = e => {
			this.pushMessage('连接错误')
		}
		this.socket.onclose = e => {
			console.log('连接断开，代码：' + e.code)
		}
	}
	componentDidMount() {
		this.connect()
	}
	componentWillUnmount() {
		//断开websocket连接
		this.socket && this.socket.close && this.socket.close()
	}
	pushMessage = msg => {
		console.log(msg)
		const { texts } = this.state
		let res = [...texts, msg]
		if (texts.length > 20000) {
			res = res.slice(res.length - 15000, res.length)
		}

		this.setState({ texts: res })
    }
    toggleSubmitLoading=(submitLoading)=>{
        this.setState({submitLoading})
    }
	submit = e => {
		e && e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
                this.toggleSubmitLoading(true)
				request
					.post('/api/send/', values)
					.then(({ data }) => {
						this.toggleSubmitLoading(false)
						if (data.code === 200) {
							// this.pushMessage('操作成功，开始运行任务...')
						} else {
							message.error(`操作失败:${data.msg}`)
						}
					})
					.catch(err => {
                        message.error(`操作失败:${err.message}`)
						this.toggleSubmitLoading(false)
					})
			}
		})
	}
	render() {
		const { texts } = this.state
		return (
			<Card
				title="接口数据"
				bodyStyle={{ padding: 0 }}
				style={{ width: '100%' }}>
				<Row>
					<Col span={8}>
						<Form style={{ padding: '10px 20px' }}>
							<Row>
								{getFields(this.props.form, [
									{
										label: '任务',
										fieldName: 'task',
										type: 'checkboxGroup',
										span: 24,
										options: [
											{ label: '抽取', value: 1 },
											{ label: '分发', value: 2 }
										],
										componentProps: {
											disabled: true
										},
										fieldDecoratorOptions: {
											initialValue: [2],
											rules: [
												{
													required: true,
													message: '请选择任务'
												}
											]
										}
									}
								])}
							</Row>
							<Row>
								{getFields(this.props.form, [
									{
										label: '接口',
										fieldName: 'apiCode',
										type: 'select',
										span: 24,
										options: [
											{
												text:
													'NC财务系统-财务凭证信息接口',
												value: 'Voucher'
											}
										],
										fieldDecoratorOptions: {
											initialValue: 'Voucher',
											rules: [
												{
													required: true,
													message: '请选择接口'
												}
											]
										}
									}
								])}
							</Row>
							<Row>
								{getFields(this.props.form, getFieldValue => [
									{
										label: '纳税主体',
										fieldName: 'mainId',
										type: 'taxMain',
										span: 24,
										fieldDecoratorOptions: {
											rules: [
												{
													required: true,
													message: '请选择纳税主体'
												}
											]
										}
									}
									/*{
                                            label:'项目名称',
                                            fieldName:'projectId',
                                            type:'asyncSelect',
                                            span:24,
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
                                            span:24,
                                            componentProps:{
                                                fieldTextName:'itemName',
                                                fieldValueName:'id',
                                                doNotFetchDidMount:true,
                                                fetchAble:getFieldValue('projectId') || false,
                                                url:`/project/stages/${getFieldValue('projectId') || ''}`,
                                            }
                                        }*/
								])}
							</Row>
							<Row>
								<Col span={24}>
									<Button
										style={{
											display: 'block',
											width: '100%'
										}}
										type="primary"
										onClick={this.submit}>
										确定
									</Button>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col span={16}>
						<div
							style={{
								color: '#FFF',
								backgroundColor: '#000',
								width: '100%',
								padding: 15,
								height: 450,
								overflowY: 'auto'
							}}>
							{texts.map((ele, index) => {
								return <p key={index}>{ele}</p>
							})}
						</div>
					</Col>
				</Row>
			</Card>
		)
	}
}

export default connect(state => ({
	personal: state.user.get('personal')
}))(Form.create()(InterfaceData))
