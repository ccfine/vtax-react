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
                request.get(`/project/finish/acceptance/find/${props.id}`).then(({data}) => {
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
                if(values.projectStages)   
                {
                    values.stagesId = values.projectStages.key;
                    values.stagesItemName = values.projectStages.label;
                    values.projectStages=undefined;
                }       
                
                // 处理日期
                values.startDate = values.startDate.format('YYYY-MM-DD');
                values.endDate = values.endDate.format('YYYY-MM-DD');
                values.issuingDate = values.issuingDate.format('YYYY-MM-DD');

                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/project/finish/acceptance/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.projectId = this.props.projectid;
                    result = request.post('/project/finish/acceptance/add', obj);
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
            >
            <Spin spinning={this.state.formLoading}>
                <Form>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.licenseNumber,(readonly || this.props.action==="modify"),true,'请输入竣工备案编号'),
                            label:'竣工备案编号',
                            fieldName:'licenseNumber'
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
                        getFields(form,[
                        {
                            ...setComItem(record.projectName,readonly,false),
                            label:'工程名称',
                            fieldName:'projectName'
                        },
                        {
                            ...setComItem(record.projectNum,readonly,true,'请输入工程编号'),
                            label:'工程编号',
                            fieldName:'projectNum'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[
                        {
                            ...setComItem(record.buildingArea ,readonly,true,'请输入建筑面积(m²)'),
                            label:'建筑面积(m²)',
                            fieldName:'buildingArea',
                            type:'numeric',
                        },{
                            ...setComItem(record.projectName,readonly,false),
                            label:'工程地点',
                            fieldName:'position'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.projectType ,readonly,false),
                            label:'工程类别',
                            fieldName:'projectType'
                        },{
                            ...setComItem(record.structuralStyle,readonly,false),
                            label:'结构形式',
                            fieldName:'structuralStyle'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.developmentOrg,readonly,false),
                            label:'建设单位',
                            fieldName:'developmentOrg'
                        },{
                            ...setComItem(record.surveyOrg ,readonly,false),
                            label:'勘察单位',
                            fieldName:'surveyOrg'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.designOrg ,readonly,false),
                            label:'设计单位',
                            fieldName:'designOrg'
                        },{
                            ...setComItem(record.builderOrg ,readonly,false),
                            label:'施工单位',
                            fieldName:'builderOrg'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.constructionOrg,readonly,false),
                            label:'监理单位',
                            fieldName:'constructionOrg'
                        },{
                            ...setComItem(record.authorityOrg,readonly,false),
                            label:'监督机构',
                            fieldName:'authorityOrg',
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(moment(record.startDate),readonly,true,'请选择开工日期'),
                            label:'开工日期',
                            fieldName:'startDate',
                            type:'datePicker',
                        },{
                            ...setComItem(moment(record.endDate),readonly,true,'请选择竣工验收日期'),
                            label:'竣工验收日期',
                            fieldName:'endDate',
                            type:'datePicker',
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
                        }
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
                
                <FileModal id={this.props.id || record.id} visible={this.state.visible} hideModal={this.hideFileModal} url='project/finish/acceptance'/>
            
            </Modal>
        );
    }
}

export default Form.create()(PopModal);