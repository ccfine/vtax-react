/**
 * author       : liuliyuan
 * createTime   : 2018/3/12 10:40
 * description  :
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message,Card} from 'antd';
import {request,getFields,requestDict,setFormat,composeBotton} from 'utils'
import {AsyncTable} from 'compoments'
import moment from 'moment';
const columns = [
    {
        title: '编码',
        dataIndex: 'code',
    },{
        title: '纳税主体',
        dataIndex: 'name',
    }
];

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        tableKey:Date.now(),
        loaded:false,
        selectedRowKeys:[],
        selectedRows:[],
        cycle:[], //申报周期1年，2季，3月(数据字典SBZQ） ,
        //subordinatePeriodYear:[], // 所属期-年：当前年至前两年(数据字典NDLB） ,
        taxDeclaration:[], // 纳税申报(数据字典NSSB） ,
    }
    componentDidMount(){
        //申报周期1年
        requestDict('SBZQ',result=>{
            this.setState({
                cycle :setFormat(result)
            })
        });
        //所属期
        /*equestDict('NDLB',result=>{
            this.setState({
                subordinatePeriodYear :setFormat(result)
            })
        });*/
        //纳税申报
        requestDict('NSSB',result=>{
            this.setState({
                taxDeclaration :setFormat(result)
            })
        });
    }
    refreshTable=()=> {
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleLoaded = loaded => this.setState({loaded})
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
        }
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
                this.toggleLoaded(true)
            },200)
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
                const type = this.props.modalConfig.type;
                this.toggleLoaded(false)
                if(values.subordinatePeriod && values.subordinatePeriod.length!==0){
                    values.subordinatePeriodStart = values.subordinatePeriod[0].format('YYYY-MM-DD')
                    values.subordinatePeriodEnd = values.subordinatePeriod[1].format('YYYY-MM-DD')
                    values.subordinatePeriod = undefined;
                }
                if(values.declarationPeriod && values.declarationPeriod.length!==0){
                    values.declarationPeriodStart = values.declarationPeriod[0].format('YYYY-MM-DD')
                    values.declarationPeriodEnd = values.declarationPeriod[1].format('YYYY-MM-DD')
                    values.declarationPeriod = undefined;
                }
                if(values.period){
                    values.subordinatePeriodYear = values.period.format('YYYY')
                    //values.subordinatePeriodYearTxt = values.period.format('YYYY')
                    values.subordinatePeriodStage = values.period.format('MM')
                    values.period = undefined;
                }

                if(type==='edit'){
                    const data = {
                        ...this.props.initData,
                        ...values
                    }
                    this.updateRecord(data)
                }else if(type==='add'){
                    const data = {
                        ...values,
                        mainIds:this.state.selectedRowKeys
                    }
                    console.log(data)
                    this.createRecord(data)
                }
            }
        });

    }

    updateRecord = data =>{
        request.put('/sys/declarationParam/update',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('更新成功!');
                    props.toggleModalVisible(false);
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
        request.post('/sys/declarationParam/add',data)
            .then(({data})=>{
                this.toggleLoaded(true)
                if(data.code===200){
                    const props = this.props;
                    message.success('新增成功!');
                    props.toggleModalVisible(false);
                    props.refreshTable()
                }else{
                    message.error(`新增失败:${data.msg}`)
                }
            }).catch(err=>{
            this.toggleLoaded(false)
        })
    }
    deleteRecord=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleLoaded(true)
                request.delete(`/sys/declarationParam/delete/${this.props.modalConfig.id}`)
                    .then(({data})=>{
                        this.toggleLoaded(true)
                        if(data.code===200){
                            const props = this.props;
                            message.success('删除成功！');
                            props.toggleModalVisible(false);
                            props.refreshTable()
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    this.toggleLoaded(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    render(){
        const props =  this.props;
        const {initData} = this.props;
        const {loaded,cycle,taxDeclaration,tableKey} = this.state;
        const {setFieldsValue} = props.form;

        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                disabled=true;
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
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={800}
                style={{
                    top: '5%',
                    maxWidth:'90%'
                }}
                bodyStyle={{
                    maxHeight:450,
                    overflowY:'auto'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            {
                                type !== 'view' && <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            }
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                            {
                                type === 'edit' && composeBotton([{
                                    type:'delete',
                                    btnType:'danger',
                                    size:'default',
                                    text:'删除',
                                    userPermissions:['1111008'],
                                    onClick:()=>this.deleteRecord()
                                }])
                            }

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
                                        label:'税（费）种',
                                        fieldName:'taxType',
                                        type:'select',
                                        span:'12',
                                        options:[
                                            {
                                                text:'增值税',
                                                value:'1'
                                            },
                                            {
                                                text:'企业所得税',
                                                value:'2'
                                            }
                                        ],
                                        fieldDecoratorOptions:{
                                            initialValue:initData && initData['taxType'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择税（费）种'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    }, {
                                        label:'纳税申报',
                                        fieldName:'taxDeclaration',
                                        type:'select',
                                        span:'12',
                                        options:taxDeclaration,
                                        fieldDecoratorOptions:{
                                            initialValue:initData && initData['taxDeclaration'],
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税申报'
                                                }
                                            ]
                                        },
                                        componentProps:{
                                            disabled
                                        }}, {
                                        label: '申报周期',
                                        fieldName: 'cycle',
                                        type: 'select',
                                        span: '12',
                                        options: cycle,
                                        fieldDecoratorOptions: {
                                            initialValue: initData && initData['cycle'],
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择申报周期'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled
                                        }

                                    }, {
                                        label: '所属期',
                                        fieldName: 'period',
                                        type: 'monthPicker',
                                        span: '12',
                                        options: cycle,
                                        fieldDecoratorOptions:{
                                            initialValue: initData && moment(`${initData.subordinatePeriodYear}-${initData.subordinatePeriodStage}`, 'YYYY-MM'),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择所属期型'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            format: 'YYYY-MM',
                                            disabled:type === 'view',
                                            onChange:(date,dateString)=>{
                                                //console.log(date,dateString)
                                                if(dateString !== ''){
                                                    let d = moment(dateString);
                                                    let startDate = d.startOf('month').format('YYYY-MM-DD');
                                                    let endDate = d.endOf('month').format('YYYY-MM-DD');
                                                    //console.log(startDate, endDate)
                                                    setFieldsValue({
                                                        'subordinatePeriod':[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')] || []
                                                    })
                                                }else{
                                                    setFieldsValue({
                                                        'subordinatePeriod': []
                                                    })
                                                }

                                            },
                                        }
                                    },{
                                        label:'所属期起止',
                                        fieldName:'subordinatePeriod',
                                        type:'rangePicker',
                                        span:'12',
                                        fieldDecoratorOptions:{
                                            initialValue: (initData && [moment(initData.subordinatePeriodStart, 'YYYY-MM-DD'), moment(initData.subordinatePeriodEnd, 'YYYY-MM-DD')]),
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择所属期起止'
                                                }
                                            ]
                                        },
                                        componentProps: {
                                            disabled:true
                                        }
                                    }, {
                                        label: '申报日期起止',
                                        fieldName: 'declarationPeriod',
                                        type: 'rangePicker',
                                        span: '12',
                                        fieldDecoratorOptions: {
                                            initialValue: (initData && [moment(initData.declarationPeriodStart, 'YYYY-MM-DD'), moment(initData.declarationPeriodEnd, 'YYYY-MM-DD')]),
                                        },
                                        componentProps:{
                                            disabled
                                        }
                                    }
                                ])
                            }
                        </Row>
                    </Form>
                    <Card title="纳税主体" style={{marginTop:10}}>
                        <AsyncTable url="/taxsubject/listByName"
                                    updateKey={tableKey}
                                    filters={{
                                        name: initData && initData.mainCode
                                    }}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:true,
                                        pageSize:100,
                                        size:'small',
                                        columns:columns,
                                        onRowSelect:type === 'add' ? (selectedRowKeys,selectedRows)=>{
                                            this.setState({
                                                selectedRowKeys,
                                                selectedRows,
                                            })
                                        } : undefined,
                                    }} />
                    </Card>

                </Spin>

            </Modal>
        )
    }
}

export default Form.create()(PopModal)
