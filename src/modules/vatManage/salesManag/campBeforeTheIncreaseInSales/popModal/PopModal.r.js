/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields,regRules} from '../../../../../utils'
const confirm = Modal.confirm
const formItemStyle = {
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
const selectRenderColumnNumeric = value =>{
    //因为字符长度的判断必须是字符串，所以默认值不能是数值型，因此要返回 `` 来初始化字符串以防止编辑的时候直接提交导致校验长度出错
    if(typeof value !== 'undefined'){
        return `${value}`
    }else{
        return undefined
    }
}
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
        request.get(`/output/sellinghouse/find/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    this.setState({
                        initData:data.data
                    })
                }
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
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            this.fetchReportById(nextProps.modalConfig.id,nextProps)
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

                if(values.roomCode.label && values.roomCode.key){
                    values.roomCode = values.roomCode.key
                }else{
                    let tempData = values.roomCode;
                    values.roomCode = tempData.roomCode;
                    values.orgId = tempData.orgId;
                }

                if(type==='edit'){
                    values.id=this.state.initData['id']
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/output/sellinghouse/update',data)
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
    }

    createRecord = data =>{
        request.post('/output/sellinghouse/add',data)
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
    }

    deleteRecord = id => {
        request.delete(`/output/sellinghouse/delete/${id}`)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('删除成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            })
    }

    render(){
        const props = this.props;
        const {initData,loaded} = this.state;
        const {getFieldValue,resetFields} = this.props.form
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '添加';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                disabled=true;
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
                    position:'absolute',
                    height:'416px',
                    maxWidth:'90%',
                    left:0,
                    top:0,
                    bottom:0,
                    right:0,
                    padding:0,
                    margin:'auto'
                }}
                visible={props.visible}
                footer={
                    type !== 'view' ? <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            {
                                type === 'edit' && <Button
                                    onClick={()=>{
                                        confirm({
                                            title: '友情提醒',
                                            content: '是否删除该条数据？',
                                            okText: '确定',
                                            okType: 'danger',
                                            cancelText: '取消',
                                            onOk:()=>{
                                                this.toggleLoaded(false)
                                                this.deleteRecord(initData['id'])
                                            },
                                            onCancel() {

                                            },
                                        });
                                    }}
                                    type='danger'>
                                    删除
                                </Button>
                            }
                        </Col>
                    </Row> : null
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form style={{height:'300px'}}>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['mainId'] || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            onSelect:value=>{
                                                if(getFieldValue('mainId')!==value){
                                                    resetFields();
                                                    this.setState({
                                                        initData:{}
                                                    })
                                                }
                                            }
                                        }
                                    },
                                    {
                                        label:'房间编码',
                                        fieldName:'roomCode',
                                        type:'roomCodeSelect',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['roomCode'] ? {
                                                label:initData['roomCode'] || '',
                                                key:initData['roomCode'] || ''
                                            } : undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择房间编码'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled,
                                            customizedValues:{
                                                //这是个必须条件，当有mainId的时候才会正确弹窗
                                                mainId:initData['mainId'] || getFieldValue('mainId') || undefined
                                            },
                                            shouldChangeFields:['buildingName','element','roomNumber','customerName','taxIdentificationCode','projectName','stagesName']
                                        }
                                    },
                                    {
                                        label:'楼栋名称',
                                        fieldName:'buildingName',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['buildingName'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'单元',
                                        fieldName:'element',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['element'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'房号',
                                        fieldName:'roomNumber',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['roomNumber'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'客户名称',
                                        fieldName:'customerName',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['customerName'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'身份证号/纳税识别号',
                                        fieldName:'taxIdentificationCode',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxIdentificationCode'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'营业税收款金额',
                                        fieldName:'businessTaxCollectionAmount',
                                        type:'numeric',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:selectRenderColumnNumeric(initData['businessTaxCollectionAmount']),
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入营业税收款金额'
                                                },
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'营业税开票金额',
                                        fieldName:'businessTaxInvoiceAmount',
                                        type:'numeric',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:selectRenderColumnNumeric(initData['businessTaxInvoiceAmount']),
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入营业税开票金额'
                                                },
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'营业税结转收入金额',
                                        fieldName:'turnoverOfBusinessTax',
                                        type:'numeric',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:selectRenderColumnNumeric(initData['turnoverOfBusinessTax']),
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入营业税结转收入金额'
                                                },
                                                regRules.input_length_20
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    },
                                    {
                                        label:'项目名称',
                                        fieldName:'projectName',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['projectName'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
                                    {
                                        label:'项目分期名称',
                                        fieldName:'stagesName',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:initData['stagesName'],
                                        },
                                        componentProps:{
                                            disabled:true
                                        }
                                    },
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