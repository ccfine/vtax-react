/**
 * author       : liuchunxiu
 * createTime   : 2018/4/16
 * description  :
 */
import React, { Component } from 'react'
import { Card, message, Form, Row, Col, Badge,Icon } from 'antd'
import { request,getUrlParam } from 'utils'
import PermissionFeilds from "../../permissionDetail"
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class RoleManagementDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			data: [],
			permissions: [],
			roleData: [],
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
		this.fetchRoleId(this.props.match.params.id, getUrlParam('orgId'))
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
	fetchRoleId = (id,orgId)=> {
		this.toggleLoading(true)
		request
			.get(`/sysRole/queryUserByRoleId/${id}/${orgId}`)
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
        const {  location } = this.props
		const {data,permissions,roleData,loading} = this.state
        const options = data.options
		return (
			<div>
				<div style={{ margin: "0px 0 6px 6px" }}>
					<Link
						style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12}}
						to={{
                            pathname: location && location.pathname ? location.pathname.substring(0,location.pathname.lastIndexOf('/')) : '',
                            search:location.search,
                        }}
					><Icon type="left" /><span>返回</span></Link>
				</div>
				<Card loading={loading}
					title="角色信息">
					<div style={{ padding: '10px 15px', color: '#999' }}>
						<Row gutter={16}>
							<Col span={8}>
								<p>
									名称：<span style={{ color: '#333' }}>
										{location && location.state.roleName}
									</span>
								</p>
							</Col>
							<Col span={6}>
								<p>
									状态：<span
										style={{
											color:
												parseInt(location && location.state.isEnabled, 0) === 1
													? '#009E4A'
													: '#FF0000'
										}}>
										{parseInt(location && location.state.isEnabled, 0) === 1
											? '启用'
											: '停用'}
									</span>
								</p>
							</Col>
							<Col span={10}>
								<p>
									备注：<span style={{ color: '#333' }}>
										{location && location.state.remark}
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

export default withRouter(Form.create()(RoleManagementDetail))
