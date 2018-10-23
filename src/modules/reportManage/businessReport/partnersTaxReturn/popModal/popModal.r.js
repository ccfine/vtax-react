/**
 * Created by liuliyuan on 2018/10/11.
 */
/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields} from 'utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        record:{},
        loaded:false,
    }

    toggleLoaded = loaded => this.setState({loaded})

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.main) {
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)
                if(type==='edit'){
                    if(this.props.id){
                        values['id'] = this.props.id;
                    }
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }
    updateRecord = data =>{
        request.put('/parnter/taxPartner/update',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('更新成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`更新失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }

    createRecord = data =>{
        request.post('/parnter/taxPartner/add',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('新增成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`新增失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }

    componentWillReceiveProps(nextProps){

        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                record:{}
            })
        }
        if(nextProps.modalConfig.type === 'add'){
            this.setState({
                loaded:true
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            this.setState({
                loaded:true,
                record:nextProps.modalConfig.record
            })
        }
    }
    render(){
        const {toggleModalVisible,modalConfig,visible,form,declare} = this.props;
        const {loaded,record} = this.state;
        let title='';
        const type = modalConfig.type;
        const readonly = type === "look";
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                title = '编辑';
                break;
            default :
                title = '查看';
                break;
            //no default
        }

        const formItemStyle={
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:16
            }
        }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={600}
                style={{
                    maxWidth:'90%'
                }}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVisible(false)}>取消</Button>
                            {
                                !readonly && <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            }
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'200px'}}>
                        <Row>
                            {
                                getFields(form,[
                                    {
                                        label: "纳税主体",
                                        fieldName: "main",
                                        type: "taxMain",
                                        span:24,
                                        formItemStyle,
                                        componentProps: {
                                            labelInValue: true,
                                            disabled: readonly || type==='edit',
                                        },
                                        fieldDecoratorOptions: {
                                            initialValue: declare ? {key:declare.mainId,label:declare.mainName} : undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择纳税主体'
                                                }
                                            ]
                                        }
                                    },{
                                        label:'合作方公司名称',
                                        fieldName:'name',
                                        type:'input',
                                        span:24,
                                        formItemStyle,
                                        componentProps: {
                                            disabled: readonly,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:record.name,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入合作方公司名称'
                                                }
                                            ]
                                        },
                                    }
                                ])
                            }
                        </Row>
                    </Form>
                </Spin>

            </Modal>
        )
    }
}

export default Form.create()(PopModal)