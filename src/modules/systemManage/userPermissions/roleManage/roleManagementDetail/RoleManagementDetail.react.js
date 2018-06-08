/**
 * author       : xiaminghua
 * createTime   : 2018/4/16
 * description  :
 */
import React, { Component } from 'react'
import { Card, message, Form, Row, Col, Badge } from 'antd'
import { request } from 'utils'
import PermissionFeilds from "../../permissionDetail"

class RoleManagementDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			data: [],
			permissions: [],
			roleData: [],
			roleName: props.location.state.roleName,
			remark: props.location.state.remark,
			isEnabled: props.location.state.isEnabled,
            modalKey: Date.now(),
		}
	}
	toggleLoading = loading => this.setState({ loading })
	fetch() {
		this.toggleLoading(true)
		request
			.get('/permissions')
			.then(({ data }) => {
				this.toggleLoading(false)
				if (data.code === 200) {
					this.setState({
						permissions: data.data
					})
				} else {
					message.error(data.msg)
				}
			})
			.catch(err => {
				message.error(err.message)
				this.toggleLoading(false)
			})

		this.fetchRole(this.props.match.params.id)
		this.fetchRoleId(this.props.match.params.id)
	}
	fetchRole = id => {
		this.toggleLoading(true)
		request
			.get(`/sysRole/find/${id}`)
			.then(({ data }) => {
				if (data.code === 200) {
					this.toggleLoading(false)
					this.setState({
						data: data.data
					})
				} else {
					message.error(data.msg)
				}
			})
			.catch(err => {
				message.error(err.message)
				this.toggleLoading(false)
			})
	}
	fetchRoleId = id => {
		this.toggleLoading(true)
		request
			.get(`/sysRole/queryUserByRoleId/${id}`)
			.then(({ data }) => {
				if (data.code === 200) {
					this.toggleLoading(false)
					this.setState({
						roleData: data.data
					})
				} else {
					message.error(data.msg)
				}
			})
			.catch(err => {
				message.error(err.message)
				this.toggleLoading(false)
			})
	}
	componentDidMount() {
		this.fetch()
	}

	render() {
		const {data,permissions,roleData,roleName,isEnabled,remark,loading} = this.state
        const options = data.options
		return (
			<div>
				<Card loading={loading}
					title="角色信息">
					<div style={{ padding: '30px', color: '#999' }}>
						<Row gutter={16}>
							<Col span={6}>
								<p>
									名称：<span style={{ color: '#333' }}>
										{roleName}
									</span>
								</p>
							</Col>
							<Col span={6}>
								<p>
									状态：<span
										style={{
											color:
												parseInt(isEnabled, 0) === 1
													? '#009E4A'
													: '#FF0000'
										}}>
										{parseInt(isEnabled, 0) === 1
											? '启用'
											: '停用'}
									</span>
								</p>
							</Col>
							<Col span={12}>
								<p>
									备注：<span style={{ color: '#333' }}>
										{remark}
									</span>
								</p>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<p>
									用户：<span>
										{roleData.map(item => (
											<Badge
												key={item.key}
												count={item.title}
												style={{
													backgroundColor: '#52c41a',
													marginRight: 10
												}}
											/>
										))}
									</span>
								</p>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<div>
									权限：
                                    <span style={{ color: "#333" }}>
                                        <Form layout="inline">
                                            <PermissionFeilds
                                                editAble={false}
                                                checkedPermission={
                                                    options && options.map(ele=>`${ele}`)
                                                }
                                                form={this.props.form}
                                                allPermission={permissions}
                                                permissionLoading={
                                                    loading
                                                }
                                            />
                                        </Form>
                                    </span>
								</div>
							</Col>
						</Row>
					</div>
				</Card>
			</div>
		)
	}
}
export default Form.create()(RoleManagementDetail)
