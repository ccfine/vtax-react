/**
 * Created by liurunbin on 2018/3/12.
 * 备案资料 - 增删查改
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields} from 'utils'
import moment from 'moment'
import { ButtonWithFileUploadModal } from 'compoments'
const formItemStyle = {
    labelCol:{
        span:10
    },
    wrapperCol:{
        span:14
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
        request.get(`/sys/recordInfo/find/${id}`)
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
             * 弹出的时候如果类型不为新增，则异步请求数据
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

                for(let key in values){
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }
                    if(moment.isMoment(values[key])){
                        //格式化一下时间 YYYY-MM类型
                        if(moment(values[key].format('YYYY-MM-DD'),'YYYY-MM-DD',true).isValid()){
                            values[key] = values[key].format('YYYY-MM-DD');
                        }

                        /*if(moment(values[key].format('YYYY-MM-DD'),'YYYY-MM-DD',true).isValid()){
                         values[key] = values[key].format('YYYY-MM-DD');
                         }*/
                    }
                }
                if(type==='edit'){
                    values.id=this.state.initData['id'];
                    this.updateRecord(values)
                }else if(type==='add'){
                    this.createRecord(values)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/sys/recordInfo/update',data)
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
        request.post('/sys/recordInfo/add',data)
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
        request.delete(`/sys/recordInfo/delete/${id}`)
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
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
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
                width={600}
                style={{
                    height:'316px',
                    maxWidth:'90%',
                    padding:0
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            {
                                type !== 'add' && (
                                    <ButtonWithFileUploadModal
                                        title="附件"
                                        style={{
                                            marginRight:10
                                        }}
                                        readOnly={type==='view'}
                                        size='default'
                                        id={props.modalConfig.id}
                                        uploadUrl={`/sys/recordInfo/upload/${props.modalConfig.id}`}
                                    />
                                )
                            }
                            {
                                type !== 'view' && (
                                    <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                                )
                            }
                            {
                                type !== 'view' && (
                                    <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                                )
                            }
                            {
                                type === 'edit' && <Button
                                    onClick={()=>{
                                        const modalRef = Modal.confirm({
                                            title: '友情提醒',
                                            content: '该删除后将不可恢复，是否删除？',
                                            okText: '确定',
                                            okType: 'danger',
                                            cancelText: '取消',
                                            onOk:()=>{
                                                this.toggleLoaded(false)
                                                this.deleteRecord(initData['id'])
                                            },
                                            onCancel() {
                                                modalRef.destroy()
                                            },
                                        });
                                    }}
                                    type='danger'>
                                    删除
                                </Button>
                            }
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
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['mainName'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'备案资料类型',
                                        fieldName:'recordType',
                                        type:'element',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['recordType'] ? `${initData['recordType']}` : '',
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入备案资料类型'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'备案日期',
                                        fieldName:'recordDate',
                                        type:'datePicker',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            format:'YYYY-MM-DD',
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['recordDate'] ? moment(initData['recordDate']) : null,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择备案日期'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'涉及税费种类',
                                        fieldName:'taxFeeCategory',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxFeeCategory'] ? `${initData['taxFeeCategory']}`:'',
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择涉及税费种类'
                                                }
                                            ]
                                        },
                                        options:[
                                            {
                                                text:'企业所得税',
                                                value:'1'
                                            },
                                            {
                                                text:'增值税',
                                                value:'2'
                                            }
                                        ]
                                    },
                                    {
                                        label:'备案资料名称',
                                        fieldName:'recordName',
                                        type:'input',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:5
                                            },
                                            wrapperCol:{
                                                span:19
                                            }
                                        },
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['recordName'] ? `${initData['recordName']}` : '',
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入备案资料名称'
                                                }
                                            ]
                                        },
                                    },
                                    {
                                        label:'备案资料主要内容',
                                        fieldName:'recordContent',
                                        type:'textArea',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:5
                                            },
                                            wrapperCol:{
                                                span:19
                                            }
                                        },
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['recordContent'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入备案资料主要内容'
                                                }
                                            ]
                                        },
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
