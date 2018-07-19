import React,{Component} from 'react'
import {Modal,Form,Button,message,Spin,Row} from 'antd'
import {getFields,request} from 'utils'
import moment from 'moment'
import find from 'lodash/find'
import { BigNumber } from "bignumber.js";
import {connect} from 'react-redux'
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };
class PopModal extends Component{
    state={
        loading:false,
        formLoading:false,
        record:{},
        visible:false,
        typelist:[]
    }
    componentWillReceiveProps(props){
        if(props.visible && this.props.visible!==props.visible){
            if(props.id){
                this.setState({formLoading:true});
                request.get(`/account/output/othertax/get/${props.id}`).then(({data}) => {
                    if (data.code === 200) {
                        if(data.data && data.data.taxableProjectId){
                            this.fetchTypeList(data.data.taxableProjectId);
                        }
                        this.setState({formLoading:false,record:data.data});
                    }
                })
                .catch(err => {
                    message.error(err.message)
                    this.setState({formLoading:false});
                })
            }else{
                this.props.form.resetFields();
                this.setState({formLoading:false,record:{},typelist:[]});
            }
        }
    }
    hideModal=()=>{
        this.setState({visible:false})
    }
    hideSelfModal=()=>{
        this.props.form.resetFields();
        this.setState({formLoading:false,record:{},typelist:[]});
        this.props.hideModal();
    }
    selectTax = (item)=>{
        this.setState({record:{...this.state.record,taxableProjectId:item.id,taxableProjectName:item.name,businessType:undefined}});
        this.props.form.setFieldsValue({taxableProject:{key:item.id,label:item.name},businessType:undefined,taxRate:undefined})
        this.fetchTypeList(item.id);
    }
    fetchTypeList=(id)=>{
        request.get(`/sys/taxrate/list/by/taxable/${id}`).then(({data}) => {
            if (data.code === 200) {
                this.setState({typelist:data.data});
            }
        })
        .catch(err => {
            message.error(err.message)
        })
    }
    autoCalTax = (amount,tax)=>{
        // 计算公式：销售额（不含税）*税率
        try{
            this.props.form.setFieldsValue({taxAmountWithTax:(new BigNumber(amount)).multipliedBy(tax).dividedBy(100).toFixed(2)});
        }catch(err){
        }
    }
    handleOk(){
        if((this.props.action!=='modify' && this.props.action!=='add') || this.state.formLoading){
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                values.adjustDate = values.adjustDate.format('YYYY-MM-DD');
                //处理下拉数据
                if(values.main){
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    values.main = undefined;
                }
                // 处理应税项目
                if(values.taxableProject){
                    values.taxableProjectId = values.taxableProject.key;
                    values.taxableProjectName = values.taxableProject.taxableProjectName;
                    values.taxableProject = undefined;
                }

                let obj = Object.assign({},this.state.record,values);

                let result ,
                sucessMsg ;
                if(this.props.action==="modify"){
                    result = request.put('/account/output/othertax/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    result = request.post('/account/output/othertax/add', obj);
                    sucessMsg='添加成功';
                }

                this.setState({loading:true});
                result && result.then(({data}) => {
                    if (data.code === 200) {
                        message.success(sucessMsg, 4);
                        this.setState({loading:false});
                        this.props.update && this.props.update();
                        this.props.hideModal();
                    } else {
                        this.setState({loading:false});
                        message.error(data.msg, 4);
                    }
                })
                .catch(err => {
                    message.error(err.message);
                    this.setState({loading:false});
                })
            }
        });
    }
    disabledDate = (value)=>{
        let {declare} = this.props;
        if(declare && declare.authMonth){
            return moment(declare.authMonth).format('YYYY-MM') !== value.format('YYYY-MM');
        }else{
            return false;
        }
    }
    render(){
        const readonly = (this.props.action ==='look');
        const NotModifyWhenEdit = (this.props.action === 'modify');
        let {record={}} = this.state;
        const form= this.props.form;

        let title = "查看";
        if(this.props.action==="add"){
            title = "新增";
        }else if(this.props.action==="modify"){
            title="编辑"
        }

        const { declare } = this.props;
        let disabled = !!declare;
        return (
            <Modal
            title={title}
            visible={this.props.visible}
            width='700px'
            style={{top:'10%'}}
            bodyStyle={{maxHeight:"450px",overflow:"auto"}}
            onCancel={this.hideSelfModal}
            footer={[
                <Button key="back" onClick={this.hideSelfModal}>取消</Button>,
                readonly?null:<Button key="submit" type="primary" loading={this.state.loading} onClick={()=>{this.handleOk()}}>
                  确认
                </Button>,
              ]}
            maskClosable={false}
            destroyOnClose={true}
            >
            <Spin spinning={this.state.formLoading}>
                <Form>
                    <Row>
                        {
                        getFields(form,[{
                            label:'纳税主体',
                            fieldName:'main',
                            type:'taxMain',
                            span:'12',
                            formItemStyle:formItemLayout,
                            componentProps:{
                                labelInValue:true,
                                disabled:readonly || NotModifyWhenEdit || disabled
                            },
                            fieldDecoratorOptions:{
                                initialValue:record.mainId?{key:record.mainId,label:record.mainName}:(declare?{key:declare.mainId}:undefined),
                                rules:[
                                {
                                    required:true,
                                    message:'请选择纳税主体'
                                }
                                ]
                            },
                        },
                        {
                            label:'调整日期',
                            fieldName:'adjustDate',
                            type:'datePicker',
                            span:'12',
                            formItemStyle:formItemLayout,
                            fieldDecoratorOptions:{
                                initialValue:(record.adjustDate && moment(record.adjustDate)) || (declare && declare.authMonth && moment(declare.authMonth)),
                                rules:[{
                                    required:true,
                                    message:'请选择调整日期'
                                }]
                            },
                            componentProps:{
                                disabled:readonly,
                                disabledDate:this.disabledDate
                            }
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            label:'项目',
                            fieldName:'project',
                            type:'select',
                            options:[{text:'涉税调整',value:'1'},{text:'纳税检查调整',value:'2'}],
                            formItemStyle:formItemLayout,
                            span:'12',
                            fieldDecoratorOptions:{
                                initialValue:record.project,
                                rules:[
                                {
                                    required:true,
                                    message:'请选择项目'
                                }
                                ]
                            },
                            componentProps:{
                                disabled:readonly,
                                onChange:(data)=>{
                                    //项目选择纳税检查调整时，调整原因默认为纳税检查调整
                                    if(data === '2'){
                                        this.props.form.setFieldsValue({adjustReason:'5'})
                                    }
                                }
                            }
                        },
                        {
                            label:'应税项目',
                            fieldName:'taxableProject',
                            type:'taxableProject',
                            span:12,
                            formItemStyle:formItemLayout,
                            fieldDecoratorOptions:{
                                initialValue: (record && record.taxableProjectId) ? {
                                    label:record.taxableProjectName || '',
                                    key:record.taxableProjectId || ''
                                } : undefined,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择应税项目'
                                    }
                                ]
                            },
                            componentProps:{
                                disabled:readonly,
                                onChange:data=>{
                                    data.id = data.key;
                                    data.name = data.label;
                                    this.selectTax(data);
                                }
                            }
                        }
                    ])
                        }
                    </Row>
                    <Row>
                            {
                            getFields(form,[{
                                span:'12',
                                formItemStyle:formItemLayout,
                                label:'业务类型',
                                fieldName:'businessType',
                                type:'select',
                                options:this.state.typelist.map(ele=>({value:ele.id,text:ele.name})),
                                componentProps:{
                                    disabled:readonly,
                                    onChange:(value)=>{
                                        let obj = find(this.state.typelist,ele=>ele.id === value);
                                        if(obj)
                                        {
                                            this.props.form.setFieldsValue({taxRate:obj.taxRate});
                                            this.setState({record:{...record, businessType:value, taxRateName:obj.name,taxRate:obj.taxRate}})
                                             // 计算公式：销售额（不含税）*税率
                                             this.autoCalTax(record.amountWithoutTax,obj.taxRate);
                                        }
                                    }
                                },
                                fieldDecoratorOptions:{
                                    initialValue:record.businessType,
                                    rules:[{
                                        required:true,
                                        message:'请选择业务类型'
                                    }]
                                },
                            },
                            {
                                label:'税率',
                                fieldName:'taxRate',
                                type:'numeric',
                                span:'12',
                                formItemStyle:formItemLayout,
                                fieldDecoratorOptions:{
                                    initialValue:record.taxRate,
                                },
                                componentProps:{
                                    disabled:true
                                }
                            }
                        ])
                            }
                        </Row>
                    <Row>
                        {
                        getFields(form,[{
                            span:'12',
                            formItemStyle:formItemLayout,
                            label:'销售额（不含税）',
                            fieldName:'amountWithoutTax',
                            type:'numeric',
                            componentProps:{
                                disabled:readonly,
                                allowNegative:true,
                                onChange:(value)=>{
                                    this.setState({record:{...record, amountWithoutTax:value}});
                                    // 计算公式：销售额（不含税）*税率
                                    this.autoCalTax(value,record.taxRate);
                                }
                            },
                            fieldDecoratorOptions:{
                                initialValue:record.amountWithoutTax,
                                rules:[{
                                    required:true,
                                    message:'请输入销售额（不含税）',
                                }]
                            },
                        },
                        {
                            span:'12',
                            formItemStyle:formItemLayout,
                            label:'销项（应纳）税额',
                            fieldName:'taxAmountWithTax',
                            type:'numeric',
                            componentProps:{
                                disabled:readonly,
                                allowNegative:true
                            },
                            fieldDecoratorOptions:{
                                initialValue:record.taxAmountWithTax,
                                rules:[{
                                    required:true,
                                    message:'请输入销项（应纳）税额',
                                }]
                            },
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            formItemStyle:{
                                labelCol: {
                                  xs: { span: 12 },
                                  sm: { span: 16 },
                                },
                                wrapperCol: {
                                  xs: { span: 12 },
                                  sm: { span: 8 },
                                },
                              },
                            span:24,
                            label:'服务、不动产和无形资产扣除项目本期实际扣除金额（含税）',
                            fieldName:'deductionAmount',
                            type:'numeric',
                            componentProps:{
                                disabled:readonly,
                                allowNegative:true,
                            },
                            fieldDecoratorOptions:{
                                initialValue:record.deductionAmount,
                            },
                        }
                    ])
                        }
                    </Row>
                    <Row>
                    {
                        getFields(form,[{
                            span:16,
                            formItemStyle:{
                                labelCol: {
                                  xs: { span: 12 },
                                  sm: { span: 6 },
                                },
                                wrapperCol: {
                                  xs: { span: 12 },
                                  sm: { span: 18 },
                                },
                              },
                            label:'调整原因',
                            fieldName:'adjustReason',
                            type:'select',
                            options:[{text:'尾款调整',value:'1'},
                            {text:'非地产业务（租金，水电费等）相关调整',value:'2'},
                            {text:'未开票收入差异调整',value:'3'},
                            {text:'其他涉税调整',value:'4'},
                            {text:'纳税检查调整',value:'5'}],
                            fieldDecoratorOptions:{
                                initialValue:record.adjustReason,
                                rules:[{
                                    required:true,
                                    message:'请选择调整原因'
                                }]
                            },
                            componentProps:{
                                disabled:readonly
                            }    
                        }
                        ])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            label:'具体调整说明',
                            fieldName:'adjustDescription',
                            type:'textArea',
                            span:16,
                            formItemStyle:{
                                labelCol: {
                                  xs: { span: 12 },
                                  sm: { span: 6 },
                                },
                                wrapperCol: {
                                  xs: { span: 12 },
                                  sm: { span: 18 },
                                },
                              },
                              fieldDecoratorOptions:{
                                initialValue:record.adjustDescription,
                            },
                            componentProps:{
                                disabled:readonly
                            }    
                            }
                        ])
                        }
                    </Row>
                </Form>
                </Spin>
            </Modal>
        );
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
}))(Form.create()(PopModal));
