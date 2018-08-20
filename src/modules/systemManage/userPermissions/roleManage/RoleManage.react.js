/**
 * author       : liuliyuan
 * createTime   : 2018/04/16
 * description  :
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Modal,message,Divider} from 'antd'
import {SearchTable} from 'compoments'
import {RolePopModal,UserPopModal,PermissionPopModal} from './popModal'
import {request,composeBotton} from 'utils'
const searchFields = (context,params) => [
    {
        label: "组织",
        fieldName: "org",
        type: "asyncSelect",
        span: 8,
        componentProps: {
            fieldTextName: "name",
            fieldValueName: "id",
            url: `/sysOrganization/getOrganizations`,
            selectOptions:{
                labelInValue:true,
                showSearch:true,
                optionFilterProp:'children',
            },
        },
        fieldDecoratorOptions: {
            initialValue: (params && params.orgId) ? {key: params.orgId,label: ''} : (context.props.org && {key: context.props.org.orgId,label: context.props.org.orgName}),
            rules: [
                {
                    required: true,
                    message: "请选择组织"
                }
            ]
        }
    },{
        label: "角色名称",
        type: "input",
        span: 8,
        fieldName: "roleName",
        fieldDecoratorOptions: {
            initialValue: (params && params.roleName) ? params.roleName : undefined,
        }
    }
];

const columns = context => [
    {
        title: '操作',
        dataIndex:'action',
        className:'text-center',
        render:(text,record)=>(
            <span>
                {
                    composeBotton([{
                        type: 'action',
                        icon: 'edit',
                        title: '编辑',
                        onSuccess: () => { context.showModal('edit',record) }
                    },{
                        type:'action',
                        icon:'delete',
                        title:'删除',
                        style:{
                            cursor:'pointer',
                            color:'red',
                            marginRight:10
                        },
                        onSuccess:()=>{ context.deleteRole(record.id,record.isEnabled) }
                    }])
                }
                <Divider type="vertical" />
                {
                    composeBotton([{
                        type: 'action',
                        icon: 'team',
                        title: '分配权限',
                        onSuccess: () => {
                            context.setState({
                                permissionId:record.id,
                                userId:undefined,
                            },()=>{
                                context.togglePermissionModalVisible(true)
                            })
                        }
                    },{
                        type: 'action',
                        icon: 'setting',
                        title: '分配用户',
                        onSuccess: () => {
                            context.setState({
                                userId:record.id,
                            },()=>{
                                context.toggleUserModalVisible(true)
                            })
                        }
                    }])
                }
                <Divider type="vertical" />
                {
                    composeBotton([{
                        type:'switch',
                        checked: parseInt(record.isEnabled,0) === 1,
                        onSuccess:(checked)=>{
                            context.handleChange(checked,record.id)
                        }
                    }])
                }
            </span>

        ),
        width: 200,
    },{
        title: '角色名称',
        dataIndex:'roleName',
        render:(text,record)=>(
        <Link
            title="查看详情"
            to={{
                pathname: `/web/systemManage/userPermissions/roleManage/${record.id}`,
                //search:parseJsonToParams(context.state.searchValues),
                state:{
                    roleName:record.roleName,
                    isEnabled:record.isEnabled,
                    remark:record.remark,
                    params:{ ...context.state.searchValues, }
                }
            }}
        >
            {text}
        </Link>
            /*<Link title="查看详情" to={{
                pathname:`/web/systemManage/userPermissions/roleManage/${record.id}`,
                state:{
                    roleName:record.roleName,
                    isEnabled:record.isEnabled,
                    remark:record.remark
                }
            }} style={{marginRight:10}}>{text}</Link>*/
        ),
        width:'16%',
    },{
        title: '创建时间',
        dataIndex:'createdDate',
        width:120,
    },{
        title:'备注',
        dataIndex:'remark',
    }];


class RoleManage extends Component{
    constructor(props){
        super(props)
        this.state = {
            updateKey: Date.now(),
            selectedRowKeys: null,
            selectedRows: null,
            visible: false,
            userVisible: false,
            permissionVisible: false,
            permissionId:undefined,
            userId:undefined,
            searchValues:undefined,
            modalConfig: {
                type: ''
            },
            filters:{},
            params:{...props.location.state},
        }
    }

    toggleModalVisible=visible=>{
        this.mounted && this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        })
    }
    showModal=(type,record)=>{
        this.toggleModalVisible(true)
        this.mounted && this.setState({
            modalConfig:{
                type,
                id:record.id,
                record
            }
        })
    }
    toggleUserModalVisible=userVisible=>{
        this.mounted && this.setState({
            userVisible,
        })
    }
    togglePermissionModalVisible=permissionVisible=>{
        this.mounted && this.setState({
            permissionVisible,
        })
    }
	deleteRole = (id,isEnabled) => {
        if(parseInt(isEnabled, 0) === 1){
            message.error('请禁用后，再删除');
            return;
        }
		const modalRef = Modal.confirm({
			title: '友情提醒',
			content: '该删除后将不可恢复，是否删除？',
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk: () => {
				modalRef && modalRef.destroy()
				//删除角色
				request
					.delete(`/sysRole/delete/${id}`)
					.then(({ data }) => {
						if (data.code === 200) {
							message.success('删除成功')
                            this.refreshTable();
						} else {
							message.error(data.msg)
						}
					})
					.catch(err => {
						message.error(err.message)
					})
			},
			onCancel() {
				modalRef.destroy()
			}
		})
	}

    //选中多少条数据 - 禁用
    handleChange = (checked,id) => {
        /*const param = {
         isEnabled:checked === true ? '1' : '2',
         }*/
        const t = checked === true ? '启用' : '禁用'
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: `是否${t}？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`/sysRole/enableOrDisable/${id}`)
                    .then(({data}) => {
                        if (data.code === 200) {
                            message.success(`${t}成功！`, 4)
                            //新增成功，关闭当前窗口,刷新父级组件
                            this.refreshTable();
                        } else {
                            message.error(data.msg, 4)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {updateKey,visible,userVisible,permissionVisible,modalConfig,permissionId,userId,filters,params} = this.state;
        return (
            (this.props.org && this.props.org.orgId) ? <div className="oneLine"><SearchTable
                searchOption={{
                    fields:searchFields(this, params),
                    onResetFields:()=>{
                        this.setState({
                            params: {}
                        })
                    },
                }}
                backCondition={values => {
                    this.setState({
                        searchValues: values
                    });
                }}
                doNotFetchDidMount={false}
                tableOption={{
                    rowKey:'id',
                    key: updateKey,
                    pageSize: 100,
                    columns: columns(this),
                    onSuccess:filters=>{
                        this.setState({filters})
                    },
                    url: '/sysRole/list',
                    scroll:{x:1000,y:window.screen.availHeight-350},
                    cardProps: {
                        title: '角色管理',
                        extra:
                            <div>
                                {
                                    composeBotton([{
                                        type:'add',
                                        icon:'plus',
                                        onClick:()=>this.showModal('add',{})
                                    }])
                                }
                            </div>,
                    },
                }}
            >
                <RolePopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    id={modalConfig.id}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
                 <PermissionPopModal
                        visible={permissionVisible}
                        id={permissionId}
                        refreshTable={this.refreshTable}
                        togglePermissionModalVisible={this.togglePermissionModalVisible}
                 />
                 <UserPopModal
                        visible={userVisible}
                        orgId={filters.orgId}
                        id={userId}
                        refreshTable={this.refreshTable}
                        toggleUserModalVisible={this.toggleUserModalVisible}
                 />

            </SearchTable></div>:'loading'

        )
    }
}
export default withRouter(connect(state=>({
    org: state.user.get("org")
}))(RoleManage))