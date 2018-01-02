/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Input,Modal,Form,Row,Col,Select,DatePicker,Card,Icon,message} from 'antd';
import {request,regRules,fMoney,requestDict} from '../../../../../utils'
import {CusFormItem,SynchronizeTable} from '../../../../../compoments'
import PopsModal from './popModal'
import moment from 'moment';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state={
        mainTaxItems:[
        ],
        initData:{

        },
        detailsDate:[],

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        selectedRowKeys:null,
        selectedRows:{},
        visible:false,
        modalConfig:{
            type:''
        },

        invoiceTypeItem:[], //发票类型
        incomeStructureTypeItem:[], //进项结构分类
    }

    columns = [{
        title: '货物或应税劳务名称',
        dataIndex: 'goodsServicesName',
    }, {
        title: '规格型号',
        dataIndex: 'specificationModel',
    },{
        title: '单位',
        dataIndex: 'unit',
    },{
        title: '数量',
        dataIndex: 'qty',
    },{
        title: '单价',
        dataIndex: 'unitPrice',
    },{
        title: '金额',
        dataIndex: 'amount',
    },{
        title: '税率',
        dataIndex: 'taxRate',
    },{
        title: '税额',
        dataIndex: 'taxAmount',
    }];

    getFields(start,end) {
        const props = this.props;
        const {getFieldDecorator} = this.props.form;
        const {initData} = this.state;

        let disabled =  props.modalConfig.type ==='view';

        const dateFormat = 'YYYY-MM-DD'
        let shouldShowDefaultData = false;
        if(props.modalConfig.type==='edit' || props.modalConfig.type==='view'){
            shouldShowDefaultData = true;
        }
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const formItemStyle = {
            labelCol:{
                span:2
            },
            wrapperCol:{
                span:22
            }
        };

        const children = [];
        const max20={
            max:regRules.input_length_20.max, message: regRules.input_length_20.message,
        }
        const max50={
            max:regRules.input_length_50.max, message: regRules.input_length_50.message,
        }
        const data = [
            {
                components:<CusFormItem.TaxMain
                    fieldName="incomeInvoiceCollectionDO.mainId"
                    initialValue={initData.mainId}
                    formItemStyle={formItemLayout}
                    form={this.props.form}

                    fieldDecoratorOptions={{
                        rules:[
                            {
                                required:true,
                                message:'请选择纳税主体'
                            }
                        ]
                    }}
                    componentProps={{
                        disabled:disabled
                    }}
                />
            },{
                label: '进项结构分类',
                type: 'select',
                fieldName: 'incomeInvoiceCollectionDO.incomeStructureType',
                initialValue:initData.incomeStructureType,
                items: this.state.incomeStructureTypeItem,
                rules: [
                    {
                        required: true, message: '请选择进项结构分类',
                    }
                ],
            }, {
                label: '发票类型',
                type: 'select',
                fieldName: 'incomeInvoiceCollectionDO.invoiceType',
                initialValue:initData.invoiceType,
                items: this.state.invoiceTypeItem,
                rules: [
                    {
                        required: true, message: '请选择发票类型',
                    }
                ],
            }, {
                label: '发票号码',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.invoiceNum',
                initialValue:initData.invoiceNum,
                rules: [
                    {
                        required: true, message: '请输入发票号码',
                    },{
                        ...max20
                    }
                ],
            }, {
                label: '发票代码',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.invoiceCode',
                initialValue:initData.invoiceCode,
                rules:[
                    {
                        required:true,
                        message:'请输入发票号码'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '开票日期',
                type: 'rangePicker',
                fieldName: 'incomeInvoiceCollectionDO.billingDate',
                initialValue:(shouldShowDefaultData && initData.billingDate) ? moment(initData.billingDate, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            }, {
                label: '认证月份',
                type: 'monthPicker',
                fieldName: 'incomeInvoiceCollectionDO.authMonth',
                initialValue:(shouldShowDefaultData && initData.authMonth) ? moment(initData.authMonth, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择开票日期'
                    }
                ]
            }, {
                label: '认证时间',
                type: 'rangePicker',
                fieldName: 'incomeInvoiceCollectionDO.authDate',
                initialValue:(shouldShowDefaultData && initData.authDate) ? moment(initData.authDate, dateFormat) : undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择认证时间'
                    }
                ]
            }, {
                label: '销货单位名称',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.sellerName',
                initialValue: initData.sellerName,
                rules:[
                    {
                        required:true,
                        message:'请输入销货单位名称'
                    },{
                        ...max50
                    }
                ]
            }, {
                label: '纳税人识别号',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.sellerTaxNum',
                initialValue:initData.sellerTaxNum,
                rules:[
                    {
                        required:true,
                        message:'请输入纳税人识别号'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '地址',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.address',
                initialValue:initData.address,
                rules:[
                    {
                        required:true,
                        message:'请输入地址'
                    },{
                        ...max50
                    }
                ]
            }, {
                label: '电话',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.phone',
                initialValue:initData.phone,
                rules:[
                    {
                        required:true,
                        message:'请输入电话'
                    },{
                        pattern: regRules.number.pattern, message: regRules.number.message,
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '开户行',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.bank',
                initialValue:initData.bank,
                rules:[
                    {
                        required:true,
                        message:'请输入开户行'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '账号',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.account',
                initialValue:initData.account,
                rules:[
                    {
                        required:true,
                        message:'请输入账号'
                    },{
                        ...max20
                    }
                ]
            }, {
                label: '金额',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.amount',
                initialValue:fMoney(initData.amount),
                disabled:true,
                rules:[
                    {
                        ...max20
                    }
                ]
            }, {
                label: '税额',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.taxAmount',
                initialValue:fMoney(initData.taxAmount),
                disabled:true,
                rules: [
                    {
                        ...max20
                    }
                ],
            }, {
                label: '价税合计',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.totalAmount',
                initialValue:fMoney(initData.totalAmount),
                disabled:true,
                rules: [
                    {
                        ...max20
                    }
                ],
            }, {
                label: '备注',
                type: 'text',
                fieldName: 'incomeInvoiceCollectionDO.remark',
                initialValue:initData.remark,
                span:24,
                rules:[
                    {
                        max:regRules.textarea_length_100.max, message: regRules.textarea_length_100.message,
                    }
                ],
            }
        ];

        for (let i = 0; i < data.length; i++) {
            let inputComponent;

            if(!data[i].components){
                if (data[i].type === 'text') {
                    inputComponent = <Input disabled={ data[i].disabled ? data[i].disabled : disabled} {...data[i].res} placeholder={`请输入${data[i].label}`}/>;
                } else if (data[i].type === 'rangePicker') {
                    inputComponent = <DatePicker disabled={disabled} placeholder={`请输入${data[i].label}`} format="YYYY-MM-DD" style={{width:'100%'}} />;
                } else if (data[i].type === 'monthPicker') {
                    inputComponent = <MonthPicker disabled={disabled} placeholder={`请输入${data[i].label}`} format="YYYY-MM" style={{width:'100%'}} />;
                } else if (data[i].type === 'select') {
                    inputComponent = (
                        <Select disabled={disabled} placeholder="请选择">
                            {
                                data[i].items.map((item, i) => <Option key={i} value={`${item.id}`}>{item.name}</Option>)
                            }
                        </Select>
                    )
                }
            }else{
                inputComponent = data[i].components
            }

            if(!data[i].components) {
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        <FormItem
                            {...(data[i].span === 24 ? formItemStyle : formItemLayout)}
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
            }else{
                children.push(
                    <Col span={data[i].span || 8} key={i}>
                        {inputComponent}
                    </Col>
                );
            }


        }
        return children.slice(start, end || null);
    }

    //注册类型:发票类型
    getRegistrationType=()=>{
        requestDict('JXFPLX',result=>{
            this.setState({
                invoiceTypeItem:result
            })
        })
    }
    //注册类型:进项结构分类
    getIncomeStructureType=()=>{
        requestDict('JXJGFL',result=>{
            this.setState({
                incomeStructureTypeItem:result
            })
        })
    }
    setDetailsDate=detailsDate=>{
        this.setState({
            detailsDate
        },()=>{
            console.log(this.state.detailsDate);
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    onChange=(selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys,selectedRows)
        debugger
        this.setSelectedRowKeysAndselectedRows(selectedRowKeys,selectedRows);
    }

    setSelectedRowKeysAndselectedRows=(selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }

    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            debugger
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    fetch = id=> {
        request.get(`/income/invoice/collection/get/${id}`,{
        })
            .then(({data}) => {
                console.log(data)
                if(data.code===200){
                    this.setState({
                        initData:{...data.data.incomeInvoiceCollectionDO},
                        detailsDate:[...data.data.list],
                    })
                }else{
                    message.error(data.msg, 4);
                }
            });
    }
    componentDidMount(){
        this.getRegistrationType()
        this.getIncomeStructureType()
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData:{},
                detailsDate:[],
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            if(nextProps.selectedRowKeys.length>0){
                this.fetch(nextProps.selectedRowKeys[0])
            }
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig,detailsDate} = this.state;
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
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{ top: 50 }}
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
                <Form onSubmit={this.handleSubmit} style={{height:'400px',overflowY:'scroll'}}>
                    <Card>
                        <Row>
                            {
                                this.getFields(0,3)
                            }
                        </Row>
                        <Row>
                            {
                                this.getFields(3,8)
                            }
                        </Row>
                        <Row>
                            {
                                this.getFields(8,17)
                            }
                        </Row>
                        <Row>
                            {
                                this.getFields(17,18)
                            }
                        </Row>
                    </Card>

                    <Card
                        extra={type !== 'view' && <div>
                            <Button onClick={()=>this.showModal('add')} style={buttonStyle}>
                                <Icon type="file-add" />
                                新增明细
                            </Button>
                            <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                                <Icon type="edit" />
                                编辑
                            </Button>
                            <Button
                                onClick={()=>{
                                    confirm({
                                        title: '友情提醒',
                                        content: '该删除后将不可恢复，是否删除？',
                                        okText: '确定',
                                        okType: 'danger',
                                        cancelText: '取消',
                                        onOk:()=>{
                                            const nowKeys = detailsDate;
                                            const keys = this.state.selectedRows;
                                            for(let i = 0;i<nowKeys.length;i++){
                                                for(let j = 0; j<keys.length;j++){
                                                    if(nowKeys[i] === keys[j]){
                                                        nowKeys.splice(i,1)
                                                    }
                                                }
                                            }
                                            this.props.setDetailsDate(nowKeys);
                                            this.setSelectedRowKeysAndselectedRows(null,{});
                                            this.toggleModalVisible(false)

                                        },
                                        onCancel:()=>{
                                            console.log('Cancel');
                                        },
                                    });
                                }}
                                disabled={!selectedRowKeys}
                                type='danger'>
                                <Icon type="delete" />
                                删除
                            </Button>
                        </div>}
                        style={{marginTop:10}}>

                         <SynchronizeTable data={detailsDate}
                                      updateKey={tableUpDateKey}
                                      tableProps={{
                                          rowKey:record=>record.id,
                                          pagination:true,
                                          bordered:true,
                                          size:'middle',
                                          columns:this.columns,
                                          rowSelection:rowSelection,
                                          footer:(currentPageData) => {
                                              return (
                                                  <Row gutter={24}>
                                                      <Col span={6}>

                                                          金额合计：1357
                                                      </Col>
                                                      <Col span={6}>
                                                          税额合计：1357
                                                      </Col>
                                                      <Col span={6}>
                                                          价税合计：1357
                                                      </Col>
                                                  </Row>
                                              )
                                          }
                                      }}
                         />


                        <PopsModal
                            visible={visible}
                            modalConfig={modalConfig}
                            selectedRowKeys={selectedRowKeys}
                            selectedRows={selectedRows}
                            initData={detailsDate}
                            toggleModalVisible={this.toggleModalVisible}
                            setDetailsDate={this.setDetailsDate.bind(this)}
                            setSelectedRowKeysAndselectedRows={this.setSelectedRowKeysAndselectedRows}
                        />
                    </Card>

                </Form>



            </Modal>
        )
    }
}

export default Form.create()(PopModal)