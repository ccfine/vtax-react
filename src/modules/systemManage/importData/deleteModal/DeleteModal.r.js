// Created by liuliyuan on 2018/8/14
import React,{Component} from 'react'
import {Button,Icon,Modal,Form,Row,message} from 'antd'
import PropTypes from 'prop-types'
import {request,getFields, parseJsonToParams} from 'utils'
import moment from 'moment'
class DeleteModal extends Component{
    static propTypes={
        onSuccess:PropTypes.func,
        disabled:PropTypes.bool,
    }
    static defaultProps={
        title:'删除'
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
    deleteRecord=(values)=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.delete(`${this.props.url}?${parseJsonToParams(values)}` )
                    .then(({data})=>{
                        this.toggleLoading(false)
                        if(data.code===200){
                            const {onSuccess} = this.props;
                            message.success('删除成功！');
                            this.toggleVisible(false);
                            onSuccess && onSuccess()
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                    this.toggleLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoading(true);
                for(let key in values){
                    if(moment.isMoment(values[key])){
                        //格式化一下时间 YYYY-MM类型
                        if(moment(values[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                            values[key] = values[key].format('YYYY-MM');
                        }
                    }
                }
                this.deleteRecord(values)
            }
        });

    }

    render(){
        const props = this.props;
        const {visible,loading} = this.state;
        /**
         * 注意，fileds是因为早先打错字，做了个修补措施，应为fields
         * */
        const fields = props.fields ||  props.fileds || []
        return(
            <span style={props.style}>
               <Button size='small' type="danger" disabled={props.disabled} onClick={()=>this.toggleVisible(true)}>
                   <Icon type="delete" />{props.title}
               </Button>
                <Modal maskClosable={false} destroyOnClose={true} title={props.title} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,fields)
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(DeleteModal)