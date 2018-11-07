import React,{Component} from 'react'
import {Modal,Form,Button,message,Spin,Row} from 'antd'
import {getFields,request,parseJsonToParams} from 'utils'
import moment from 'moment'
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
                request.get(`/accountOtherRevision/find/${props.id}`).then(({data}) => {
                    if (data.code === 200) {
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
    handleOk(){
        if((this.props.action!=='modify' && this.props.action!=='add') || this.state.formLoading){
            this.hideModal();
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 提交数据
                // 处理日期
                values.month = values.month.format('YYYY-MM');
                //处理下拉数据
                if(values.main){
                    values.mainId = values.main.key;
                    values.mainName = values.main.label;
                    delete values.main;
                }
                // 处理利润中心
                if(values.profitCenter){
                    values.profitCenterId = values.profitCenter.key;
                    values.profitCenterName = values.profitCenter.label;
                    delete values.profitCenter;
                }
                // 处理项目
                if(values.project){
                    values.projectId = values.project.key;
                    values.projectName = values.project.label;
                    values.project = undefined;
                }
                // 处理项目分期
                if(values.stages){
                    values.stagesId = values.stages.key;
                    values.stagesName = values.stages.label;
                    values.stages = undefined;
                }
                // 处理调整事项
                if(values.revision){
                    values.revisionType = values.revision.key;
                    values.revisionName = values.revision.label;
                    values.revision = undefined;
                }

                let obj = Object.assign({},this.state.record,values);

                let result ,
                sucessMsg ;
                if(this.props.action==="modify"){
                    result = request.put('/accountOtherRevision/update', obj);
                    sucessMsg='修改成功';
                }else if(this.props.action==="add"){
                    result = request.post('/accountOtherRevision/add', obj);
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

        const { declare } = this.props,
            {getFieldValue} = this.props.form;
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
                                initialValue:record.mainId?{key:record.mainId,label:record.mainName}:(declare?{key:declare.mainId,label:declare.mainName}:undefined),
                                rules:[
                                {
                                    required:true,
                                    message:'请选择纳税主体'
                                }
                                ]
                            },
                        },{
                            label:'利润中心',
                            fieldName:'profitCenter',
                            type:'asyncSelect',
                            span:12,
                            formItemStyle:formItemLayout,
                            fieldDecoratorOptions:{
                                initialValue: (record && record.profitCenterId) ? {
                                    label:record.profitCenterName,
                                    key:record.profitCenterId
                                } : undefined,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择利润中心'
                                    }
                                ]
                            },
                            componentProps:{
                                selectOptions:{
                                    labelInValue:true,
                                    disabled:readonly,
                                    placeholder:readonly?'':'请选择利润中心',
                                },
                                fieldTextName:'profitName',
                                fieldValueName:'id',
                                doNotFetchDidMount:false,
                                fetchAble:false,
                                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key) || (declare && declare.mainId)}`,
                            }
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            /*label:'项目名称',
                            fieldName:'project',
                            type:'asyncSelect',
                            span:12,
                            formItemStyle:formItemLayout,
                            fieldDecoratorOptions:{
                                initialValue: (record && record.projectId) ? {
                                    label:record.projectName,
                                    key:record.projectId
                                } : undefined,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择项目'
                                    }
                                ]
                            },
                            componentProps:{
                                selectOptions:{
                                    labelInValue:true,
                                    disabled:readonly,
                                },
                                fieldTextName:'itemName',
                                fieldValueName:'id',
                                doNotFetchDidMount: !(declare && declare.mainId),
                                fetchAble:getFieldValue('main') || (declare && declare.mainId) || false,
                                url:`/project/list/${(getFieldValue('main') && getFieldValue('main').key) || (declare && declare.mainId)}`,
                            }
                        },
                        {*/
                            label:'项目分期',
                            fieldName:'stages',
                            type:'asyncSelect',
                            span:12,
                            formItemStyle:formItemLayout,
                            fieldDecoratorOptions:{
                                initialValue: (record && record.stagesId) ? {
                                    label:record.stagesName,
                                    key:record.stagesId
                                } : undefined,
                                rules:[
                                    {
                                        required:true,
                                        message:'请选择项目分期'
                                    }
                                ]
                            },
                            componentProps:{
                                selectOptions:{
                                    disabled:readonly,
                                    labelInValue:true,
                                },
                                fieldTextName:'itemName',
                                fieldValueName:'id',
                                doNotFetchDidMount:!(record && record.profitCenterId),
                                fetchAble:getFieldValue('profitCenter') || (record && record.profitCenterId) || false,
                                url:`/project/stage/list?${parseJsonToParams({
                                    profitCenterId:(getFieldValue('profitCenter') && getFieldValue('profitCenter').key) || (record && record.profitCenterId),
                                    size:1000,
                                })}`,
                            }
                        }
                    ])
                        }
                    </Row>
                    <Row>
                            {
                            getFields(form,[{
                                    label:'调整月份',
                                    fieldName:'month',
                                    type:'monthPicker',
                                    span:'12',
                                    formItemStyle:formItemLayout,
                                    fieldDecoratorOptions:{
                                        initialValue:(record.month && moment(record.month)) || (declare && declare.authMonth && moment(declare.authMonth)),
                                        rules:[{
                                            required:true,
                                            message:'请选择调整月份'
                                        }]
                                    },
                                    componentProps:{
                                        disabled:readonly || !!declare,
                                    }
                                },{
                                    span:12,
                                    formItemStyle:formItemLayout,
                                    label:'调整事项',//调整事项 1预缴税款调整、2前期未抵扣土地价款 ,
                                    fieldName:'revision',
                                    type:'select',
                                    options:[{text:'预缴税款调整',value:'1'},
                                    {text:'前期未抵扣土地价款',value:'2'}],
                                    fieldDecoratorOptions:{
                                        initialValue:record.revisionType?{key:record.revisionType,label:record.revisionName}:undefined,
                                        rules:[{
                                            required:true,
                                            message:'请选择调整事项'
                                        }]
                                    },
                                    componentProps:{
                                        disabled:readonly,
                                        labelInValue:true,
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
                            label:'金额/税额',
                            fieldName:'amount',
                            type:'numeric',
                            componentProps:{
                                disabled:readonly,
                                allowNegative: true,
                            },
                            fieldDecoratorOptions:{
                                initialValue:record.amount,
                                rules:[{
                                    required:true,
                                    message:'请输入金额/税额',
                                }]
                            },
                        }
                    ])
                        }
                    </Row>
                    <Row>
                        {
                        getFields(form,[{
                            label:'调整说明',
                            fieldName:'directions',
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
                                initialValue:record.directions,
                                rules:[{
                                    required:true,
                                    message:'请输入调整说明',
                                }]
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

export default Form.create()(PopModal);
