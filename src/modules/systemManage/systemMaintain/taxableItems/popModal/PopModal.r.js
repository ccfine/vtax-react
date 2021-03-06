/**
 * author       : liuliyuan
 * createTime   : 2018/1/26 18:10
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules,setFormat} from '../../../../../utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        initData:{},
        commonlyTaxRateList:[],
        simpleTaxRateList:[],
        loaded:false
    }

    toggleLoaded = loaded => this.setState({loaded})
    fetchReportById = (id)=>{
        this.toggleLoaded(false)
        request.get(`/taxable/project/find/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    })
                    !Number.isNaN(parseInt(data.data.businessType,10)) && this.fetchTypeList(data.data.businessType)
                }
            })
            .catch(err => {
                message.error(err.message)
                this.toggleLoaded(true)
            })
    }
    updateRecord = data =>{
        request.put('/taxable/project/update',data)
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
        request.post('/taxable/project/add',data)
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
    fetchTypeList=(type)=>{
        request.get(`sys/taxrate/list/commonlyTaxRate/${type}`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    commonlyTaxRateList:setFormat(data.data),
                });
            }
        })
        .catch(err => {
            message.error(err.message)
        })

        request.get(`sys/taxrate/list/simpleTaxRate/${type}`).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    simpleTaxRateList:setFormat(data.data),
                });
            }
        })
        .catch(err => {
            message.error(err.message)
        })
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)

                if(values.commonlyTaxRate){
                    values.commonlyTaxRateId = values.commonlyTaxRate;
                    values.commonlyTaxRate= undefined;
                }
                if(values.simpleTaxRate){
                    values.simpleTaxRateId = values.simpleTaxRate;
                    values.simpleTaxRate= undefined;
                }
                if(type==='edit'){
                    const data = {
                        id:this.state.initData.id,
                        ...values
                    }
                    this.updateRecord(data)
                }else if(type==='add'){
                    const data = {
                        parentId:this.props.modalConfig.id,
                        ...values
                    }
                    this.createRecord(data)
                }
            }
        });

    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData:{},
                commonlyTaxRateList:[],
                simpleTaxRateList:[],

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
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
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
                                        label:'应税项目编号',
                                        fieldName:'num',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['num'],
                                            rules:[
                                                regRules.input_length_25,
                                                {
                                                    required:true,
                                                    message:'请输入应税项目编号'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled: type==='edit'
                                        }
                                    }, {
                                        label:'应税项目名称',
                                        fieldName:'name',
                                        type:'input',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue:initData['name'],
                                            rules:[
                                                regRules.input_length_50,
                                                {
                                                    required:true,
                                                    message:'请输入应税项目名称'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'业务类型',
                                        fieldName:'businessType',
                                        type:'select',
                                        span:12,
                                        options:[{value:'0',text:'业务类型-非房地产建筑'},{value:'1',text:'业务类型-房地产建筑'}],
                                        fieldDecoratorOptions:{
                                            initialValue:initData['businessType'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入业务类型'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            onChange:value=>{
                                                this.props.form.setFieldsValue({commonlyTaxRate:undefined,simpleTaxRate:undefined})
                                                this.fetchTypeList(value)
                                            }
                                        }
                                    },{
                                        label:'一般计税税率',
                                        fieldName:'commonlyTaxRate',
                                        type:'select',
                                        span:'12',
                                        whetherShowAll:true,
                                        options:this.state.commonlyTaxRateList,
                                        componentProps:{
                                            allowClear:true,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['commonlyTaxRateId'],
                                        },
                                    }, {
                                        label:'简易计税税率',
                                        fieldName:'simpleTaxRate',
                                        type:'select',
                                        span:'12',
                                        whetherShowAll:true,
                                        options:this.state.simpleTaxRateList,
                                        componentProps:{
                                            allowClear:true,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['simpleTaxRateId'],
                                        },
                                    }, {
                                        label:'填报说明',
                                        fieldName:'description',
                                        type:'textArea',
                                        span:'24',
                                        formItemStyle:{
                                            labelCol:{
                                                span:3
                                            },
                                            wrapperCol:{
                                                span:21
                                            },
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['description'],
                                            rules:[
                                                regRules.textArea_length_225,
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