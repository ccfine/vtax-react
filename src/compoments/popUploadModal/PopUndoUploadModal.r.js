/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Modal,Form,Row,message,Button,Icon} from 'antd'
import {request,getFields} from '../../utils'
const confirm = Modal.confirm;
const undoUploadArrList = [
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
    },{
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
class PopUndoUploadModal extends Component{
    static propTypes={
        undoUpload:PropTypes.any,
        onSuccess:PropTypes.func
    }
    static defaultProps = {
        undoUpload:undoUploadArrList,
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
                let url = '';
                if(values.mainId){
                    url = `${values.mainId}`;
                }
                if(values.authMonth){
                    url = `${values.authMonth && values.authMonth.format('YYYY-MM')}`;
                }
                if(values.mainId && values.authMonth ){
                    url = `${values.mainId}/${values.authMonth && values.authMonth.format('YYYY-MM')}`;
                }
                confirm({
                    title: '友情提醒',
                    content: '该撤销后将不可恢复，是否撤销？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {

                        request.post(`${this.props.url}/${url}`,
                        )
                            .then(({data}) => {
                                this.toggleLoading(false)
                                if (data.code === 200) {
                                    const {onSuccess} = this.props;
                                    message.success('撤销成功！', 4)
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
        })
    }
    render(){
        const props = this.props;
        const {visible,loading} = this.state;
        return(
            <span style={props.style}>
                <Button size='small' onClick={()=>this.toggleVisible(true)}>
                  <Icon type="file-add" />
                    {props.title}
                </Button>
                <Modal title={props.title} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)} maskClosable={false}>
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

export default Form.create()(PopUndoUploadModal)