import React,{Component} from 'react'
import {Modal,Form,Input,Col,Button,message,Spin,Row} from 'antd'
import {getFields,request} from '../../../../../../../utils'
import moment from 'moment'
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 15 },
    },
  };
const setComItem=(initialValue,readonly=false,required=true)=>({
    span:'12',
    type:'input',
    formItemStyle:formItemLayout,
    fieldDecoratorOptions:{
        initialValue,
        rules:[
        {
            required,
            message:'必录'
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
                request.get(`/card/land/use/find/${props.id}`).then(({data}) => {
                    if (data.code === 200) {
                        this.setState({formLoading:false,record:data.data,submited:false});
                    }
                });
            }else{
                this.setState({formLoading:false});
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
                // 处理合同信息
                values.projectStagesId = [];
                values.projectStagesName = [];
                values.projectStages.forEach(ele=>{
                    values.projectStagesId.push(ele.key);
                    values.projectStagesName.push(ele.label)
                })
                values.projectStagesId = values.projectStagesId.join(',');
                values.projectStagesName = values.projectStagesName.join(',');
                values.projectStages = undefined;
                
                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/card/land/use/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.projectId = this.props.projectid;
                    result = request.post('/card/land/use/add', obj);
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

        let stages = [];
        record.projectStagesId && record.projectStagesId.split(',').forEach(element => {
            stages.push({key:element});
        });
        return (
            <Modal 
            title={title}
            visible={this.props.visible}
            width='800px'
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
            onCancel={()=>{this.hideModal()}}
            footer={[
            (record.id && <Button key="info" icon="search" onClick={()=>{}}>附件信息</Button>),
                <Button key="back" onClick={()=>{this.hideModal()}}>取消</Button>,
                <Button key="submit" type="primary" loading={this.state.loading} onClick={()=>{this.handleOk()}}>
                  确认
                </Button>,
              ]}
            >
            <Spin spinning={this.state.formLoading}>
                <Form>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.licenseKey,(readonly || this.props.action==="modify")),
                            label:'土地证编号',
                            fieldName:'licenseKey'
                        },
                        {
                            ...setComItem(record.organization,readonly),
                            label:'用地单位',
                            fieldName:'organization'
                        }])
                        }
                    </Row>
                    <Row>    
                    {
                        getFields(form,[{
                            ...setComItem(record.position,readonly),
                            label:'地块位置',
                            fieldName:'position'
                        },
                        {
                            ...setComItem(record.acquireWay,readonly),
                            label:'取得方式',
                            fieldName:'acquireWay'
                        }])
                    }
                    </Row>
                    <Row>    
                    {
                        getFields(form,[{
                            label:'项目分期',
                            fieldName:'projectStages',
                            ...setComItem([],readonly),
                            type:'asyncSelect',
                            componentProps:{
                                fieldTextName:'itemName',
                                fieldValueName:'id',
                                fetchAble:false,
                                url:`/project/stages/${this.props.projectid}`,
                                initialValue:stages, // 传这里有效
                                selectOptions:{
                                    mode:"multiple",
                                    disabled:readonly,
                                    labelInValue:true
                                }
                            }
                        },{
                            ...setComItem(record.landUse,readonly,false),
                            label:'土地用途',
                            fieldName:'landUse'
                        }])
                    }
                    </Row>
                    <Row>    
                    {
                        getFields(form,[{
                            ...setComItem(record.ageLimit,readonly),
                            label:'土地年限',
                            fieldName:'ageLimit',
                            type:'numeric',
                        },{
                            ...setComItem(record.rightArea,readonly),
                            label:'使用权面积（㎡）',
                            fieldName:'rightArea',
                            type:'numeric',
                        }])
                    }
                    </Row>
                    <Row>    
                    {
                        getFields(form,[{
                            ...setComItem(record.shareArea,readonly),
                            label:'其中：分摊面积（㎡）',
                            fieldName:'shareArea',
                            type:'numeric',
                        },{
                            ...setComItem(record.ownArea,readonly),
                            label:'其中：独有面积（㎡）',
                            fieldName:'ownArea',
                            type:'numeric',
                        }])
                    }
                    </Row>
                    <Row>    
                    {
                        getFields(form,[{
                            ...setComItem(moment(record.evidenceDate),readonly),
                            label:'取证日期',
                            fieldName:'evidenceDate',
                            type:'datePicker',
                        }])
                    }
                    </Row>
                    <Row>
                        <Col span={18}>
                            <FormItem label="备注" labelCol={{
                                                            xs: { span: 12 },
                                                            sm: { span: 6 },
                                                            }}
                                                    wrapperCol={ {
                                                            xs: { span: 12 },
                                                            sm: { span: 18 },
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