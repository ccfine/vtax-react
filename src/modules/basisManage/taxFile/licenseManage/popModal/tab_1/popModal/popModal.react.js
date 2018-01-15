import React,{Component} from 'react'
import {Modal,Form,Input,Col,Button,message,Spin,Row} from 'antd'
import {getFields,request} from '../../../../../../../utils'
import moment from 'moment';
import FileModal from '../../file.rect'
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
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
            required:required,
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
        submited:false,
        visible:false
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible){
            if(props.id){
                this.setState({formLoading:true});
                request.get(`/contract/land/find/${props.id}`).then(({data}) => {
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
    hideFileModal=()=>{
        this.setState({visible:false})
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
                values.signingDate = values.signingDate.format('YYYY-MM-DD');
                
                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/contract/land/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.projectId = this.props.projectid;
                    result = request.post('/contract/land/add', obj);
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
            width='700px'
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
            onCancel={()=>{this.hideModal()}}
            footer={[
            (record.id && <Button key="info" icon="search" onClick={()=>{
                this.setState({visible:true})
            }}>附件信息</Button>),
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
                            ...setComItem(record.contractNum,readonly),
                            label:'合同编号',
                            fieldName:'contractNum'
                        },
                        {
                            ...setComItem(record.parcelNum,readonly),
                            label:'宗地编号',
                            fieldName:'parcelNum',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.transferor,readonly),
                            label:'出让人',
                            fieldName:'transferor',
                        },
                        {
                            ...setComItem(record.assignee,readonly),
                            label:'受让人',
                            fieldName:'assignee',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.acquireWay,readonly),
                            label:'取得方式',
                            fieldName:'acquireWay',
                        },
                        {
                            ...setComItem(record.projectType,readonly),
                            label:'项目类型',
                            fieldName:'projectType',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.position,readonly,false),
                            label:'宗地位置',
                            fieldName:'position'
                        },
                        {
                            ...setComItem(record.landAgeLimit,readonly,false),
                            label:'土地年限',
                            fieldName:'landAgeLimit',
                            type:'numeric'
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.landPrice,readonly),
                            label:'土地价款',
                            fieldName:'landPrice',
                            type:'numeric',
                        },
                        {
                            ...setComItem(record.landArea,readonly),
                            label:'土地面积（㎡）',
                            fieldName:'landArea'
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.coveredArea,readonly),
                            label:'建筑面积（㎡）',
                            fieldName:'coveredArea',
                            type:'numeric',
                        },
                        {
                            ...setComItem(record.plotRatio,readonly),
                            label:'容积率',
                            fieldName:'plotRatio',
                            type:'numeric',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(moment(record.signingDate),readonly),
                            label:'合同签订日期',
                            fieldName:'signingDate',
                            type:'datePicker',
                        }])
                        }
                    </Row>
                    <Row>
                        <Col span={16}>
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
                <FileModal id={this.props.id || record.id} visible={this.state.visible} hideModal={this.hideFileModal} url='contract/land'/>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);