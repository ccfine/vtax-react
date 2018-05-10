/**
 * author       : xiaminghua
 * createTime   : 2018/4/16
 * description  :
 */
import React, { Component } from 'react'
import {Card,message,Form,Button,Icon,Modal,Row,Col,Badge} from 'antd'
import {getFields,request} from 'utils'

class RoleManagementDetail extends Component{
    constructor(props){
    super(props)
    this.state= {
            loading: true,
            data: [],
            permissions: [],
            roleData:[],
            roleName: props.location.state.roleName,
            remark: props.location.state.remark,
            isEnabled: props.location.state.isEnabled,
            modalKey: Date.now(),
        }
    }
    toggleLoading = loading => this.setState({loading})
    fetch(){
        this.toggleLoading(true)
        request.get('/permissions')
            .then(({data})=>{
                this.toggleLoading(false)
                if(data.code===200){
                    this.setState({
                        permissions: data.data
                    })
                }else{
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
    fetchRole = (id) =>{
        this.toggleLoading(true)
        request.get(`/sysRole/find/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    this.toggleLoading(false)
                    this.setState({
                        data:data.data
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoading(false)
            })
    }
    fetchRoleId=(id)=>{
        this.toggleLoading(true)
        request.get(`/sysRole/queryUserByRoleId/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    this.toggleLoading(false)
                    this.setState({
                        roleData:data.data
                    })
                }else{
                    message.error(data.msg)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoading(false)
            })
    }

    deleteRole = id=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{

                modalRef && modalRef.destroy();
                //删除角色
                request.delete(`/sysRole/delete/${id}`)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('删除成功');
                            this.props.history.goBack();
                        }else{
                            message.error(data.msg);
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
    formatOptions=(data)=>{
        return data.map((item)=>{
            return ({'label':item.actionName,'value':item.permissionId})
        })
    }
    isChecked=(data,options)=>{
        const arr = [];
        data.forEach((d) => {
            /**
             * TODO: 报错 Missing radix parameter  radix  解决办法是把parseInt 转成 Number
             */
            if(options && options.indexOf(Number(d.permissionId)) !== -1){
                arr.push(d.permissionId)
            }
        });
        return arr;
    }
    componentDidMount(){
        this.fetch()
    }

    render(){
      const { data,permissions,roleData,roleName,isEnabled,remark,loading } = this.state;
      const id = this.props.match.params.id;
      const options = data.options;
        return (
          <div>
              <Card extra={
                  <div style={{textAlign:'right'}}>
                      <Button
                       type='danger'
                       size='small'
                       style={{marginRight:"5px"}}
                       onClick={()=>this.deleteRole(id)}>
                       <Icon type="delete" />
                       删除
                     </Button>
                  </div>
                }
              loading={loading}
              title="角色信息">
                  <Form
                      style={{
                          width:'100%',
                          padding:'20px 0',
                      }}
                      onSubmit={this.handleSubmit}>
                      <Row style={{marginTop:10}}>
                          <Col span={3} style={{textAlign:'right'}}>
                          <span style={{
                              display:'inline-block',
                              width:100,
                              textAlign:'right',
                              paddingRight:15,
                          }}>角色名称:</span>
                          </Col>
                          <Col span={21}>
                              {roleName}
                          </Col>
                      </Row>
                      {
                          permissions && permissions.map((item,i)=>{
                              return (
                                  <Row key={i}>
                                   {
                                     getFields(this.props.form,
                                         [{
                                             label:item.moduleName,
                                             fieldName:`allCode${i}`,
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
                                             options:this.formatOptions(item.permissionVOs) ,
                                             componentProps:{
                                                 disabled:true
                                             },
                                             fieldDecoratorOptions:{
                                                 initialValue:this.isChecked(item.permissionVOs,options)
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
                              }}>用户:</span>
                          </Col>
                          <Col span={21}>
                              {
                                  roleData.map(item=><Badge key={item.key} count={item.title} style={{ backgroundColor: '#52c41a',marginRight:10 }} />)
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
                          }}>状态:</span>
                          </Col>
                          <Col span={21}>
                              {
                                  parseInt(isEnabled,0) ===1 ? <span style={{color:'#008000'}}>启用</span>:<span style={{color:'#FF0000'}}>停用</span>
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
