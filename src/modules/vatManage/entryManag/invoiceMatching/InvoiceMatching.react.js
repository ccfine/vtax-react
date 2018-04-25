/**
 * author       : liuliyuan
 * createTime   : 2018/1/5 11:31
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,Tabs,message } from 'antd'
import {AsyncTable,FileImportModal,FileExport} from 'compoments'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,getFields,getUrlParam,listMainResultStatus} from 'utils'
import PopDifferenceModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const TabPane = Tabs.TabPane;
const buttonStyle={
    marginRight:5
}
const fields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:15
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
class InvoiceMatching extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{},

        /**
         *修改状态和时间
         * */
        statusParam:{},

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tabsUpdateKey:Date.now(),
        tab1UpdateKey:Date.now(),
        tab2UpdateKey:Date.now(),
        tab3UpdateKey:Date.now(),
        dataSource:[],
        selectedRowKeys:null,
        selectedRows:null,
        visible:false,
        uploaderVisible:false,
        undoUploadVisible:false,
        modalConfig:{
            type:''
        },
        activeKey:'tab1'
    }
    columns = [
        {
            title: '纳税主体',
            dataIndex: 'mainName',
        },{
            title: '发票代码',
            dataIndex: 'invoiceCode',
        },{
            title: '发票号码',
            dataIndex: 'invoiceNum',
        }, {
            title: '发票类型',
            dataIndex: 'invoiceTypeName',
        },{
            title: '开票日期',
            dataIndex: 'billingDate',
        },{
            title: '认证时间',
            dataIndex: this.state.activeKey !=='tab3' ? 'authMonth' : 'authDate',
        },{
            title: '销售单位名称',
            dataIndex: 'sellerName',
        },{
            title: '纳税人识别号',
            dataIndex: 'sellerTaxNum',
        },{
            title: '金额',
            dataIndex: 'amount',
            render:text=>fMoney(text)
        },{
            title: '税额',
            dataIndex: 'taxAmount',
            render:text=>fMoney(text)
        },{
            title: '价税合计',
            dataIndex: 'totalAmount',
            render:text=>fMoney(text)
        },{
            title: '数据来源',
            dataIndex: 'sourceType',
            render:text=>
            {
                text = parseInt(text,0)
                if(text===1){
                    return this.state.activeKey === 'tab2' ? '喜盈佳' : '手工采集'
                }
                if(text===2){
                    return this.state.activeKey ==='tab2' ? '认证平台' : '外部导入'
                }
                return ''
            }
        }
    ];
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.authMonth){
                    values.authMonth = values.authMonth.format('YYYY-MM')
                }
                this.setState({
                    selectedRowKeys:null,
                    filters:values
                },()=>{
                    this.onTabChange(this.state.activeKey)
                });
            }
        });

    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                filters:{
                    mainId:getUrlParam('mainId') || undefined,
                    authMonth:moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.onTabChange(this.state.activeKey)
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            [`${this.state.activeKey}UpdateKey`]:Date.now(),
            selectedRowKeys:null,
            selectedRows:null
        },()=>{
            this.updateStatus();
        })
    }
    showModal=type=>{
        if(type === 'edit'){
            let sourceType = parseInt(this.state.selectedRows[0].sourceType,0);
            if(sourceType === 2 ){
                const ref = Modal.warning({
                    title: '友情提醒',
                    content: '该发票信息是外部导入，无法修改！',
                    okText: '确定',
                    onOk:()=>{
                        ref.destroy();
                    }
                });
            }else{
                this.toggleModalVisible(true)
                this.setState({
                    modalConfig:{
                        type,
                        id:this.state.selectedRowKeys
                    }
                })
            }
        }else{
            this.toggleModalVisible(true)
            this.setState({
                modalConfig:{
                    type,
                    id:this.state.selectedRowKeys
                }
            })
        }
    }
    onTabChange = (activeKey) => {
        this.setState({
            activeKey,
        },()=>{
            if(JSON.stringify(this.state.filters) !== "{}"){
                this.refreshTable(activeKey)
            }
        });

    }
    tabInitDate = (activeKey,tableUpDateKey)=>{
        const {filters,statusParam} = this.state;
        let url = '';
        switch (activeKey){
            case 'tab1':
                url = "/income/invoice/marry/completely/list";
                break;
            case 'tab2':
                url = "/income/invoice/marry/unCompletely/list";
                break;
            case 'tab3':
                url = "/income/invoice/marry/unInvoice/list";
                break;
            default :
            //no default
        }
        const causeDifference = {
            title: '差异原因',
            dataIndex: 'causeDifference'
        }
        return (
            <AsyncTable url={url}
                        updateKey={tableUpDateKey}
                        filters={filters}
                        tableProps={{
                            rowKey:record=>record.id,
                            pagination:true,
                            size:'small',
                            columns: this.state.activeKey !=='tab1' ? this.columns.concat(causeDifference) : this.columns,
                            rowSelection:parseInt(statusParam.status, 0) === 1 ? {
                                type: 'radio',
                            } : undefined,
                            onRowSelect:parseInt(statusParam.status, 0) === 1 ? (selectedRowKeys,selectedRows)=>{
                                this.setState({
                                    selectedRowKeys,
                                    selectedRows
                                })
                            } : undefined,
                            renderFooter:data=>{
                                return (
                                    <div className="footer-total">
                                        <div className="footer-total-meta">
                                            <div className="footer-total-meta-title">
                                                <label>本页合计：</label>
                                            </div>
                                            <div className="footer-total-meta-detail">
                                                本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                                本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                                本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                            </div>
                                            <div className="footer-total-meta-title">
                                                <label>总计：</label>
                                            </div>
                                            <div className="footer-total-meta-detail">
                                                总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                                总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                                总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            onDataChange:(dataSource)=>{
                                this.setState({
                                    dataSource
                                })
                            },

                        }} />
        )
    }

    handleMarry=()=>{
        request.put('/income/invoice/marry/marry')
            .then(({data})=>{
                if (data.code === 200) {
                    message.success('数据匹配成功请查询!');
                } else {
                    message.error(data.msg)
                }
            })
    }
    updateStatus=()=>{
        let url='';
        if(this.state.activeKey ==='tab3'){
            url='/income/invoice/collection/listMain'
        }else {
            url='/income/invoice/marry/listMain'
        }
        request.get(url,{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                if(data.code===200){
                    this.setState({
                        statusParam: data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            }
        })
    }

    render() {
        const {tab1UpdateKey,tab2UpdateKey,tab3UpdateKey,selectedRowKeys,selectedRows,visible,dataSource,statusParam} = this.state;
        const {mainId, authMonth} = this.state.filters;
        const disabled1 = !!((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = statusParam && parseInt(statusParam.status, 0) === 2;
        const {search} = this.props.location;
        let disabled = !!(search && search.filters);

        const tabList = [{
            key: 'tab1',
            tab: '完全匹配',
            content:this.tabInitDate('tab1', tab1UpdateKey)
        },{
            key: 'tab2',
            tab: '无法匹配',
            content:this.tabInitDate('tab2', tab2UpdateKey)
        }, {
            key: 'tab3',
            tab: '发票信息不匹配',
            content:this.tabInitDate('tab3', tab3UpdateKey)
        }]

        const FieldsList = [
            {
                label:'纳税主体',
                fieldName:'mainId',
                type:'taxMain',
                span:6,
                componentProps:{
                    disabled
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && getUrlParam('mainId')) || undefined,
                    rules:[
                        {
                            required:true,
                            message:'请选择纳税主体'
                        }
                    ]
                },
            },{
                label:'认证时间',
                type:'monthPicker',
                span:6,
                fieldName:'authMonth',
                componentProps:{
                    disabled,
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                    rules:[
                        {
                            required:true,
                            message:'请选择认证时间'
                        }
                    ]
                }
            }
        ];

        return (
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form, this.state.activeKey ==='tab2' ? FieldsList.concat(
                                    {
                                        label:'发票来源',
                                        type:'select',
                                        span:6,
                                        fieldName:'sourceType',
                                        options:[
                                            {
                                                text:'喜盈佳',
                                                value:'1'
                                            },{
                                                text:'认证平台',
                                                value:'2'
                                            }
                                        ]
                                    }
                                ) : FieldsList)
                            }
                            <Col span={this.state.activeKey==='tab2' ? 6 : 12} style={{textAlign:'right'}}>
                                <Form.Item>
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button
                                    style={{marginLeft:10}}
                                    size='small'
                                    onClick={()=>{
                                        this.props.form.resetFields()
                                        this.setState({
                                            filters:{},
                                            activeKey:'tab1',
                                            dataSource:[],
                                            tabsUpdateKey:Date.now(),
                                        })
                                    }}
                                >
                                    重置
                                </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card
                    extra={<div>
                        {
                            dataSource.length>0 && listMainResultStatus(statusParam)
                        }
                        <FileImportModal
                            url="/income/invoice/marry/upload"
                            title="导入"
                            fields={fields}
                            disabled={disabled2}
                            style={{marginRight:5}} />
                        <FileExport
                            url='income/invoice/marry/download'
                            title="下载导入模板"
                            disabled={disabled2}
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" style={buttonStyle} onClick={this.handleMarry} disabled={disabled2}>
                            <Icon type="database" />
                            数据匹配
                        </Button>
                        {
                            this.state.activeKey !=='tab3' && <span>
                                <SubmitOrRecall type={1} disabled={disabled2} url="/income/invoice/marry/submit" onSuccess={this.refreshTable} />
                                <SubmitOrRecall type={2} disabled={disabled1} url="/income/invoice/marry/revoke" onSuccess={this.refreshTable} />
                            </span>
                        }
                    </div>}
                    style={{marginTop:10}}>


                    <div className="card-container">

                        <Tabs type="card"
                              key={this.state.tabsUpdateKey}
                              activeKey={this.state.activeKey}
                              onChange={(key) => { this.onTabChange(key, 'tab1'); }}
                              tabBarExtraContent={
                                  this.state.activeKey !=='tab1' && <Button size="small" disabled={!selectedRowKeys} onClick={()=>this.toggleModalVisible(true)} style={buttonStyle}>
                                      <Icon type="question" />
                                      差异原因
                                  </Button>
                              }
                        >
                            {
                                tabList.map(item=>{
                                    return (
                                        <TabPane tab={item.tab} key={item.key}>
                                            {item.content}
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </div>
                </Card>

                <PopDifferenceModal
                    title="差异原因"
                    url={this.state.activeKey ==='tab2' ? '/income/invoice/marry/unCompletely/update' : '/income/invoice/marry/unInvoice/update'}
                    visible={visible}
                    selectedRows={selectedRows}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />

            </Layout>
        )
    }
}
export default Form.create()(withRouter(InvoiceMatching))