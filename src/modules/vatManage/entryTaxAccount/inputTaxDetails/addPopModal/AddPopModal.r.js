/**
 * Created by liuliyuan on 2018/5/23.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message,Alert} from 'antd';
import {request,getFields} from 'utils'
const formItemStyle = {
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
class AddPopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        record:{},
        loaded:false
    }

    toggleLoaded = loaded => this.setState({loaded})

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
        if(nextProps.action === 'add'){
            this.setState({
                loaded:true
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.setState({
                record:nextProps.record
            },()=>{
                this.toggleLoaded(true)
            })
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
                const action = this.props.action;
                this.toggleLoaded(false)
                let data = {
                    ...this.state.record,
                    month: this.state.record.authMonth,
                    ...values
                }
                if(action==='edit'){
                    this.updateRecord(data)
                }else if(action==='add'){
                    this.createRecord(data)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/account/income/taxDetail/update',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('更新成功!');
                    props.toggleModalAddVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`更新失败:${data.msg}`)
                }
            })
            .catch(err => {
                this.toggleLoaded(true)
                message.error(err.message)
            })
    }

    createRecord = data =>{
        request.post('/account/income/taxDetail/add',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('新增成功!');
                    props.toggleModalAddVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`新增失败:${data.msg}`)
                }
            })
            .catch(err => {
                this.toggleLoaded(true)
                message.error(err.message)
            })
    }

    render(){
        const props = this.props;
        const {record,loaded} = this.state;
        let title='';
        const action = props.action;
        let disabled = false;
        switch (action){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                disabled = true;
                title = '编辑';
                break;
            default :
            //no default
        }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalAddVisible(false)}
                width={500}
                style={{
                    height:'300px',
                    maxWidth:'90%',
                    padding:0
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalAddVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Spin spinning={!loaded}>
                    <Form>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'抵扣凭据类型',
                                        fieldName:'type',
                                        type:'select',
                                        span:22,
                                        formItemStyle,
                                        options:[  //抵扣凭据类型：1:前期认证相符且本期申报抵扣 , 2: 前期入账本期申报抵扣
                                            {
                                                text:'前期认证相符且本期申报抵扣',
                                                value:'1'
                                            },{
                                                text:'前期入账本期申报抵扣',
                                                value:'2'
                                            }
                                        ],
                                        componentProps:{
                                            disabled
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:record.type,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入抵扣凭据类型'
                                                }
                                            ]
                                        }
                                    },{
                                        label:'凭据份数',
                                        fieldName:'num',
                                        type:'numeric',
                                        span:22,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:record.num,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入凭据份数'
                                                }
                                            ]
                                        }
                                    }, {
                                        label:'金额',
                                        fieldName:'amount',
                                        type:'numeric',
                                        span:22,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:record.amount,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入金额'
                                                }
                                            ]
                                        }
                                    }, {
                                        label:'税额',
                                        fieldName:'taxAmount',
                                        type:'numeric',
                                        span:22,
                                        formItemStyle,
                                        fieldDecoratorOptions:{
                                            initialValue:record.taxAmount,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请输入税额'
                                                }
                                            ]
                                        }
                                    },
                                ])
                            }
                        </Row>
                        <Row>
                            <Col>
                                <Alert message="凭证类型： 前期认证相符且本期申报抵扣" type="warning" showIcon />
                            </Col>
                        </Row>
                    </Form>
                </Spin>

            </Modal>
        )
    }
}

export default Form.create()(AddPopModal)
