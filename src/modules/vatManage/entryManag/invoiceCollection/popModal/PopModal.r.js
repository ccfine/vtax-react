/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Card,Icon,message,Spin} from 'antd';
import {request,regRules,fMoney,requestDict,getFields} from '../../../../../utils'
import {SynchronizeTable} from '../../../../../compoments'
import PopsModal from './popModal'
import moment from 'moment';
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const dateFormat = 'YYYY-MM-DD'
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
        footerDate:{
            pageAmount:0,
            pageTaxAmount:0,
            pageTotalAmount:0,
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        submitLoading:false,
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
        render:text=>fMoney(text),
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>`${text}%`,
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    }];

    //计算金额的总和
    cellAmountSum=arr=>{
        const form = this.props.form;
        const data = this.state.detailsDate;
        if(data.length >0 ) {
            arr.forEach((n) => {
                let sum = 0;
                data.forEach(item => {
                    const value = `${item[n]}`.replace(/\$\s?|(,*)/g, '');
                    sum += parseFloat(value);
                });
                form.setFieldsValue({
                    [`incomeInvoiceCollectionDO.${n}`]: fMoney(sum),
                });
                this.setState({
                    footerDate:{
                        pageAmount:form.getFieldValue('incomeInvoiceCollectionDO.amount'),
                        pageTaxAmount:form.getFieldValue('incomeInvoiceCollectionDO.taxAmount'),
                        pageTotalAmount:form.getFieldValue('incomeInvoiceCollectionDO.totalAmount'),
                    },
                })
            });
        }else{
            this.setState({
                footerDate:{
                    pageAmount:0,
                    pageTaxAmount:0,
                    pageTotalAmount:0,
                },
            })
            form.setFieldsValue({
                'incomeInvoiceCollectionDO.amount': fMoney(0),
                'incomeInvoiceCollectionDO.taxAmount': fMoney(0),
                'incomeInvoiceCollectionDO.totalAmount': fMoney(0),
            });
        }
    }

    //注册类型:发票类型
    getRegistrationType=()=>{
        requestDict('JXFPLX',result=>{
            this.setState({
                invoiceTypeItem:this.setFormat(result)
            })
        })
    }
    //注册类型:进项结构分类
    getIncomeStructureType=()=>{
        requestDict('JXJGFL',result=>{
            this.setState({
                incomeStructureTypeItem:this.setFormat(result)
            })
        })
    }
    setDetailsDate=detailsDate=>{
        this.setState({
            detailsDate
        },()=>{
            this.cellAmountSum(['amount','taxAmount','totalAmount'])
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    onChange=(selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys,selectedRows)
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
            if (!err) {
                const type = this.props.modalConfig.type;
                const info = this.state.initData;
                let data = {
                    incomeInvoiceCollectionDO:{
                        ...info,
                        ...values.incomeInvoiceCollectionDO,
                        authDate:values.incomeInvoiceCollectionDO.authDate && values.incomeInvoiceCollectionDO.authDate.format('YYYY-MM-DD'),
                        authMonth:values.incomeInvoiceCollectionDO.authMonth && values.incomeInvoiceCollectionDO.authMonth.format('YYYY-MM'),
                        billingDate:values.incomeInvoiceCollectionDO.billingDate && values.incomeInvoiceCollectionDO.billingDate.format('YYYY-MM-DD'),
                        amount:values.incomeInvoiceCollectionDO.amount && parseFloat(`${values.incomeInvoiceCollectionDO.amount}`.replace(/\$\s?|(,*)/g, '')),
                        taxAmount:values.incomeInvoiceCollectionDO.taxAmount && parseFloat(`${values.incomeInvoiceCollectionDO.taxAmount}`.replace(/\$\s?|(,*)/g, '')),
                        totalAmount:values.incomeInvoiceCollectionDO.totalAmount && parseFloat(`${values.incomeInvoiceCollectionDO.totalAmount}`.replace(/\$\s?|(,*)/g, '')),
                    },
                    list:this.checkeDetailsDateId(this.state.detailsDate)
                }

                console.log(data);
                debugger


                this.setState({
                    submitLoading: true
                })
                if (type === 'add') {
                    request.post('/income/invoice/collection/save', data
                    )
                        .then(({data}) => {
                            this.setState({ submitLoading: false })
                            if (data.code === 200) {
                                message.success('新增成功！', 4)
                                //新增成功，关闭当前窗口,刷新父级组件
                                this.props.toggleModalVisible(false);
                                this.props.refreshTable();
                            } else {
                                message.error(data.msg, 4)
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.setState({ submitLoading: false })

                        })
                }

                if (type === 'edit') {

                    request.put('/income/invoice/collection/update', data
                    )
                        .then(({data}) => {
                            this.setState({ submitLoading: false })
                            if (data.code === 200) {
                                message.success('编辑成功！', 4);
                                //编辑成功，关闭当前窗口,刷新父级组件
                                this.props.toggleModalVisible(false);
                                this.props.refreshTable();

                            } else {
                                message.error(data.msg, 4);
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.setState({ submitLoading: false })
                        })
                }
            }
        })
    }

    fetch = id=> {
        request.get(`/income/invoice/collection/get/${id}`,{
        })
            .then(({data}) => {
                if(data.code===200){
                    this.setState({
                        initData:{...data.data.incomeInvoiceCollectionDO},
                        detailsDate:[...data.data.list],
                    },()=>{
                        this.cellAmountSum(['amount','taxAmount','totalAmount']);
                    })
                }else{
                    message.error(data.msg, 4);
                }
            });
    }

    checkeDetailsDateId = (data)=>{
        return data.map((item)=>{
            return {
                amount:parseFloat(`${item.amount}`.replace(/\$\s?|(,*)/g, '')),
                goodsServicesName:item.goodsServicesName,
                parentId:item.parentId,
                qty:item.qty,
                specificationModel:item.specificationModel,
                taxAmount:parseFloat(`${item.taxAmount}`.replace(/\$\s?|(,*)/g, '')),
                taxRate:item.taxRate,
                totalAmount:parseFloat(`${item.totalAmount}`.replace(/\$\s?|(,*)/g, '')),
                unit:item.unit,
                unitPrice:parseFloat(`${item.unitPrice}`),
                id: (item.id.indexOf('t') > -1) ? null : item.id
            }
        })
    }
    //设置select值名不同
    setFormat=data=>{
        return data.map(item=>{
            return{
                ...item,
                value:item.id,
                text:item.name
            }
        })
    }
    componentDidMount(){
        this.getRegistrationType()
        this.getIncomeStructureType()
    }
    componentWillReceiveProps(nextProps){
        //console.log(nextProps)
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
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig,detailsDate,initData,footerDate} = this.state;
        const props = this.props;
        let title='';
        let disabled =  props.modalConfig.type ==='view';
        let shouldShowDefaultData = false;
        if(props.modalConfig.type==='edit' || props.modalConfig.type==='view'){
            shouldShowDefaultData = true;
        }
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
            default:
                title = '添加';
                break;
        }
        const max20={
            max:regRules.input_length_20.max, message: regRules.input_length_20.message,
        }
        const max50={
            max:regRules.input_length_50.max, message: regRules.input_length_50.message,
        }
        const rowSelection = {
            type:'radio',
            width:50,
            fixed:true,
            scroll:{ x: 900 },
            selectedRowKeys,
            onChange: this.onChange
        };
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
                style={{ top: 50 }}
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
                <Spin spinning={this.state.submitLoading}>
                    <Form onSubmit={this.handleSubmit} style={{height:'400px',overflowY:'scroll'}}>
                        <Card>
                            <Row>
                                {
                                    getFields(this.props.form,[
                                        {
                                            label: '纳税主体',
                                            fieldName: 'incomeInvoiceCollectionDO.mainId',
                                            type: 'taxMain',
                                            span: 12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions: {
                                                initialValue: initData.mainId,
                                                rules: [
                                                    {
                                                        required: true, message: '请选择纳税主体',
                                                    }
                                                ],
                                            }
                                        },{
                                            label:'进项结构分类',
                                            fieldName:'incomeInvoiceCollectionDO.incomeStructureType',
                                            type:'select',
                                            span:12,
                                            formItemStyle,
                                            options:this.state.incomeStructureTypeItem,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.incomeStructureType,
                                                rules: [
                                                    {
                                                        required: true, message: '请选择进项结构分类',
                                                    }
                                                ],
                                            }
                                        },{
                                            label:'发票类型',
                                            fieldName:'incomeInvoiceCollectionDO.invoiceType',
                                            type:'select',
                                            span:12,
                                            formItemStyle,
                                            options:this.state.invoiceTypeItem,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.invoiceType,
                                                rules: [
                                                    {
                                                        required: true, message: '请选择发票类型',
                                                    }
                                                ],
                                            }
                                        },{
                                            label:'发票号码',
                                            fieldName:'incomeInvoiceCollectionDO.invoiceNum',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.invoiceNum,
                                                rules: [
                                                    {
                                                        required: true, message: '请输入发票号码',
                                                    },{
                                                        ...max20
                                                    }
                                                ],
                                            }
                                        },{
                                            label:'发票代码',
                                            fieldName:'incomeInvoiceCollectionDO.invoiceCode',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.invoiceCode,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入发票号码'
                                                    },{
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'开票日期',
                                            fieldName:'incomeInvoiceCollectionDO.billingDate',
                                            type:'datePicker',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:shouldShowDefaultData ? moment(initData.billingDate, dateFormat) : undefined,
                                                rules:[
                                                    {
                                                        required: true,
                                                        message: '请选择开票日期'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'认证月份',
                                            fieldName:'incomeInvoiceCollectionDO.authMonth',
                                            type:'monthPicker',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:shouldShowDefaultData ? moment(initData.authMonth, dateFormat) : undefined,
                                                rules:[
                                                    {
                                                        required: true,
                                                        message: '请选择认证月份'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'认证时间',
                                            fieldName:'incomeInvoiceCollectionDO.authDate',
                                            type:'datePicker',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:shouldShowDefaultData ? moment(initData.authDate, dateFormat) : undefined,
                                                rules:[
                                                    {
                                                        required: true,
                                                        message: '请选择认证时间'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'销货单位名称',
                                            fieldName:'incomeInvoiceCollectionDO.sellerName',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.sellerName,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入销货单位名称'
                                                    },{
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'纳税人识别号',
                                            fieldName:'incomeInvoiceCollectionDO.sellerTaxNum',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.sellerTaxNum,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入纳税人识别号'
                                                    },{
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'地址',
                                            fieldName:'incomeInvoiceCollectionDO.address',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.address,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入地址'
                                                    },{
                                                        ...max50
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'电话',
                                            fieldName:'incomeInvoiceCollectionDO.phone',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.phone,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入电话'
                                                    },{
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'开户行',
                                            fieldName:'incomeInvoiceCollectionDO.bank',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.bank,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入开户行'
                                                    },{
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        }, {
                                            label: '账号',
                                            fieldName: 'incomeInvoiceCollectionDO.account',
                                            type: 'input',
                                            span: 12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions: {
                                                initialValue: initData.account,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入账号'
                                                    }, {
                                                        ...max20
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'金额',
                                            fieldName:'incomeInvoiceCollectionDO.amount',
                                            type:'numeric',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                placeholder:'金额数据来源于发票明细',
                                                disabled:true,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.amount,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'金额数据来源于发票明细'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'税额',
                                            fieldName:'incomeInvoiceCollectionDO.taxAmount',
                                            type:'numeric',
                                            span:12,
                                            formItemStyle,
                                            componentProps:{
                                                placeholder:'税额数据来源于发票明细',
                                                disabled:true,
                                                valueType:'int',
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.taxAmount,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'税额数据来源于发票明细'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'价税合计',
                                            fieldName:'incomeInvoiceCollectionDO.totalAmount',
                                            type:'numeric',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                placeholder:'价税合计数据来源于发票明细',
                                                disabled:true,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.totalAmount,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'价税合计数据来源于发票明细'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'备注',
                                            fieldName:'incomeInvoiceCollectionDO.remark',
                                            type:'textArea',
                                            span:24,
                                            formItemStyle:{
                                                labelCol:{
                                                    span:4
                                                },
                                                wrapperCol:{
                                                    span:19
                                                }
                                            },
                                            componentProps: {
                                                disabled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.remark,
                                                rules:[
                                                    {
                                                        max:regRules.textarea_length_100.max, message: regRules.textarea_length_100.message,
                                                    }
                                                ]
                                            }
                                        }
                                    ])
                                }
                            </Row>
                        </Card>

                        <Card
                            title="发票明细"
                            extra={type !== 'view' && <div>
                                <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                                    <Icon type="file-add" />
                                    新增明细
                                </Button>
                                <Button size="small" onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                                    <Icon type="edit" />
                                    编辑
                                </Button>
                                <Button
                                    size="small"
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
                                                this.setDetailsDate(nowKeys);
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

                            <SynchronizeTable
                                data={detailsDate}
                                updateKey={tableUpDateKey}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    bordered:true,
                                    size:'middle',
                                    columns:this.columns,
                                    rowSelection: type !== 'view' && rowSelection,
                                    footerDate:  footerDate,
                                    renderFooter:data=>{
                                      return(
                                          <div>
                                              <div style={{marginBottom:10}}>
                                                  <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                                  金额合计：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                                  税额合计：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                                  价税合计：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                              </div>
                                          </div>
                                      )
                                    },
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
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(PopModal)