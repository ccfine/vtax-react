/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React,{Component} from 'react'
import {Modal,Form,Row,message,Button} from 'antd'
import {request,getFields} from '../../../../../utils'
import PropTypes from 'prop-types'
class FeildModal extends Component{
    static propTypes ={
        url: PropTypes.string.isRequired,
        feilds:PropTypes.array.isRequired,
        title: PropTypes.string,
        onSuccess:PropTypes.func,
        style:PropTypes.object,
        buttonIcon:PropTypes.node
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
                if(values.authMonth){
                   values.authMonth = values.authMonth.format('YYYY-MM')
                }
                this.toggleLoading(true)
                request.post(`${this.props.url}`,values
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
                    {props.buttonIcon}{props.title}
                </Button>
                <Modal title={props.title} maskClosable={false} destroyOnClose={true} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,props.feilds)
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(FeildModal)