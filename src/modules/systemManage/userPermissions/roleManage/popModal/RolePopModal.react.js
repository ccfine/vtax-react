/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules} from 'utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        businessType:[],
        loaded:false,
    }

    toggleLoaded = loaded => this.setState({loaded})

    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)
                if(type==='edit'){
                    if(this.props.selectedRowKeys){
                        values['id'] = this.props.selectedRowKeys;
                    }
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }
    updateRecord = data =>{
        request.put('/sysRole/update',data)
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
            })
    }

    createRecord = data =>{
        request.post('/sysRole/add',data)
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
            })
    }


    componentDidMount(){

    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    componentWillReceiveProps(nextProps){

        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData:{}
            })
        }
        if(nextProps.modalConfig.type === 'add'){
            this.setState({
                loaded:true
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            nextProps.selectedRows && this.setState({
                loaded:true
            })
        }
    }
    render(){
        const {toggleModalVisible,modalConfig,visible,selectedRows,form} = this.props;
        const {loaded} = this.state;

        let title='';
        const type = modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                title = '编辑';
                break;
            default :
            //no default
        }

        const formItemStyle={
            labelCol:{
                span:4
            },
            wrapperCol:{
                span:20
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
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
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
                                        label:'角色名称',
                                        fieldName:'roleName',
                                        type:'input',
                                        span:24,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:selectedRows && selectedRows.roleName,
                                            rules:[
                                                regRules.trim,
                                                {
                                                    required:true,
                                                    message:'请输入角色名称'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'备注',
                                        fieldName:'remark',
                                        type:'textArea',
                                        span:24,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:selectedRows && selectedRows.remark,
                                        },
                                        componentProps:{
                                            autosize:{
                                                minRows:5
                                            }
                                        }
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