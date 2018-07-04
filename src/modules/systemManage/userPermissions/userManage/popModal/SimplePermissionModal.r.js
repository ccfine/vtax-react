import React from 'react';
import {Modal,Layout,Tree,Form,Row,Button,Checkbox,message,Spin} from 'antd';
import {getFields,request} from 'utils';
import strategies from '../../../../../config/routingAuthority.config'
import intersection from 'lodash/intersection'
const {Content,Sider,Footer} = Layout,
    TreeNode = Tree.TreeNode,FormItem=Form.Item;
let keys = ['00','01','10','11','20','21','30','31'];
let plainStrategies ={};
(function(){
    keys.forEach(ele=>{
        plainStrategies[ele]=[]
    })
    const transformStrategies=(obj,index)=>{
        if(obj.options){
            obj.options.forEach(element => {
                // 如1002结尾代表查询，否则就是操作
                if(/1002$/.test(element)){
                    plainStrategies[index+'0'].push(element)
                }else{
                    plainStrategies[index+'1'].push(element)
                }
            });
        }else{
            for(let subObj in obj){
                transformStrategies(obj[subObj],index)
            }
        }
    }
    [strategies.basisManage,strategies.vatManage,strategies.taxDeclare,strategies.reportManage].forEach((ele,index)=>{
        transformStrategies(ele,index);
    })
}())

const treeData = [{
    title: '基础管理',
    key: '0',
    children: [{
        title: '查询',
        key: '00',
    },{
        title: '管理',
        key: '01',
    }]
},{
    title: '增值税管理',
    key: '1',
    children: [{
        title: '查询',
        key: '10',
    },{
        title: '管理',
        key: '11',
    }]
},{
    title: '纳税申报',
    key: '2',
    children: [{
        title: '查询',
        key: '20',
    },{
        title: '管理',
        key: '21',
    }]
},{
    title: '报表管理',
    key: '3',
    children: [{
        title: '查询',
        key: '30',
    },{
        title: '管理',
        key: '31',
    }]
}]

const renderNode = (list)=>{
    return list.map(item=>{
        if(item.children){
            return <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderNode(item.children)}
          </TreeNode>
        }else{
            return <TreeNode {...item} />;
        }
    })
}

class SimPlePermissionModal extends React.Component{
    state={
        checkedKeys:[],
        userPermissionLoading:false,
        userPermission:[],
        submitLoading:false,
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateKey !== this.props.updateKey){
            if(nextProps.orgId){
                this.fetchPermissionByUserId(nextProps)
            }else{
                this.props.form.resetFields();
                this.setState({checkedKeys:[]})
            }
        }
    }
    onCheck = (checkedKeys) => {
        // 如果点击管理相应的查看权限应该被设置
        let newCheckedKeys = new Set(checkedKeys);
        checkedKeys.forEach(ele=>{
            if(/^\d1$/.test(ele)){
                newCheckedKeys.add(ele.replace(/\d$/,'0'))
            }
        })
        
        this.setState({ checkedKeys:[...newCheckedKeys] });
    }
    checkAll = ()=>{
        this.setState({ checkedKeys:[...keys] });
    }
    fetchPermissionByUserId=({orgId,userId})=>{
        this.props.form.resetFields();
        this.setState({userPermissionLoading: true});
        request
            .get(`/sysUser/queryUserPermissions/${orgId}/${userId}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    let checkedKeys=[]
                    keys.forEach(ele=>{
                        if(intersection(data.data.userPermissions,plainStrategies[ele]).length>0){
                            checkedKeys.push(ele)
                        }
                    })
                    this.setState({
                        checkedKeys,
                        userPermission:data.data.userPermissions,
                        userPermissionLoading: false
                    });
                } else {
                    message.error(data.msg);
                    this.setState({userPermissionLoading: false});
                }
            })
            .catch(err => {
                message.error(err.message);
                this.setState({userPermissionLoading: false});
            });
    }
    handleCancel=()=>{
        // 关闭之前清楚下数据
        this.props.form.resetFields();
        this.setState({checkedKeys:[]})
        this.props.toggleModalVisible(false)
    }
    handleOk =(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            // 组织权限数据;如果对应的用户权限存在，变取当前用户权限中；如果不对应的用户权限一条也不存在，则取全部
            let permissionIds =[];
            this.state.checkedKeys.forEach(ele=>{
                let allStrategies = plainStrategies[ele];
                // 忽略掉一级选项
                if(allStrategies){
                    let interPermission = intersection(allStrategies,this.state.userPermission);
                    if(interPermission.length>0){
                        permissionIds.push(...interPermission)
                    }else{
                        permissionIds.push(...allStrategies)
                    }
                }
            })
            
            this.setState({ submitLoading: true });
                request
                    .post(`/sysUser/assignPermission`, {
                        options: permissionIds,
                        id: this.props.userId,
                        //判断下【用户所属区域继承本次权限设置】是否勾选，如果勾选，组织传空
                        orgId: values.isAll?'':values.orgId,
                    },{timeout:120000})
                    .then(({ data }) => {
                        if (data.code === 200) {
                            message.success("权限配置成功");
                            this.handleCancel();
                        } else {
                            message.error(data.msg);
                        }
                        this.setState({ submitLoading: false });
                    })
                    .catch(err => {
                        message.error(err.message);
                        this.setState({ submitLoading: false });
                    });
          }
        });
    }
    switchSenior=()=>{
        this.props.togglePermissionModalVisible(true)
    }
    render(){
        let {visible,orgId,userId} = this.props,
            {userPermissionLoading,submitLoading} = this.state,
            {getFieldDecorator} = this.props.form;
        return <Modal
            title="用户权限设置"
            visible={visible}
            onCancel={this.handleCancel}
            footer={null}
            bodyStyle={{padding:0}}
            maskClosable={false}
            >
            <Form>
            <Layout>
                <Sider style={{backgroundColor:'#FFF',height:380,paddingTop:20,overflowY:'auto'}} width={360}>
                    <Row>
                    {
                        getFields(this.props.form, [{
                            label: "组织",
                            fieldName: "orgId",
                            type: "asyncSelect",
                            span: 24,
                            formItemStyle: {
                                labelCol: {
                                    span: 6
                                },
                                wrapperCol: {
                                    span: 16
                                },
                                style:{display:'block'}
                            },
                            componentProps: {
                                fieldTextName: "name",
                                fieldValueName: "id",
                                doNotFetchDidMount:!userId,
                                fetchAble:userId,
                                url: `/sysOrganization/queryOrgsByUserId/${userId}`,
                            },
                            fieldDecoratorOptions: {
                                initialValue: orgId,
                                onChange:(orgId)=>{
                                    orgId && this.fetchPermissionByUserId({orgId,userId})
                                },
                                rules: [
                                    {
                                        required: true,
                                        message: "请选择组织"
                                    }
                                ]
                            }
                        }])
                    }
                    </Row>
                    <div style={{marginLeft:50}}>
                        <Spin spinning={userPermissionLoading}>
                        <Tree checkable={true} checkedKeys={this.state.checkedKeys} onCheck={this.onCheck}>
                            {
                                renderNode(treeData)
                            }
                        </Tree>
                        </Spin>
                    </div>
                </Sider>
                <Layout style={{backgroundColor:'#FFF',borderLeft:'1px solid #DDD'}}>
                    <Content style={{padding:25}}>
                        <Button onClick={this.checkAll} size='small' type='primary' style={{width:'100%'}}>全选</Button>
                        <Button onClick={this.switchSenior} size='small' type='default' style={{width:'100%',marginTop:10}}>高级</Button>
                    </Content>
                    <Footer style={{backgroundColor:'#FFF',paddingBottom:25}}>
                        <FormItem
                                wrapperCol={{
                                    span:24
                                }}>
                            {getFieldDecorator('isAll',{
                                valuePropName: 'checked',
                                initialValue: false,})(<Checkbox style={{lineHeight:'1.5'}} >
                                用户所属区域继承本次权限设置
                            </Checkbox>)}
                        </FormItem>
                        <Button onClick={this.handleOk} loading={submitLoading} size='small' type='primary' style={{width:'100%'}}>确定</Button>
                        <Button onClick={this.handleCancel} size='small' type='default' style={{width:'100%',marginTop:10}}>取消</Button>
                    </Footer>
                </Layout>
                </Layout>
                </Form>
            </Modal>
    }
}

export default Form.create()(SimPlePermissionModal);