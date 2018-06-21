/**
 * Created by liuliyuan on 2017/12/21.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Card,Icon,message,Spin} from 'antd';
import {request,regRules,fMoney,getFields} from 'utils'
import {SynchronizeTable} from 'compoments'
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
        loaded:true,
        selectedRowKeys:null,
        selectedRows:{},
        visible:false,
        modalConfig:{
            type:''
        },
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
        render:text=>text? `${text}%`: text,
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    }];

    getAuthFlag=(flag)=>{
        //是否需要认证:1需要，0不需要';
        let res= ''
        switch (parseInt(flag,0)){
            case 1:
                res = '需要'
                break
            case 0:
                res = '不需要'
                break
            default:
        }
        return res;
    }

    getAuthStatus=(status)=>{
        // 认证标记:认证结果1:认证成功;2:认证失败;0:无需认证'
        let res= ''
        switch (parseInt(status,0)){
            case 1:
                res = '认证成功'
                break
            case 2:
                res = '认证失败'
                break
            case 0:
                res = '无需认证'
                break
            default:
        }
        return res;
    }

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
    setDetailsDate=detailsDate=>{
        this.setState({
            detailsDate
        },()=>{
            this.setState({
                tableUpDateKey:Date.now(),
            },()=>{
                this.cellAmountSum(['amount','taxAmount','totalAmount'])
            })
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    onChange=(selectedRowKeys, selectedRows) => {
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

    fetch = id=> {
        this.setState({ loaded: false });
        request.get(`/income/invoice/collection/get/${id}`,{
        })
            .then(({data}) => {

                if(data.code===200){
                    this.setState({
                        initData:{...data.data.incomeInvoiceCollectionDO},
                        detailsDate:[...data.data.list],
                        loaded: true,
                    },()=>{
                        this.cellAmountSum(['amount','taxAmount','totalAmount']);
                    })
                }else{
                    this.setState({
                        loaded: true
                    });
                    message.error(data.msg, 4);
                }

            }).catch(err=>{
                message.error(err.message)
                this.setState({
                    loaded: true
                });
            });
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
            this.fetch(nextProps.modalConfig.id, nextProps)
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig,detailsDate,initData,footerDate,loaded} = this.state;
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
                title = '新增';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                disabled=true;
                break;
            default:
                title = '新增';
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
                style={{ top: '5%' }}
                bodyStyle={{maxHeight:500,overflowY:'auto'}}
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
                    <Form onSubmit={this.handleSubmit}>
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                            label:'应税项目',
                                            fieldName:'incomeInvoiceCollectionDO.taxableProject',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled,
                                                placeholder:disabled?' ':undefined,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.taxableProject,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入应税项目'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'项目编码',
                                            fieldName:'incomeInvoiceCollectionDO.projectNum',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled,
                                                placeholder:disabled?' ':undefined,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.projectNum,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入项目编码'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'项目名称',
                                            fieldName:'incomeInvoiceCollectionDO.projectName',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps: {
                                                disabled,
                                                placeholder:disabled?' ':undefined,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:initData.projectName,
                                                rules:[
                                                    {
                                                        required:true,
                                                        message:'请输入项目名称s'
                                                    }
                                                ]
                                            }
                                        },{
                                            label:'进项结构分类',
                                            fieldName:'incomeInvoiceCollectionDO.incomeStructureType',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            //options:this.state.incomeStructureTypeItem,
                                            componentProps: {
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                            options:[
                                                {value:'s',text:'增值税专用发票'},
                                                {value:'c',text:'增值税普通发票'}
                                            ],
                                            componentProps: {
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                                disabled:true
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
                                            label:'认证标记',
                                            fieldName:'incomeInvoiceCollectionDO.authStatus',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps:{
                                                disabled,
                                                placeholder:disabled?' ':undefined,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:this.getAuthStatus(initData.authStatus)
                                            },
                                        },{
                                            label:'是否需要认证',
                                            fieldName:'incomeInvoiceCollectionDO.authFlag',
                                            type:'input',
                                            span:12,
                                            formItemStyle,
                                            componentProps:{
                                                disabled,
                                                placeholder:disabled?' ':undefined,
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:this.getAuthFlag(initData.authFlag)
                                            },
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
                                                disabled,
                                                placeholder:disabled?' ':undefined,
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
                                    <Icon type="plus" />
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
                                loaded={loaded}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    bordered:true,
                                    size:'small',
                                    columns:this.columns,
                                    rowSelection: type !== 'view'?rowSelection:null,
                                    footerDate:  footerDate,
                                    renderFooter:data=>{
                                      return(
                                          <div className="footer-total">
                                              <div className="footer-total-meta">
                                                  <div className="footer-total-meta-title">
                                                      <label>本页合计：</label>
                                                  </div>
                                                  <div className="footer-total-meta-detail">
                                                      金额合计：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                                      税额合计：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                                      价税合计：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                                  </div>
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