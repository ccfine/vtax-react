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
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 15 },
    },
  };
const setComItem=(initialValue,readonly=false,required=true,message)=>({
    span:'12',
    type:'input',
    formItemStyle:formItemLayout,
    fieldDecoratorOptions:{
        initialValue,
        rules:[
        {
            required,
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
        submited:false,
        visible:false
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible ){
            if(props.id){
                this.setState({formLoading:true});
                request.get(`/card/house/ownership/find/${props.id}`).then(({data}) => {
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
    hideFileModal=()=>{
        this.setState({visible:false});
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
                if(values.projectStages){
                    values.stagesId = values.projectStages.key;
                    values.stagesItemName = values.projectStages.label;
                    values.projectStages=undefined;
                }

                // 处理日期
                values.limitDate = values.limitDate.format('YYYY-MM-DD');
                values.boardingTime = values.boardingTime.format('YYYY-MM-DD');
                values.issuingDate = values.issuingDate.format('YYYY-MM-DD');

                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/card/house/ownership/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.projectId = this.props.projectid;
                    result = request.post('/card/house/ownership/add', obj);
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
            width='850px'
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
            onCancel={()=>{this.hideModal()}}
            footer={[
            (record.id && <Button key="info" icon="search" onClick={()=>{
                this.setState({visible:true});
            }}>附件信息</Button>),
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
                            ...setComItem(record.warrantNum ,(readonly || this.props.action==="modify"),true,'请输入权证号'),
                            label:'权证号',
                            fieldName:'warrantNum'
                        },
                        {
                            ...setComItem(record.warrantName,readonly,true,'请输入权证名称'),
                            label:'权证名称',
                            fieldName:'warrantName'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(record.warrantUser,readonly,true,'请输入权利人'),
                            label:'权利人',
                            fieldName:'warrantUser'
                        },
                        {
                            ...setComItem(record.position,readonly,true,'请输入坐落'),
                            label:'坐落',
                            fieldName:'position'
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(record.acquireWay,readonly,false),
                            label:'取得方式',
                            fieldName:'acquireWay'
                        },
                        {
                            ...setComItem(record.landUse,readonly,true,'请输入用途'),
                            label:'用途',
                            fieldName:'landUse'
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(record.landArea,readonly,true,'请输入宗地面积（㎡）'),
                            label:'宗地面积（㎡）',
                            fieldName:'landArea',
                            type:'numeric',
                        },
                        {
                            ...setComItem(record.buildingArea,readonly,true,'请输入建筑面积（㎡）'),
                            label:'建筑面积（㎡）',
                            fieldName:'buildingArea',
                            type:'numeric',
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(record.num,readonly,true,'请输入地号'),
                            label:'地号',
                            fieldName:'num'
                        },
                        {
                            ...setComItem(moment(record.limitDate),readonly,true,'请选择使用期限'),
                            label:'使用期限',
                            fieldName:'limitDate',
                            type:'datePicker',
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(moment(record.boardingTime),readonly,true,'请选择登记时间'),
                            label:'登记时间',
                            fieldName:'boardingTime',
                            type:'datePicker',
                        },
                        {
                            label:'项目分期',
                            fieldName:'projectStages',
                            ...setComItem(record.stagesId?{key:record.stagesId,label:record.stagesItemName}:undefined,readonly,true,'请选择项目分期'),
                            type:'asyncSelect',
                            componentProps:{
                                fieldTextName:'itemName',
                                fieldValueName:'id',
                                fetchAble:true,
                                url:`/project/stages/${this.props.projectid}`,
                                selectOptions:{
                                    labelInValue:true,
                                    disabled:readonly,
                                }
                            }
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.liquidationStage,readonly,true,'请输入清算分期'),
                            label:'清算分期',
                            fieldName:'liquidationStage',
                            type:'numeric',
                        },{
                            ...setComItem(record.rooms,readonly,true,'请输入套数'),
                            label:'套数',
                            fieldName:'rooms',
                            type:'numeric',
                        }])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(moment(record.issuingDate),readonly,true,'请选择发证日期'),
                            label:'发证日期',
                            fieldName:'issuingDate',
                            type:'datePicker',
                        },
                    ])
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
                <FileModal id={this.props.id || record.id} visible={this.state.visible} hideModal={this.hideFileModal} url='card/house/ownership' 
                    readOnly={this.props.action==="look"}/>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);