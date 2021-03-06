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
        initData:{

        },
        loaded:false
    }

    toggleLoaded = loaded => this.setState({loaded})
    fetchReportById = (id)=>{
        this.toggleLoaded(false)
        request.get(`/sysOrganization/find/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    })
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
                initData:{}
            })
        }
        if(nextProps.modalConfig.type === 'add'){
            this.setState({
                loaded:true
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.fetchReportById(nextProps.modalConfig.id)
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)

                if(type==='edit'){
                    const data = {
                        ...this.state.initData,
                        ...values
                    }
                    this.updateRecord(data)
                }else if(type==='add'){
                    const data = {
                        ...values,
                        parentId:this.props.selectedNodes && this.props.selectedNodes.id
                    }
                    this.createRecord(data)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/sysOrganization/update',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('更新成功!');
                    props.toggleModalVisible(false);
                    props.refreshAll()
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
        request.post('/sysOrganization/add',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('新增成功!');
                    props.toggleModalVisible(false);
                    props.refreshAll()
                }else{
                    message.error(`新增失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }
    render(){
        const props = this.props;
        const {initData,loaded} = this.state;
        let title='';
        const type = props.modalConfig.type;
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
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={800}
                style={{
                    maxWidth:'90%'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'200px'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'上级机构代码',
                                        fieldName:'parentCode',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:props.modalConfig.type === 'add'?(props.selectedNodes && (props.selectedNodes.code)):initData['parentCode'],
                                        },
                                        componentProps:{
                                            disabled: true
                                        }
                                    }, {
                                        label:'上级机构名称',
                                        fieldName:'parentName',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:props.modalConfig.type === 'add'?(props.selectedNodes && (props.selectedNodes.name)):initData['parentName'],
                                        },
                                        componentProps:{
                                            disabled: true
                                        }
                                    }, {
                                        label:'机构代码',
                                        fieldName:'code',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['code'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入机构代码'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'机构名称',
                                        fieldName:'name',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['name'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入机构名称'
                                                }
                                            ]
                                        },
                                    }, {
                                        label:'机构简称',
                                        fieldName:'shortName',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['shortName'],
                                        },
                                    }, {
                                        label: '经营地址',
                                        fieldName: 'address',
                                        type: 'input',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: initData['address'],
                                        },
                                    }, {
                                        label: '机构所在地',
                                        fieldName: 'location',
                                        type: 'input',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: initData['location'],
                                        },
                                    }, {
                                        label: '本级序号',
                                        fieldName: 'level',
                                        type: 'numeric',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: type==='add' ?
                                                (
                                                    isNaN(parseInt(props.selectedNodes && props.selectedNodes.level, 0)+1) ? 1 : parseInt(props.selectedNodes && props.selectedNodes.level , 0)+1
                                                    ||
                                                    (parseInt(initData['level'], 0)+1)
                                                )
                                                :
                                                ((props.selectedNodes && props.selectedNodes.level) || initData['level']),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入本级序号'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled: true,
                                            valueType:'int'
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