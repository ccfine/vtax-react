/**
 * Created by liuliyuan on 2018/4/17.
 */
import React,{Component} from 'react';
import {Modal,Form,message,Row} from 'antd';
import {request,getFields} from 'utils'

class UpdateAccount extends Component{

    state = {
        assignmentModalKey:Date.now(),
        confirmLoading:false,
        confirmDirty: false,
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['renewPassword'], { force: true });
        }
        callback();
    }
    handleOk = (e) => {
        this.props.changeVisable(false)
        //this.handleSubmit()
    }
    handleCancel = (e) => {
        this.props.changeVisable(false)

    }
    toggleConfirmLoading(){
        this.setState((prevState)=>{
            return{
                confirmLoading:!prevState.confirmLoading
            }
        })
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {

                this.toggleConfirmLoading()

                request.put(`/users/${this.props.userId}/passwords`,{
                    ...values
                })
                    .then(({data})=>{
                        this.toggleConfirmLoading()
                        if(data.code===200){
                            message.success('密码修改成功');
                            this.handleOk()
                            //this.handleCancel();
                        }else{
                            message.error(data.msg)
                        }
                    })

            }
        });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }
    render(){
      const formItemStyle={
          labelCol:{
            offset:1,
              span:6
          },
          wrapperCol:{
              span:12
          }
      }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title='修改密码'
                key={this.state.updateAccountModalKey}
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                cancelText='关闭'
                confirmLoading={this.state.confirmLoading}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                    {
                        getFields(this.props.form, [
                            {
                                label:'新密码',
                                fieldName:'newPassword',
                                type:'input',
                                span:24,
                                formItemStyle,
                                componentProps:{
                                    type:'password',
                                    onBlur:()=>this.handleConfirmBlur
                                },
                                fieldDecoratorOptions:{
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入新密码'
                                        },{
                                            min:6,message:'请输入6位或以上位数的密码'
                                        }, {
                                            validator: this.checkConfirm,
                                        }
                                    ]
                                },
                            },{
                                label:'确认密码',
                                fieldName:'renewPassword',
                                type:'input',
                                span:24,
                                formItemStyle,
                                componentProps:{
                                    type:'password',
                                },
                                fieldDecoratorOptions:{
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入新密码'
                                        }, {
                                            validator: this.checkPassword,
                                        }
                                    ]
                                },
                            }
                        ])
                    }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(UpdateAccount);