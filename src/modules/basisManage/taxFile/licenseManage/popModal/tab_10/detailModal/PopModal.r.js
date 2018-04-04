import React,{Component} from 'react'
import {Modal,Form,Button,message,Spin,Row} from 'antd'
import {getFields,request} from '../../../../../../../utils'
import { ButtonWithFileUploadModal } from '../../../../../../../compoments'
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
        submited:false
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible ){
            if(props.id){
                this.setState({formLoading:true});
                request.get(`/card/house/ownership/detail/find/${props.id}`).then(({data}) => {
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
                
                let obj = Object.assign({},this.state.record,values);
                let result ,
                sucessMsg ,
                isModify=(this.props.action==="modify" || (this.state.submited && this.props.action==="add"));
                
                if(isModify){
                    result = request.put('/card/house/ownership/detail/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    obj.titleCertificateId = this.props.titleCertificateId;
                    result = request.post('/card/house/ownership/detail/add', obj);
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
        const form= this.props.form;
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
                record && record.id
                && <ButtonWithFileUploadModal
                    key="detailFileInfo" 
                    title="附件信息"
                    style={{
                        marginRight:10
                    }}
                    readOnly = {readonly}
                    size='default'
                    id={record.id}
                    uploadUrl={`/card/house/ownership/detail/file/upload/${record.id}`}
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
                        getFields(form,[
                        {
                            ...setComItem(record.building,readonly,true,'请输入栋号'),
                            label:'栋号',
                            fieldName:'building'
                        },{
                            ...setComItem(record.unitNumber,readonly,true,'请输入单元号'),
                            label:'单元号',
                            fieldName:'unitNumber'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[                        
                        {
                            ...setComItem(record.accountNumber,readonly,true,'请输入户号'),
                            label:'户号',
                            fieldName:'accountNumber'
                        },{
                            ...setComItem(record.buildingArea,readonly,true,'请输入建筑面积（㎡）'),
                            label:'建筑面积（㎡）',
                            fieldName:'buildingArea',
                            type:'numeric',
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.shareArea ,readonly,true,'请输入分摊面积（㎡）'),
                            label:'分摊面积（㎡）',
                            fieldName:'shareArea',
                            type:'numeric',
                        },{
                            ...setComItem(record.landUse,readonly,false),
                            label:'设计用途',
                            fieldName:'landUse'
                        }])
                        }
                        </Row>
                        <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.position,readonly,false),
                            label:'坐落',
                            fieldName:'position'
                        }
                    ])
                        }
                    </Row>
                </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);