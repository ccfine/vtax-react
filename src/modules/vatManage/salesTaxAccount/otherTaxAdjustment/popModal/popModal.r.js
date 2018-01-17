import React,{Component} from 'react'
import {Modal,Form,Button,message,Spin,Row,Icon} from 'antd'
import {getFields,request} from '../../../../../utils'
import moment from 'moment';
import SelectPopModal from './popModal'
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
const setComItem=(initialValue,readonly=false,required=true)=>({
    span:'12',
    type:'input',
    formItemStyle:formItemLayout,
    fieldDecoratorOptions:{
        initialValue,
        rules:[
        {
            required:required,
            message:'必录'
        }
        ]
    },
    componentProps:{
        disabled:readonly
    }
});
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
                });
            }else{
                this.setState({formLoading:false});
            }
        }
    }
    hideModal=()=>{
        this.setState({visible:false})
    }
    hideSelfModal=()=>{
        this.props.form.resetFields();
        this.setState({record:{}});
        this.props.hideModal();
    }
    selectTax = (item)=>{
        this.setState({record:{taxableProjectId:item.id,taxableProjectName:item.name,businessType:undefined,...this.state.record}});
        this.props.form.setFieldsValue({taxableProjectName:item.name})
        this.fetchTypeList(item.id);
    }
    fetchTypeList=(id)=>{
        request.get(`/sys/taxrate/list/${id}`).then(({data}) => {
            if (data.code === 200) {
                this.setState({typelist:data.data});
            }
        });
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
    render(){
        const readonly = (this.props.action ==='look');
        const NotModifyWhenEdit = (this.props.action === 'modify');
        let {record={}} = this.state;
        const form= this.props.form;
        let title = "查看";
        if(this.props.action==="add"){
            title = "添加";
        }else if(this.props.action==="modify"){
            title="修改"
        }
        return (
            <Modal 
            title={title}
            visible={this.props.visible}
            width='700px'
            bodyStyle={{maxHeight:"500px",overflow:"auto"}}
            onCancel={this.hideSelfModal}
            footer={[
                <Button key="back" onClick={this.hideSelfModal}>取消</Button>,
                <Button key="submit" type="primary" loading={this.state.loading} onClick={()=>{this.handleOk()}}>
                  确认
                </Button>,
              ]}
            >
            <Spin spinning={this.state.formLoading}>
                <Form>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.mainId?{key:record.mainId}:undefined,readonly || NotModifyWhenEdit),
                            label:'纳税主体',
                            fieldName:'main',
                            type:'taxMain',
                            componentProps:{
                                labelInValue:true,
                                disabled:readonly
                            }
                        },
                        {
                            ...setComItem(moment(record.adjustDate),readonly),
                            label:'调整日期',
                            fieldName:'adjustDate',
                            type:'datePicker',
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.project,readonly),
                            label:'项目',
                            fieldName:'project',
                            type:'select',
                            options:[{text:'涉税调整',value:'1'},{text:'纳税检查调整',value:'2'}]
                        },
                        {
                            ...setComItem(record.taxableProjectName,readonly),
                            label:'应税项目',
                            fieldName:'taxableProjectName',
                            type:'input',
                            componentProps:{
                                disabled:readonly,
                                suffix:(<Icon type="search" style={{cursor:"pointer",padding:"10px",position:"absolute",right:"-11px",top:"-16px"}} onClick={()=>{this.setState({visible:true})}} />)
                            }
                        }
                    ])
                        }
                    </Row>
                    <Row>
                            {
                            getFields(form,[{
                                ...setComItem(record.businessType,readonly),
                                label:'业务类型',
                                fieldName:'businessType',
                                type:'select',
                                options:this.state.typelist.map(ele=>({value:ele.id,text:ele.name})),
                                componentProps:{
                                    disabled:readonly,
                                    onChange:(value)=>{
                                        let obj = this.state.typelist.find(ele=>ele.id === value);
                                        if(obj)
                                        {
                                            this.props.form.setFieldsValue({taxRate:obj.taxRate});
                                            this.setState({record:{businessType:value, taxRateName:obj.name, ...record}})
                                        }                                        
                                    }
                                }
                            },
                            {
                                ...setComItem(record.taxRate,true,false),
                                label:'税率',
                                fieldName:'taxRate',
                                type:'numeric'
                            }
                        ])
                            }
                        </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.amountWithoutTax,readonly),
                            label:'销售额（不含税）',
                            fieldName:'amountWithoutTax',
                            type:'numeric'
                        },
                        {
                            ...setComItem(record.taxAmountWithTax,readonly),
                            label:'销项（应纳）税额',
                            fieldName:'taxAmountWithTax',
                            type:'numeric'
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.deductionAmount,readonly,false),
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
                        }
                    ])
                        }
                    </Row>
                    <Row>
                    {
                        getFields(form,[{
                            ...setComItem(record.adjustReason,readonly),
                            label:'调整原因',
                            fieldName:'adjustReason',
                            type:'select',
                            options:[{text:'尾款调整',value:'1'},{text:'非地产业务（租金，水电费等）相关调整',value:'2'},{text:'未开票收入差异调整',value:'3'}]
                            }
                        ])
                    }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            ...setComItem(record.adjustDescription,readonly,false),
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
                            }
                        ])
                        }
                    </Row>
                </Form>
                </Spin>
                <SelectPopModal visible={this.state.visible} hideModal={this.hideModal} select={this.selectTax}/>
            </Modal>
        );
    }
}

export default Form.create()(PopModal);