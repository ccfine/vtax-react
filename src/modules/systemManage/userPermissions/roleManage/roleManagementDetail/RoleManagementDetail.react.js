/**
 * author       : xiaminghua
 * createTime   : 2018/4/16
 * description  :
 */
import React, { Component } from 'react'
import {Card,message,Form,Button,Icon,Modal,Row,Col} from 'antd'
import RolePopModal from '../popModal'
import {getFields,request} from 'utils'

const Mock ={
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
      "name" : "添加角色",
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

class RoleManagementDetail extends Component{
    constructor(props){
    super(props)
    this.state={
      editAble:false,
      submitLoading:false,
      showEditButton:false,
      data:[],
      roleName:props.location.state.roleName,
      remark:props.location.state.remark,
      enabled:props.location.state.enabled,
      modalKey:Date.now(),
    }
    }

    setData = data=>{
    this.setData({data})
    }

    handleSubmit = (e) => {
      e && e.preventDefault();
      this.props.form.validateFields((err, values) => {
          if (!err) {
              this.setState({
                  submitLoading:true
              })
              console.log('Received values of form: ', values);
              setTimeout(()=>{
                  const data = {
                      code:210,
                      msg:'错误'
                  }
                  this.setState({
                      submitLoading:false
                  })
                  if(data.code===200){
                  }else{
                      message.error(data.msg)
                  }

              },3000)
          }
      });
    }


    fetch(){
      request.get(`/roles/${this.props.match.params.roleId}/permissions`)
          .then(({data})=>{
              if(data.code===200){
                  this.setState({
                      data:data.data.length>0 || Mock.data, //模拟数据
                  })
              }else{
                  message.error(data.msg)
              }
          })
    }

    deleteRole = roleId=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '确定要删除该角色吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{

                modalRef && modalRef.destroy();
                //删除角色
                request.delete(`/roles/${roleId}`)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('删除成功');
                            this.props.history.goBack();
                        }else{
                            message.error(data.msg);
                        }
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }

    componentDidMount(){
        this.fetch()
    }

    formatOptions=(data)=>{
      return data.map((item)=>{
        return ({'label':item.name,'value':item.code})
      })
    }

    isChecked=(data)=>{
      const arr = [];
      data.forEach((item) => {
            if(parseInt(item.grantedByCurrentRole,0)===1){
              arr.push(item.code)
            }
      });
      return arr;
    }

    render(){
      const { data,modalKey,roleName,enabled,remark } = this.state;
      const roleId = this.props.match.params.roleId;

        return (
          <div>
              <h2 style={{marginBottom:15}}>{roleName}</h2>
              <Card extra={
                  <div style={{textAlign:'right'}}>
                      <Button
                       type='danger'
                       style={{marginRight:"5px"}}
                       onClick={()=>this.deleteRole(roleId)}>
                       <Icon type="delete" />
                       删除
                     </Button>

                     <RolePopModal data={{roleName,enabled,remark}}
                                 key={modalKey}
                                 setData={this.setData}
                                 refresh={
                                     ()=>{
                                         this.fetch();
                                         this.setState({
                                             modalKey:Date.now()
                                         })
                                     }
                                 }
                                 type="edit" roleId={roleId} buttonTxt="编辑"
                                 title="编辑角色"
                              />
                  </div>
                }
              title="角色信息">
                  <Form
                      style={{
                          width:'100%',
                          padding:'20px 0',
                      }}
                      onSubmit={this.handleSubmit}>
                      {
                          data.map((item,i)=>{
                              return (
                                  <Row key={i}>
                                   {
                                     getFields(this.props.form,
                                         [{
                                             label:item.name,
                                             fieldName:item.code,
                                             type:'checkboxGroup',
                                             span:24,
                                             formItemStyle:{
                                                 labelCol:{
                                                     span:3
                                                 },
                                                 wrapperCol:{
                                                     span:21
                                                 },
                                                 className:'vTax-CheckboxGroup',
                                             },
                                             options:this.formatOptions(item.permissions) ,
                                             componentProps:{
                                                 disabled:true
                                             },
                                             fieldDecoratorOptions:{
                                                 initialValue:this.isChecked(item.permissions)
                                             }
                                         }]

                                     )
                                   }

                                  </Row>
                              )
                          })
                      }
                      <Row style={{marginTop:10}}>
                          <Col span={3} style={{textAlign:'right'}}>
                          <span style={{
                              display:'inline-block',
                              width:100,
                              textAlign:'right',
                              paddingRight:15
                          }}>状态:</span>
                          </Col>
                          <Col span={21}>
                              {
                                  parseInt(enabled,0) ===1 ? <span style={{color:'#008000'}}>启用</span>:<span style={{color:'#FF0000'}}>停用</span>
                              }
                          </Col>
                      </Row>
                      <Row style={{marginTop:10}}>
                          <Col span={3} style={{textAlign:'right'}}>
                          <span style={{
                              display:'inline-block',
                              width:100,
                              textAlign:'right',
                              paddingRight:15
                          }}>备注:</span>
                          </Col>
                          <Col span={21}>
                              {
                                  remark
                              }
                          </Col>
                      </Row>
                  </Form>
              </Card>
          </div>
        )
    }
}
export default Form.create()(RoleManagementDetail)
