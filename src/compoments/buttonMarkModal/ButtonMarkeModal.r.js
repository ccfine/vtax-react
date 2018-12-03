/**
 * Created by liuliyuan on 2018/5/16.
 */
import React,{Component} from 'react'
import {Button,Modal,Form,Row,message,Icon} from 'antd';
import PropTypes from 'prop-types'
import {request,getFields} from 'utils'

class ButtonMarkeModal extends Component{
    static propTypes={
        buttonOptions:PropTypes.shape({
            text:PropTypes.string,
            icon:PropTypes.string,
        }),
        formOptions:PropTypes.shape({
            filters:PropTypes.object,
            selectedRowKeys:PropTypes.array,
            url: PropTypes.string.isRequired,
            fields:PropTypes.array.isRequired,
            disabled:PropTypes.bool,
            onSuccess:PropTypes.func,
        }).isRequired,
        modalOptions:PropTypes.shape({
            title:PropTypes.string
        })
    }
    static defaultProps={
        buttonOptions:{
            text:'标记',
            icon:'pushpin-o'
        },
        modalOptions:{
            title:'标记类型'
        },
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
        if(!visible){
            this.props.form.resetFields();
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
                const {filters,selectedRowKeys,url,onSuccess} = this.props.formOptions;
                const params = {
                    ...filters,
                    ...values,
                    ids:selectedRowKeys
                }
                request.put(url,params)
                    .then(({data})=>{
                        this.toggleLoading(false)
                        if(data.code===200){
                            message.success(`${this.props.modalOptions.title}成功!`);
                            this.toggleVisible(false);
                            onSuccess && onSuccess()
                        }else{
                            message.error(`${this.props.modalOptions.title}失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
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
                <Button size='small' disabled={formOptions.disabled} onClick={()=>{
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

                <Modal {...modalOptions}  maskClosable={false} destroyOnClose={true} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(props.form,formOptions.fields)
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}
export default Form.create()(ButtonMarkeModal)