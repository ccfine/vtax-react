/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col} from 'antd';
import {getFields,regRules} from '../../../../../../utils'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        defaultData:{},
    }

    handleSubmit = (e,isContinue) => {
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

                if(isContinue === 'continue'){
                    this.props.form.resetFields();
                    this.setState({
                        defaultData:{}
                    })
                }else{
                    this.props.toggleModalVisible(false);
                }
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
        this.props.setGqgxDate(t);
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
        this.props.setGqgxDate(data)
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
             * 弹出的时候如果类型不为添加，则异步请求数据
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
                onCancel={()=>props.toggleModalVisible(false)}
                width={600}
                visible={props.visible}
                footer={
                    type !== 'view' && <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <Button type="primary" onClick={(e)=>this.handleSubmit(e,'no')}>确定</Button>
                                {
                                    type === 'add' && <Button type="primary" onClick={(e)=>this.handleSubmit(e,'continue')}>继续添加</Button>
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
                                    label:'股东类型',
                                    fieldName:'stockholderType',
                                    type:'select',
                                    span:12,
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
                                    label:'股东',
                                    fieldName:'stockholder',
                                    type:'input',
                                    span:12,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.stockholder,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入股东'
                                            },{
                                                max:regRules.input_length_50.max, message: regRules.input_length_50.message
                                            }
                                        ]
                                    }
                                },{
                                    label:'股权比例',
                                    fieldName:'stockRightRatio',
                                    type:'numeric',
                                    span:12,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.stockRightRatio,
                                    }
                                },{
                                    label:'权益比例',
                                    fieldName:'rightsRatio',
                                    type:'numeric',
                                    span:12,
                                    componentProps:{
                                        disabled
                                    },
                                    fieldDecoratorOptions:{
                                        initialValue:defaultData.rightsRatio,
                                    }
                                },{
                                    label:'备注',
                                    fieldName:'remark',
                                    type:'textArea',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:3
                                        },
                                        wrapperCol:{
                                            span:21
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