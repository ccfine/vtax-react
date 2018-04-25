/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col} from 'antd';
import {getFields,regRules} from 'utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        defaultData:{},
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
                    default :
                    //no default
                }
                this.props.toggleModalVisible(false);
                this.props.setSelectedRowKeysAndselectedRows(null,{})
            }
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
        this.props.setGdjcgDate(t);
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
        this.props.setGdjcgDate(data)
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                defaultData:{}
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.setState({
                defaultData:{...nextProps.selectedRows[0]}
            })

        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const props = this.props;
        const {defaultData} = this.state;
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
        const formItemStyle={
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
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
                    type !== 'view' && <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
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
                                    label:'股东类型',
                                    fieldName:'stockholderType',
                                    type:'select',
                                    span:12,
                                    formItemStyle,
                                    options:[
                                        {
                                            text:'我方股东',
                                            value:'1'
                                        },
                                        {
                                            text:'他方股东',
                                            value:'2'
                                        }
                                    ],
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.stockholderType,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请选择股东类型'
                                            }
                                        ]
                                    }
                                },{
                                    label:'实际股东',
                                    fieldName:'realStockholder',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.realStockholder,
                                        rules:[
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'是否代持股权',
                                    fieldName:'stockRight',
                                    type:'checkbox',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.stockRight,
                                    }
                                },{
                                    label:'登记股东',
                                    fieldName:'registeredStockholder',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.registeredStockholder,
                                        rules:[
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'注册资本出资期限',
                                    fieldName:'term',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.term,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入注册资本出资期限'
                                            },{
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'注册资本原币币种',
                                    fieldName:'registeredCapitalCurrency',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.registeredCapitalCurrency,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入注册资本原币币种'
                                            },{
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'注册资本原币金额(万元)',
                                    fieldName:'registeredCapitalAmount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.registeredCapitalAmount,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入注册资本原币金额'
                                            }
                                        ]
                                    }
                                },{
                                    label:'注册资本备注',
                                    fieldName:'remark',
                                    type:'textArea',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:4
                                        },
                                        wrapperCol:{
                                            span:20
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.remark,
                                        rules:[
                                            {
                                                max:regRules.textarea_length_2000.max, message: regRules.textarea_length_2000.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'实收资本原币币种',
                                    fieldName:'collectionCapitalCurrency',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.collectionCapitalCurrency,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入实收资本原币币种'
                                            },{
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'实收资本原币金额(万元)',
                                    fieldName:'collectionCapitalAmount',
                                    type:'numeric',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue: defaultData.collectionCapitalAmount,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入实收资本原币金额'
                                            }
                                        ]
                                    }
                                },{
                                    label:'代持情况',
                                    fieldName:'situation',
                                    type:'input',
                                    span:12,
                                    formItemStyle,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.situation,
                                        rules:[
                                            {
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'股东属性备注',
                                    fieldName:'propertyRemark',
                                    type:'textArea',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:4
                                        },
                                        wrapperCol:{
                                            span:20
                                        }
                                    },
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.propertyRemark,
                                        rules:[
                                            {
                                                max:regRules.textarea_length_2000.max, message: regRules.textarea_length_2000.message
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