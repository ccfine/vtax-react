/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col} from 'antd';
import {regRules,fMoney,getFields} from '../../../../../../utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        mainTaxItems:[
        ],
        initData:{

        }
    }
    addKey=data=>{
        const arr = [];
        data.forEach((item,i) => {
            if(!item.id){
                arr.push({...item, id:`t${i}`});
            }else{
                arr.push(item);
            }
        });
        return arr;
    }
    addDate = (data, item) =>{
        let arry = [];
        let t = null;
        arry.push(item);
        if(typeof (data) === 'undefined'){
            t = this.addKey([].concat(arry));
        }else{
            t = this.addKey(data.concat(arry));
        }
        this.props.setDetailsDate(t);
    }

    updateDate=(id,selectedRows)=>{
        const list = this.props.initData;
        const data = list.map((item)=>{
            if(item.id === id){
                return {
                    ...item,
                    ...selectedRows,
                }
            }
            return item;
        })
        this.props.setDetailsDate(data)
    }

    handleSubmit = (e,isContinue) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const type = this.props.modalConfig.type;
                switch (type){
                    case 'add':
                        this.addDate(this.props.initData, values);
                        break;
                    case 'edit':
                        this.updateDate(this.props.selectedRowKeys[0], values);
                        break;
                    default:
                    //no default
                }
                if(isContinue === 'continue'){
                    this.props.form.resetFields();
                    this.setState({
                        initData: {}
                    })
                }else{
                    this.props.toggleModalVisible(false);
                }
                this.props.setSelectedRowKeysAndselectedRows(null,{})

            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData: {}
            })
        }
        if (this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add') {
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            this.setState({
                initData: {...nextProps.selectedRows[0]}
            })

        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {initData} = this.state;
        const props = this.props;
    const {getFieldValue,setFieldsValue} = props.form;
        let title='';
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
                break;
            default:
                title = '添加';
                break;
        }
        const max20={
            max:regRules.input_length_20.max, message: regRules.input_length_20.message,
        }
        const formItemStyle={
            labelCol:{
                span:8
            },
            wrapperCol:{
                span:14
            }
        }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={(e)=>this.handleSubmit(e,'no')}>确定</Button>
                            {
                                type === 'add' && <Button type="primary" onClick={(e)=>this.handleSubmit(e,'continue')}>继续增加</Button>
                            }
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        {
                            getFields(this.props.form,[
                                {
                                    label:'货物或应税劳务名称',
                                    fieldName:'goodsServicesName',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.goodsServicesName,
                                        rules: [
                                            {
                                                required: true, message: '请输入货物或应税劳务名称',
                                            },{
                                                ...max20
                                            }
                                        ],
                                    }
                                },{
                                    label:'规格型号',
                                    fieldName:'specificationModel',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.specificationModel,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入规格型号'
                                            },{
                                                ...max20
                                            }
                                        ]
                                    }
                                },{
                                    label:'单位',
                                    fieldName:'unit',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.unit,
                                        rules:[
                                            {
                                                required: true,
                                                message: '请输入单位'
                                            }
                                        ]
                                    }
                                },{
                                    label:'数量',
                                    fieldName:'qty',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        onChange:(value)=>{
                                            let unitPrice = isNaN(parseInt(getFieldValue('unitPrice'), 0)) ? 0 : parseFloat(parseInt(getFieldValue('unitPrice'), 0)) ;
                                            const amount = unitPrice * value;
                                            setFieldsValue({
                                                amount:fMoney(amount),
                                            })
                                        },
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.qty,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入数量'
                                            },
                                            regRules.integer,
                                        ],
                                    }
                                },{
                                    label:'单价',
                                    fieldName:'unitPrice',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        onChange:(value)=>{
                                            let qty = isNaN(parseInt(getFieldValue('qty'), 0)) ? 0 : parseFloat(parseInt(getFieldValue('qty'), 0)) ;
                                            const amount = qty * value;
                                            setFieldsValue({
                                                amount:fMoney(amount),
                                            })
                                        },
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.unitPrice,
                                        rules:[
                                            {
                                                required: true,
                                                message: '请输入单价'
                                            }
                                        ]
                                    }
                                },{
                                    label:'金额',
                                    fieldName:'amount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps: {
                                        disabled:true,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:fMoney(initData.amount),
                                    }
                                },{
                                    label:'税率',
                                    fieldName:'taxRate',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        valueType:'int',
                                        onChange:(value)=>{
                                            let amount  = parseFloat(getFieldValue('amount').replace(/\$\s?|(,*)/g, ''), 0);
                                            let format_amount = isNaN(amount) ? 0 : amount;
                                            const taxAmount = format_amount * value / 100;
                                            const totalAmount = format_amount + taxAmount;

                                            setFieldsValue({
                                                taxAmount:fMoney(taxAmount),
                                                totalAmount:fMoney(totalAmount)
                                            })
                                        },
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.taxRate,
                                        rules: [
                                            {
                                                required:true,
                                                message:'请输入税率'
                                            },
                                            regRules.integer,
                                        ],
                                    }
                                },{
                                    label:'税额',
                                    fieldName:'taxAmount',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:true,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.taxAmount,
                                        rules: [
                                            {
                                                required:true,
                                                message:'请输入税率'
                                            }
                                        ],
                                    }
                                },{
                                    label:'价税合计',
                                    fieldName:'totalAmount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled:true,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:fMoney(initData.totalAmount),
                                    }
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