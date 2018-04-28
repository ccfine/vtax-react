/**
 * author       : liuliyuan
 * createTime   : 2018/4/20
 * description  :
 */
import React,{Component} from 'react';
import {Form,Checkbox,Row,Button,Col,message,Modal,Input,Switch,Icon} from 'antd'
import {request} from 'utils'
const FormItem = Form.Item;
const dataList ={
    "code" : 200,
    "msg" : "OK",
    "data" : [ {
        "code" : "basicInfo",
        "name" : "基础管理",
        "description" : "",
        "permissions" : [ {
            "code" : "aubjectOfTaxPayment",
            "name" : "纳税主体",
            "description" : "",
            "grantedByCurrentRole" : 1
        }, {
            "code" : "taxIncentives",
            "name" : "税收优惠",
            "description" : "",
            "grantedByCurrentRole" : 1
        }, {
            "code" : "declareParameter",
            "name" : "申报参数",
            "description" : "",
            "grantedByCurrentRole" : 1
        } ,
            {
                "code" : "declareFile",
                "name" : "申报档案",
                "description" : "",
                "grantedByCurrentRole" : 1
            },
            {
                "code" : "inspectionReport",
                "name" : "稽查报告",
                "description" : "",
                "grantedByCurrentRole" : 1
            },
            {
                "code" : "filingMaterial",
                "name" : "备案资料",
                "description" : "",
                "grantedByCurrentRole" : 1
            },
            {
                "code" : "licenseManage",
                "name" : "证照管理",
                "description" : "",
                "grantedByCurrentRole" : 1
            },
            {
                "code" : "otherFiles",
                "name" : "其他档案",
                "description" : "",
                "grantedByCurrentRole" : 1
            },

        ]
    }, {
        "code" : "vatManage",
        "name" : "增值税管理",
        "description" : "",
        "permissions" : [ {
            "code" : "salesManag",
            "name" : "销项管理",
            "description" : "",
            "grantedByCurrentRole" : 1
        },{
            "code" : "entryManag",
            "name" : "进项管理",
            "description" : "",
            "grantedByCurrentRole" : 1
        },{
            "code" : "landPrice",
            "name" : "土地价款",
            "description" : "",
            "grantedByCurrentRole" : 1
        },{
            "code" : "otherAccount",
            "name" : "其他台账",
            "description" : "",
            "grantedByCurrentRole" : 1
        }
        ]
    }, {
        "code" : "taxDeclare",
        "name" : "纳税申报",
        "description" : "",
        "permissions" : [ {
            "code" : "createADeclare",
            "name" : "创建申报",
            "description" : "",
            "grantedByCurrentRole" : 0
        },{
            "code" : "searchDeclare",
            "name" : "查询申报",
            "description" : "",
            "grantedByCurrentRole" : 1
        } ]
    },
        {
            "code" : "userManage",
            "name" : "用户管理",
            "description" : "",
            "permissions" : [ {
                "code" : "lookUserInfo",
                "name" : "查看用户信息",
                "description" : "",
                "grantedByCurrentRole" : 1
            },{
                "code" : "createUser",
                "name" : "新增用户",
                "description" : "",
                "grantedByCurrentRole" : 0
            },
                {
                    "code" : "modifiUserInfo",
                    "name" : "修改用户信息",
                    "description" : "",
                    "grantedByCurrentRole" : 1
                }, ]
        },{
            "code" : "roleManage",
            "name" : "角色管理",
            "description" : "",
            "permissions" : [ {
                "code" : "lookRolePermission",
                "name" : "查看角色权限",
                "description" : "",
                "grantedByCurrentRole" : 1
            },{
                "code" : "createRole",
                "name" : "新增角色",
                "description" : "",
                "grantedByCurrentRole" : 0
            },
                {
                    "code" : "modifiRolePermission",
                    "name" : "修改角色权限",
                    "description" : "",
                    "grantedByCurrentRole" : 1
                }, ]
        },

    ]
}
class RoleModal extends Component{
    state={
        editAble:true,
        submitLoading:false,
        showEditButton:false,
        data:[],
        visible:false
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)

                /*this.setState({
                    submitLoading:true
                })
                let permissionCodes = [];
                for(let key in values){
                    if(values[key] && key !=='remark' && key !== 'roleName' && key !== 'enabled'){
                        permissionCodes.push(key)
                    }
                }
                let params = {
                    permissionCodes,
                    remark:values.remark,
                    roleName:values.roleName,
                    enabled:values.enabled ? 1 : 0
                }
                if(this.props.type==='edit'){

                    request.put(`/roles/${this.props.roleId}`,params)
                        .then(({data})=>{
                            this.setState({
                                submitLoading:false
                            })
                            if(data.code===200){
                                if(this.mounted){
                                    message.success('角色编辑成功!');
                                    this.props.setData({
                                        roleName:params.roleName,
                                        enabled:params.enabled,
                                        remark:params.remark
                                    });
                                    this.setState({
                                        visible:false
                                    })
                                    this.props.refresh()
                                }

                            }else{
                                message.error(data.msg)
                            }
                        })
                }else{
                    request.post('/roles',params)
                        .then(({data})=>{
                            this.setState({
                                submitLoading:false
                            })
                            if(data.code===200){
                                if(this.mounted){
                                    message.success('角色增加成功!');
                                    this.setState({
                                        visible:false
                                    })
                                    this.props.refresh()
                                }

                            }else{
                                message.error(data.msg)
                            }
                        })
                }*/

            }
        });
    }
    fetchList(){
        let url = '/permissions'
        if(this.props.type==='edit'){
            url = `/roles/${this.props.roleId}/permissions`
        }
        request.get(url)
            .then(({data})=>{
                if(data.code===200){
                    this.mounted && this.setState({
                        data: dataList.data //data.data ||
                    })
                }else{
                    message.error(data.msg)
                }
            })
    }
    componentDidMount(){
        this.fetchList()
    }
    onCheckAllChange = item => e => {
        const {setFieldsValue} = this.props.form;
        let newItems = [...item.permissions]
        if (e.target.checked) {
            newItems.forEach(item => {
                setFieldsValue({
                    [item.code]:true
                })
                return item;
            })
        } else {
            newItems.forEach(item => {
                setFieldsValue({
                    [item.code]:false
                })
                return item;
            })
        }
    }
    checkAllChecked= (allCode, code) => e =>{
        const data = this.state.data;
        const {setFieldsValue,getFieldValue} = this.props.form;
        setFieldsValue({
            [code]:e.target.checked
        })
        for(let i = 0 ;i<data.length;i++){
            if(data[i].code === allCode){
                let arr = [];
                data[i].permissions.forEach(item=>{
                    arr.push( getFieldValue(item.code) )
                })
                setFieldsValue({
                    [allCode]: arr.filter(item=>!item).length === 0
                })
                break;
            }
        }

    }

    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const { getFieldDecorator,resetFields} = this.props.form;
        const {data} = this.state;
        return(
            <div style={{display:'inline-block',marginLeft:15}}>
                <Button size='small'onClick={()=>{
                    resetFields();
                    this.setState({
                        visible:true
                    })
                }}><Icon type={this.props.type==='add'?'plus':'edit'}/>{this.props.buttonTxt}</Button>
                <Modal title={this.props.title} onCancel={this.handleCancel} width={800} visible={this.state.visible} confirmLoading={this.state.submitLoading} onOk={this.handleSubmit}>
                    <Form
                        layout="inline" onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={8}>
                                <FormItem>
                                    {
                                        getFieldDecorator('roleName',{
                                            initialValue:this.props.type==='edit'? this.props.data.roleName : '',
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入角色名称'
                                                },{
                                                    pattern:/^[^ ]+$/,message:'不能包含空格'
                                                }
                                            ]
                                        })(
                                            <Input placeholder="请输入角色名称" />
                                        )
                                    }
                                </FormItem>

                            </Col>
                        </Row>
                        <div style={{
                            width:'100%',
                            // backgroundColor:'#F8F8F8',
                            padding:'20px 0',
                            margin:'20px 0'
                        }}>
                            {
                                data.map((item,i)=>{
                                    return (
                                        <Row key={i}>
                                            <Col style={{
                                                textAlign:'right',
                                                lineHeight:'32px',
                                                paddingRight:15
                                            }} span={3}>
                                                {item.name}:
                                            </Col>
                                            <Col span={21}>
                                                <FormItem>
                                                    {
                                                        getFieldDecorator(item.code,{
                                                            initialValue:item.permissions.filter(item=>!item.grantedByCurrentRole).length === 0,
                                                            valuePropName: 'checked',
                                                            onChange:this.onCheckAllChange(item)
                                                        })(
                                                            <Checkbox>全选</Checkbox>
                                                        )
                                                    }

                                                </FormItem>
                                                {
                                                    item.permissions.map((fieldItem,j)=>{
                                                        return(
                                                            <FormItem key={j}>
                                                                {
                                                                    getFieldDecorator(fieldItem.code,{
                                                                        initialValue:parseInt(fieldItem.grantedByCurrentRole,0)===1,
                                                                        valuePropName: 'checked',
                                                                        onChange:this.checkAllChecked(item.code, fieldItem.code)
                                                                    })(
                                                                        <Checkbox disabled={!this.state.editAble}>{fieldItem.name}</Checkbox>
                                                                    )
                                                                }
                                                            </FormItem>
                                                        )
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            <Row>
                            <span style={{
                                display:'inline-block',
                                width:100,
                                lineHeight:'32px',
                                textAlign:'right',
                                paddingRight:15
                            }}>状态:</span>
                                {
                                    getFieldDecorator('enabled', {
                                        initialValue:this.props.type==='edit'? parseInt(this.props.data.enabled,0)===1 : true,
                                        valuePropName: 'checked' ,
                                    })(
                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                    )}
                            </Row>
                            <Row style={{marginTop:10}}>
                            <span style={{
                                display:'inline-block',
                                width:100,
                                lineHeight:'32px',
                                textAlign:'right',
                                paddingRight:15
                            }}>备注:</span>
                                <FormItem>
                                    {
                                        getFieldDecorator('remark', {
                                        })(
                                            <Input.TextArea style={{width:500}} autosize={
                                                {
                                                    minRows:3
                                                }
                                            } placeholder="请输入备注" />
                                        )}
                                </FormItem>

                            </Row>

                        </div>
                    </Form>
                </Modal>
            </div>

        )
    }
}

export default  Form.create()(RoleModal)
