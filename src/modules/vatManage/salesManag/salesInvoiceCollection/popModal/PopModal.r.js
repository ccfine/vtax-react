/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col} from 'antd';
import {request,getFields} from '../../../../../utils'
class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        initData:{

        }
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    fetchReportById = id=>{
        request.get(`/output/invoice/collection/get/${id}`)
            .then(({data})=>{
                const d = {"id":1,"createdDate":"2017-12-20 17:34:19","lastModifiedDate":"2017-12-20 12:16:35","createdBy":null,"lastModifiedBy":"1","mainId":1,"mainName":"c2","checkSets":"查1","checkType":12,"checkStart":"2017-01-02","checkEnd":"2017-01-02","checkImplementStart":"2017-01-02","checkImplementEnd":"2017-01-02","documentNum":"文书编号","issue":null,"closingTime":"2017-12-12","checkItems":"hello","differential":'2',"taxPayment":null,"lateFee":'90000.0',"fine":'12121.12',"remark":'备注蚊子',"isAttachment":0,"orgId":"87e7511d51754da6a1a04de1b4c669ff"}
                this.setState({
                    initData:d
                })
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
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
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
        const {initData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
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
        const dateFormat = 'YYYY-MM-DD'
        let shouldShowDefaultData = false;
        if(type==='edit' || type==='view'){
            shouldShowDefaultData = true;
        }
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form onSubmit={this.handleSubmit} style={{height:'470px',overflowY:'scroll'}}>
                    <Row>
                        {
                            getFields(props.form,[
                                {
                                    label:'纳税主体',
                                    fieldName:'mainId',
                                    type:'taxMain'
                                },
                                {
                                    label:'计税方法',
                                    fieldName:'taxMethod',
                                    type:'select',
                                    options:[
                                        {
                                            text:'一般计税方法',
                                            value:'1'
                                        },
                                        {
                                            text:'简易计税方法',
                                            value:'2'
                                        }
                                    ]
                                },
                                {
                                    label:'发票类型',
                                    fieldName:'invoiceType',
                                    type:'select',
                                    options:[
                                        {
                                            text:'专票',
                                            value:'s'
                                        },
                                        {
                                            text:'普票',
                                            value:'c'
                                        }
                                    ]
                                },
                                {
                                    label:'应税项目',
                                    fieldName:'taxableItem',
                                    type:'input'
                                },
                                {
                                    label:'发票号码',
                                    fieldName:'invoiceNum',
                                    type:'input'
                                },
                                {
                                    label:'发票代码',
                                    fieldName:'invoiceCode',
                                    type:'input'
                                }
                            ])
                        }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)