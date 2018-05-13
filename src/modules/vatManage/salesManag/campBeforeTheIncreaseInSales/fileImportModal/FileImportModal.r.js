/**
 * Created by liurunbin on 2018/1/5.
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,Form,Row,message} from 'antd'
import {request,getFields} from 'utils'
class FileImportModal extends Component{
    state={
        visible:false,
        loading:false,
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    toggleVisible = visible =>{
        if(visible){
            this.props.form.resetFields()
        }
        this.setState({
            visible
        })
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoading(true)
                const formData = new FormData();
                formData.append('files', values.files[0])

                request.post(`/output/invoice/collection/upload/${values.mainId}`,formData,{
                    header:{
                        //使用formData传输文件的时候要设置一下请求头的Content-Type，否则服务器接收不到
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                })
                    .then(({data})=>{
                        this.toggleLoading(false)
                        if(data.code===200){
                            message.success('导入成功！');
                            this.toggleVisible(false);
                        }else{
                            message.error(data.msg)
                        }
                    })
                    .catch(err=>{
                        message.error(err.message)
                        this.toggleLoading(false)
                    })
            }
        });

    }
    render(){
        const props = this.props;
        const {visible,loading} = this.state;
        return(
            <span style={props.style}>
               <Button size='small' onClick={()=>this.toggleVisible(true)}>
                   <Icon type="upload" />导入
               </Button>
                <Modal title="导入" maskClosable={false} destroyOnClose={true} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:6
                                            },
                                            wrapperCol:{
                                                span:11
                                            }
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'文件',
                                        fieldName:'files',
                                        type:'fileUpload',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:6
                                            },
                                            wrapperCol:{
                                                span:17
                                            }
                                        },
                                        componentProps:{
                                            buttonText:'点击上传',
                                            accept:'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            explain:'文件格式为.XLS,并且不超过5M',
                                            //size:2
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请上传文件'
                                                }
                                            ]
                                        },
                                    }
                                ])
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(FileImportModal)