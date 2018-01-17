/**
 * Created by liurunbin on 2018/1/17.
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,Form,Row,message} from 'antd'
import PropTypes from 'prop-types'
import {request,getFields} from '../../../utils'
class ButtonModalWithForm extends Component{
    static propTypes={
        onSuccess:PropTypes.func,
        buttonOptions:PropTypes.shape({
            text:PropTypes.string,
            icon:PropTypes.string,
        }),
        formOptions:PropTypes.shape({
            type: PropTypes.oneOf(['post','put']).isRequired,
            url: PropTypes.string.isRequired,
            fields:PropTypes.array.isRequired,
            onSuccess:PropTypes.func
        }).isRequired,
    }
    static defaultProps={
        buttonOptions:{
            text:'button',
            icon:'upload'
        },
        modalOptions:{
            title:'标题'
        }
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
        const {type,url,onSuccess} = this.props.formOptions;
        const {text} = this.props.buttonOptions;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoading(true);
                const formData = new FormData();

                if(values.files){
                    values.files = values.files[0];
                }

                for(let key in values){
                    formData.append(key, values[key])
                }

                request[type](url,formData,{
                    header:{
                        //使用formData传输文件的时候要设置一下请求头的Content-Type，否则服务器接收不到
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                })
                    .then(({data})=>{
                        this.toggleLoading(false)
                        if(data.code===200){
                            message.success(`${text}成功!`);
                            this.toggleVisible(false);
                            onSuccess && onSuccess()
                        }else{
                            message.error(`${text}失败:${data.msg}`)
                        }
                    })
                    .catch(err=>{
                        this.toggleLoading(false)
                    })
            }
        });

    }
    render(){
        const props = this.props;
        const {buttonOptions,modalOptions,formOptions} = props;
        const {visible,loading} = this.state;
        return(
            <span style={props.style}>
               <Button size='small' onClick={()=>{
                   this.toggleVisible(true);
                   buttonOptions.onClick && buttonOptions.onClick()
               }}>
                   {
                       buttonOptions.icon && <Icon type={buttonOptions.icon} />
                   }
                   {
                       buttonOptions.text
                   }
               </Button>
                <Modal {...modalOptions} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,formOptions.fields)
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(ButtonModalWithForm)