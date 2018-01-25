/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col} from 'antd';
import {regRules,fMoney,accMul,getFields} from '../../../../../../utils'

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

    //计算金额的总和
   handleCellAmountSum=(amount,taxAmount,totalAmount)=>{
        const form = this.props.form;
        let v1 = parseFloat(form.getFieldValue(`${amount}`).replace(/\$\s?|(,*)/g, ''));
        let v2 = parseFloat(form.getFieldValue(`${taxAmount}`).replace(/\$\s?|(,*)/g, ''));
        if(typeof (v1) === 'undefined'){
           v1 = 0
        }
        if(typeof (v2) === 'undefined'){
           v2 = 0
        }
        const sum = v1+v2
        form.setFieldsValue({
            [totalAmount]: fMoney(sum),
        });
    }

    handleCalcAmoutTaxAmount=(qty,unitPrice,amount,taxRate,taxAmount,totalAmount)=>{
        this.handleAmout(qty,unitPrice,amount);
        this.handleTaxAmount(amount,taxRate,taxAmount);
        this.handleCellAmountSum(amount,taxAmount,totalAmount);
    }
    handleTaxAmount=(amount,taxRate,taxAmount)=>{
        const form = this.props.form;
        let v1 = form.getFieldValue(`${amount}`).replace(/\$\s?|(,*)/g, '');
        let v2 = (form.getFieldValue(`${taxRate}`)) /100;
        if(typeof (v1) === 'undefined'){
            v1 = 0
        }
        if(typeof (v2) === 'undefined'){
            v2 = 0
        }
        const count = v1*v2;
        form.setFieldsValue({
            [taxAmount]: fMoney(count),
        });
    }
    handleAmout=(qty,unitPrice,amount)=>{
        const form = this.props.form;
        let v1 = form.getFieldValue(`${qty}`);
        let v2 = form.getFieldValue(`${unitPrice}`).replace(/\$\s?|(,*)/g, '');
        if(typeof (v1) === 'undefined'){
            v1 = 0
        }
        if(typeof (v2) === 'undefined'){
            v2 = 0
        }
        const count = accMul(v1,v2);
        form.setFieldsValue({
            [unitPrice]:fMoney(v2),
            [amount]: fMoney(count),
        });
    }

    handleKeyUp=(name)=> {
        const form = this.props.form;
        let value = form.getFieldValue(`${name}`).replace(/\$\s?|(,*)/g, '');
        form.setFieldsValue({
            [name]: value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        });
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
                                        onBlur:()=>this.handleCalcAmoutTaxAmount('qty','unitPrice','amount','taxRate','taxAmount','totalAmount'),
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.qty,
                                        rules:[
                                            regRules.integer,
                                            {
                                                required:true,
                                                message:'请输入数量'
                                            }
                                        ],
                                    }
                                },{
                                    label:'单价',
                                    fieldName:'unitPrice',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        onKeyUp:(e)=>this.handleKeyUp('unitPrice'),
                                        onBlur:()=>this.handleCalcAmoutTaxAmount('qty','unitPrice','amount','taxRate','taxAmount','totalAmount'),
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:fMoney(initData.unitPrice),
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
                                    componentProps:{
                                        disabled:true,
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:fMoney(initData.amount),
                                        rules:[
                                            {
                                                ...max20
                                            }
                                        ]
                                    }
                                },{
                                    label:'税率',
                                    fieldName:'taxRate',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        valueType:'int',
                                        onBlur:()=>this.handleCalcAmoutTaxAmount('qty','unitPrice','amount','taxRate','taxAmount','totalAmount'),
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:initData.taxRate,
                                        rules: [
                                            regRules.integer,
                                            {
                                                required:true,
                                                message:'请输入税率'
                                            }
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
                                        rules:[
                                            {
                                                ...max20
                                            }
                                        ]
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