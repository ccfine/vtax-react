/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,DatePicker,InputNumber} from 'antd';
import {request,regRules,fMoney,requestDict,accMul} from '../../../../../../utils'
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

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


    getFields(start,end) {
        const props = this.props;
        const {getFieldDecorator} = this.props.form;
        const {initData} = this.state;

        let disabled =  props.modalConfig.type ==='view';

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 3},
            wrapperCol: { span: 19 },
        };

        const children = [];
        const max20={
            max:regRules.input_20_lenght.max, message: regRules.input_20_lenght.message,
        }
        const max50={
            max:regRules.input_50_lenght.max, message: regRules.input_50_lenght.message,
        }
        const data = [
            {
                label: '货物或应税劳务名称',
                type: 'text',
                fieldName: 'goodsServicesName',
                initialValue:initData.goodsServicesName,
                rules: [
                    {
                        required: true, message: '请输入货物或应税劳务名称',
                    },{
                        ...max20
                    }
                ],
            }, {
                label: '规格型号',
                type: 'text',
                fieldName: 'specificationModel',
                initialValue:initData.specificationModel,
                rules:[
                    {
                        required:true,
                        message:'请输入规格型号'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '单位',
                type: 'text',
                fieldName: 'unit',
                initialValue: initData.unit,
                rules:[
                    {
                        required:true,
                        message:'请输入单位'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '数量',
                type: 'inputNumber',
                fieldName: 'qty',
                initialValue: initData.qty,
                rules:[
                    {
                        required:true,
                        message:'请输入数量'
                    }
                ],
                res:{
                    onBlur:(e)=>this.handleAmout('qty','unitPrice','amount'),
                },
            }, {
                label: '单价',
                type: 'text',
                fieldName: 'unitPrice',
                initialValue:fMoney(initData.unitPrice),
                rules:[
                    {
                        required:true,
                        message:'请输入单价'
                    }
                ],
                res:{
                    onKeyUp:(e)=>this.handleKeyUp('unitPrice'),
                    onBlur:(e)=>this.handleAmout('qty','unitPrice','amount'),
                },
            }, {
                label: '金额',
                type: 'text',
                fieldName: 'amount',
                initialValue:fMoney(initData.amount),
                disabled:true,
            }, {
                label: '税率',
                type: 'inputNumber',
                fieldName: 'taxRate',
                initialValue:fMoney(initData.taxRate),
                setCondition:{
                    min:0,
                    max:100,
                    formatter:value => `${value}%`,
                    parser:value => value.replace('%', ''),
                },
                rules: [
                    {
                        required:true,
                        message:'请输入税率'
                    }
                ],
            }, {
                label: '税额',
                type: 'text',
                fieldName: 'taxAmount',
                initialValue:fMoney(initData.taxAmount),
                res:{
                    onKeyUp:(e)=>this.handleKeyUp('taxAmount'),
                    onBlur:(e)=>this.handleBlur('taxAmount'),
                },
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;

            if(!data[i].components){
                if (data[i].type === 'text') {
                    inputComponent = <Input disabled={ data[i].disabled ? data[i].disabled : disabled} {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
                } else if (data[i].type === 'inputNumber') {
                    inputComponent = <InputNumber disabled={disabled} {...data[i].setCondition} style={{width:'100%'}} />;
                }
            }else{
                inputComponent = data[i].components
            }

            if(!data[i].components) {
                children.push(
                    <Col span={data[i].span || 12} key={i}>
                        <FormItem
                            {...(data[i].span === 24 ? formItemLayout2 : formItemLayout)}
                            label={data[i].label}
                        >
                            {getFieldDecorator(data[i]['fieldName'], {
                                initialValue: data[i].initialValue,
                                rules: data[i].rules,
                            })(
                                inputComponent
                            )}
                        </FormItem>
                    </Col>
                );
            }


        }
        return children.slice(start, end || null);
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                const type = this.props.modalConfig.type;
                switch (type){
                    case 'add':
                        this.addDate(this.props.initData, values);
                        break;
                    case 'edit':
                        this.updateDate(this.props.selectedRowKeys[0], values);
                        break;
                }
                this.props.toggleModalVisible(false);
                this.props.setSelectedRowKeysAndselectedRows(null,{})
            }
        });
    }

    handleAmout=(num1,num2,name)=>{
        const form = this.props.form;
        let v1 = form.getFieldValue(`${num1}`);
        let v2 = form.getFieldValue(`${num2}`);
        form.setFieldsValue({
            [num1]:fMoney(v1),
            [num2]:fMoney(v2),
            [name]: fMoney(accMul(v1,v2)),
        });
    }

    handleKeyUp=(name)=> {
        const form = this.props.form;
        let value = form.getFieldValue(`${name}`).replace(/\$\s?|(,*)/g, '');
        form.setFieldsValue({
            [name]: value.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        });
    }

    handleBlur=(name)=>{
        const form = this.props.form;
        let value = form.getFieldValue(`${name}`);
        //console.log(value,fMoney(value));

        form.setFieldsValue({
            [name]: fMoney(value),
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
        arry.push({...item});
        let t = this.addKey(data.concat(arry));
        this.props.setDetailsDate(t);
    }

    updateDate=(id,selectedRows)=>{
        const list = this.props.initData;
        const data = list.map((item)=>{
            if(item.id === id){
                return {
                    id:item.id,
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
        const props = this.props;
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
                            <Button type="primary" onClick={this.handleSubmit}>继续增加</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        {
                            this.getFields(0,8)
                        }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)