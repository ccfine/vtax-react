/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React,{Component} from 'react'
import {Modal,Form,Row,message,Button,Icon} from 'antd'
import {request,getFields} from '../../../../../utils'
const undoUploadArrList = [{
        label:'认证月份',
        fieldName:'authMonth',
        type:'monthPicker',
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
                    message:'请选择认证月份'
                }
            ]
        },
    }
]
class SubmitModal extends Component{
    static defaultProps={
        undoUpload:undoUploadArrList
    }
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
                request.post(`${this.props.url}/${''}`,
                        )
                            .then(({data}) => {
                                this.toggleLoading(false)
                                if (data.code === 200) {
                                    const {onSuccess} = this.props;
                                    message.success('提交成功', 4)
                                    this.toggleVisible(false);
                                    onSuccess && onSuccess()
                                } else {
                                    message.error(data.msg, 4)
                                }
                            })
                            .catch(err => {
                                message.error(err.message)
                                this.toggleVisible(false)

                            })
            }
        })
    }
    render(){
        const props = this.props;
        const {visible,loading} = this.state;
        return(
            <span style={props.style}>
                <Button size='small' onClick={()=>this.toggleVisible(true)}>
                <Icon type="check" />
                    {props.title}
                </Button>
                <Modal title={props.title} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,props.undoUpload)
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(SubmitModal)