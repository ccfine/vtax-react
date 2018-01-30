/**
 * author       : liuliyuan
 * createTime   : 2018/1/15 10:57
 * description  :
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Button,Icon,Modal,Form,Row,message} from 'antd'
import {request,getFields} from '../../utils'
const uploadArrList = [
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
    },{
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
]
class PopUploadModal extends Component{
    static propTypes={
        uploadList:PropTypes.any,
        onSuccess:PropTypes.func,
    }
    static defaultProps = {
        uploadList:uploadArrList,
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
                const formData = new FormData();
                formData.append('files', values.files[0]);
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
                request.post(`${this.props.url}/${url}`,formData,{
                    header:{
                        //使用formData传输文件的时候要设置一下请求头的Content-Type，否则服务器接收不到
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                })
                    .then(({data})=>{
                        this.toggleLoading(false)
                        if(data.code===200){
                            const {onSuccess} = this.props;
                            message.success('导入成功！');
                            this.toggleVisible(false);
                            onSuccess && onSuccess()
                        }else{
                            message.error(data.msg)
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
        const {visible,loading} = this.state;
        const fields = props.fileds || []
        return(
            <span style={props.style}>
               <Button size='small' onClick={()=>this.toggleVisible(true)}>
                   <Icon type="upload" />{props.title}
               </Button>
                <Modal title={props.title} visible={visible} confirmLoading={loading} onOk={this.handleSubmit} onCancel={()=>this.toggleVisible(false)} maskClosable={false}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,fields.concat(props.uploadList))
                            }
                        </Row>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(PopUploadModal)