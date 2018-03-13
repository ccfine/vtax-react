import React,{Component} from 'react'
import {Modal,Form,Input,Col,Button,message,Spin,Row} from 'antd'
import {getFields,request} from '../../../../../../../utils'
import moment from 'moment';
import { ButtonWithFileUploadModal } from '../../../../../../../compoments'
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
  };
const setComItem=(initialValue,readonly=false,required=true,message)=>({
    span:'8',
    type:'input',
    formItemStyle:formItemLayout,
    fieldDecoratorOptions:{
        initialValue,
        rules:[
        {
            required:required,
            message:message
        }
        ]
    },
    componentProps:{
        disabled:readonly
    }
});
class PopModal extends Component{
    state={
        loading:false,
        formLoading:false,
        record:{},
        submited:false
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible){
            if(props.id){
                this.setState({formLoading:true});
                request.get(`/project/approval/find/${props.id}`).then(({data}) => {
                    if (data.code === 200) {
                        this.setState({formLoading:false,record:data.data,submited:false});
                    }
                });
            }else{
                this.setState({formLoading:false,record:{}});
                this.props.form.resetFields();
            }
        }
    }
    hideModal(){
        this.props.hideModal();
        // 回归初始状态
        this.props.form.resetFields();
        this.setState({record:{},submited:false});
    }
    handleOk(){
        if((this.props.action!=='modify' && this.props.action!=='add') || this.state.formLoading){
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                values.validityDate = values.validityDate.format('YYYY-MM-DD');
                values.approvalDate = values.approvalDate.format('YYYY-MM-DD');
                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/project/approval/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.projectId = this.props.projectid;
                    result = request.post('/project/approval/add', obj);
                    sucessMsg='新增成功，点击【附件信息】进行文件上传';
                }

                this.setState({loading:true});
                result && result.then(({data}) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({loading:false,record:data.data,submited:true});
                        this.props.update();
                        // 修改成功关闭Modal，新增成功不关闭-提醒是否进行附件上传
                        if(isModify){
                            this.hideModal();
                        }
                    } else {
                        this.setState({loading:false});
                        message.error(data.msg, 4);
                    }
                })
                .catch(err => {
                    message.error(err.message);
                    this.setState({loading:false});
                })
            }
        });
    }
    render(){
        const readonly = (this.props.action ==='look');
        let {record={}} = this.state;
        const form= this.props.form,
        {getFieldDecorator} = this.props.form;
        let title = "查看";
        if(this.props.action==="add"){
            title = "添加";
        }else if(this.props.action==="modify"){
            title="修改"
        }
        return (
            <Modal 
            title={title}
            visible={this.props.visible}
            width='800px'
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
            onCancel={()=>{this.hideModal()}}
            footer={[
                record && record.id
                && <ButtonWithFileUploadModal
                    title="附件信息"
                    style={{
                        marginRight:10
                    }}
                    readOnly = {readonly}
                    size='default'
                    id={record.id}
                    uploadUrl={`/project/approval/file/upload/${record.id}`}
                />,
                <Button key="back" onClick={()=>{this.hideModal()}}>取消</Button>,
                <Button key="submit" type="primary" loading={this.state.loading} onClick={()=>{this.handleOk()}}>
                  确认
                </Button>,
              ]}
            maskClosable={false}
            destroyOnClose={true}
            >
            <Spin spinning={this.state.formLoading}>
                <Form>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.reply,(readonly || this.props.action==="modify"),true,'请输入批复文号'),
                            label:'批复文号',
                            fieldName:'reply'
                        },
                        {
                            ...setComItem(record.coveredArea,readonly,true,'请输入占地面积（㎡）'),
                            label:'占地面积（㎡）',
                            fieldName:'coveredArea',
                            type:'numeric',
                        },
                        {
                            ...setComItem(record.totalBuildingArea,readonly,true,'请输入总建筑面积（㎡）'),
                            label:'总建筑面积（㎡）',
                            fieldName:'totalBuildingArea',
                            type:'numeric',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.type,readonly,false),
                            label:'业态',
                            fieldName:'type'
                        },
                        {
                            ...setComItem(record.totalAmount,readonly,true,'请输入投资总额'),
                            label:'投资总额',
                            fieldName:'totalAmount',
                            type:'numeric',
                        },{
                            ...setComItem(record.developers,readonly,true,'请输入开发商'),
                            label:'开发商',
                            fieldName:'developers',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(moment(record.validityDate),readonly,true,'请选择有效期'),
                            label:'有效期',
                            fieldName:'validityDate',
                            type:'datePicker',
                        },
                        {
                            ...setComItem(moment(record.approvalDate),readonly,true,'请选择批复日期'),
                            label:'批复日期',
                            fieldName:'approvalDate',
                            type:'datePicker',
                        },
                        {
                            ...setComItem(record.approvalDepartment,readonly,false),
                            label:'批复部门',
                            fieldName:'approvalDepartment'
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="备注" labelCol={{
                                                            xs: { span: 12 },
                                                            sm: { span: 4 },
                                                            }}
                                                    wrapperCol={ {
                                                            xs: { span: 12 },
                                                            sm: { span: 20 },
                                                            }}>
                                {getFieldDecorator('remark',{initialValue:record.remark})(<TextArea disabled={readonly}/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);