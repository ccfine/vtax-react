import React from 'react';
import {Modal,Layout,Tree,Form,Row,Button,Checkbox,message,Spin} from 'antd';
import {getFields,request} from 'utils';
import strategies from '../../../../../config/routingAuthority.config'
import intersection from 'lodash/intersection'
import padStart from 'lodash/padStart'
const {Content,Sider,Footer} = Layout,
      TreeNode               = Tree.TreeNode, FormItem = Form.Item;

//TODO: 如果修改了路由，这个结构就要跟着改变，否则会出问题
const treeData = [{
    title   : '基础管理',
    key     : '00',
    children: [{
        title   : '基础信息',
        key     : '0000',
        children: [{
            title: '查询',
            key  : '000000',
        },{
            title: '管理',
            key  : '000001',
        }]
    }]
},{
    title   : '增值税管理',
    key     : '01',
    children: [{
        title   : '销项管理',
        key     : '0100',
        children: [{
            title: '查询',
            key  : '010000',
        },{
            title: '管理',
            key  : '010001',
        }]
    },{
        title   : '进项管理',
        key     : '0101',
        children: [{
            title: '查询',
            key  : '010100',
        },{
            title: '管理',
            key  : '010101',
        }]
    },{
        title   : '土地价款',
        key     : '0102',
        children: [{
            title: '查询',
            key  : '010200',
        },{
            title: '管理',
            key  : '010201',
        }]
    },{
        title   : '其他台账',
        key     : '0103',
        children: [{
            title: '查询',
            key  : '010300',
        },{
            title: '管理',
            key  : '010301',
        }]
    }]
},{
    title   : '纳税申报',
    key     : '02',
    children: [{
        title   : '创建申报',
        key     : '0200',
        children: [{
            title: '查询',
            key  : '020000',
        },{
            title: '管理',
            key  : '020001',
        }]
    },{
        title   : '申报办理',
        key     : '0201',
        children: [{
            title: '查询',
            key  : '020100',
        },{
            title: '管理',
            key  : '020101',
        }]
    },{
        title   : '查询申报',
        key     : '0202',
        children: [{
            title: '查询',
            key  : '020200',
        }/*,{
            title: '管理',
            key  : '020201',
        }*/]
    }]
},{
    title   : '报表管理',
    key     : '03',
    children: [
        {
            title   : '业务报表',
            key     : '0300',
            children: [{
                title: '查询',
                key  : '030000',
            },{
                title: '管理',
                key  : '030001',
            }]
        },{
            title   : '数据源报表',
            key     : '0301',
            children: [{
                title: '查询',
                key  : '030100',
            },{
                title: '管理',
                key  : '030101',
            }]
        },{
            title   : '进度分析报表',
            key     : '0302',
            children: [{
                title: '查询',
                key  : '030200',
            },{
                title: '管理',
                key  : '030201',
            }]
        }
    ]
}]
let keys = (()=>{
    let res = [];
    treeData.forEach(ele=>{
        ele.children && ele.children.forEach(dele=>{
            dele.children && dele.children.forEach(dd=>{
                res.push(dd.key)
            })
        })
    })
    return res;
})();


let plainStrategies = (function(){
    let plainStrategies = {};
    keys.forEach(ele=>{
        plainStrategies[ele] = []
    })
    const transformStrategies=(obj,index)=>{
        if(obj.options){
            obj.options.forEach(element => {
                // 如1002结尾代表查询，否则就是操作
                if(/1002$/.test(element)){
                    plainStrategies[index+'00'].push(element)
                }else{
                    plainStrategies[index+'01'].push(element)
                }
            });
        }else{
            for(let subObj in obj){
                transformStrategies(obj[subObj],index)
            }
        }
    }
    [strategies.basisManage,strategies.vatManage,strategies.taxDeclare,strategies.reportManage].forEach((ele,index)=>{
        let dindex = 0;
        for(let dd in ele){
            transformStrategies(ele[dd],padStart(`${index}`,2,'0')+padStart(`${dindex}`,2,'0'));
            dindex++;
        }
    })

    return plainStrategies;
}())

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
        checkedKeys          : [],
        userPermissionLoading: false,
        userPermission       : [],
        submitLoading        : false,

        _orgFetch: Date.now(),
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateKey !== this.props.updateKey){
            if(nextProps.orgId){
                debugger
                this.fetchPermissionByUserId(nextProps)
                this.setState({_orgFetch:Date.now()})
            }else{
                debugger
                this.props.form.resetFields();
                this.setState({checkedKeys:[]})
            }
        }
    }
    onCheck = (checkedKeys) => {
        // 如果点击管理相应的查看权限应该被设置
        let newCheckedKeys = new Set(checkedKeys);
        checkedKeys.forEach(ele=>{
            if(/^\d{4}01$/.test(ele)){
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
                    console.log(data.data);
                    debugger
                    let checkedKeys = []
                    keys.forEach(ele=>{
                        if(intersection(data.data.userPermissions,plainStrategies[ele]).length>0){
                            checkedKeys.push(ele)
                        }
                    })
                    this.setState({
                        checkedKeys,
                        userPermission       : data.data.userPermissions,
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
            let permissionIds = [];
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
                        id     : this.props.userId,
                        //判断下【用户所属区域继承本次权限设置】是否勾选，如果勾选，组织传空
                        orgId: values.isAll?'': values.orgId,
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
        let {visible,orgId,userId}                          = this.props,
            {userPermissionLoading,submitLoading,_orgFetch} = this.state,
            {getFieldDecorator}                             = this.props.form;
        return <Modal
            title        = "用户权限设置"
            visible      = {visible}
            onCancel     = {this.handleCancel}
            footer       = {null}
            bodyStyle    = {{padding:0}}
            maskClosable = {false}
            style        = {{width:600}}
            >
            <Form>
            <Layout>
                <Sider style={{backgroundColor:'#FFF',height:420,paddingTop:20,overflowY:'auto'}} width={360}>
                    <Row>
                    {
                        getFields(this.props.form, [{
                            label        : "组织",
                            fieldName    : "orgId",
                            type         : "asyncSelect",
                            span         : 24,
                            formItemStyle: {
                                labelCol: {
                                    span: 6
                                },
                                wrapperCol: {
                                    span: 16
                                },
                                style: {display:'block'}
                            },
                            componentProps: {
                                fieldTextName     : "name",
                                fieldOtherName    : 'code',
                                fieldValueName    : "id",
                                doNotFetchDidMount: !userId,
                                fetchAble         : userId,
                                url               : `/sysOrganization/queryOrgsByUserId/${userId}?refresh=${_orgFetch}`,
                                selectOptions     : {
                                    defaultActiveFirstOption: true,
                                    showSearch              : true,
                                    optionFilterProp        : 'children',
                                },
                            },
                            fieldDecoratorOptions: {
                                initialValue: orgId,
                                onChange    : (orgId)=>{
                                    orgId && this.fetchPermissionByUserId({orgId,userId})
                                },
                                rules: [
                                    {
                                        required: true,
                                        message : "请选择组织"
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
                                    span: 24
                                }}>
                            {getFieldDecorator('isAll',{
                                valuePropName: 'checked',
                                initialValue : false,     })(<Checkbox style={{lineHeight:'1.5'}} >
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