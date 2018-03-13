/**
 * author       : liuliyuan
 * createTime   : 2018/1/5 11:31
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,Tabs,message } from 'antd'
import {AsyncTable,AutoFileUpload,FileExport} from '../../../../compoments'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,getFields,getUrlParam,listMainResultStatus} from '../../../../utils'
import PopDifferenceModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const TabPane = Tabs.TabPane;
const buttonStyle={
    marginRight:5
}
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
        tableUpDateKey:Date.now(),
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
            render:text=>{
                text = parseInt(text,0)
                if(text===1){
                    return '手工采集'
                }
                if(text===2){
                    return '外部导入'
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
                    this.refreshTable()
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
                this.refreshTable()
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
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
            activeKey
        },()=>{
            if(JSON.stringify(this.state.filters) !== "{}"){
                this.updateStatus();
            }
        });

    }
    tabInitDate = (activeKey)=>{
        const {tableUpDateKey,filters,selectedRowKeys} = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
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
                            rowSelection:rowSelection,
                            renderFooter:data=>{
                                return (
                                    <div className="footer-total">
                                        <div>
                                            <label>本页合计：</label>
                                            本页金额：<span className="amount-code">{fMoney(data.pageAmount)}</span>
                                            本页税额：<span className="amount-code">{fMoney(data.pageTaxAmount)}</span>
                                            本页价税：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                        </div>
                                        <div>
                                            <label>总计：</label>
                                            总金额：<span className="amount-code">{fMoney(data.allAmount)}</span>
                                            总税额：<span className="amount-code">{fMoney(data.allTaxAmount)}</span>
                                            总价税：<span className="amount-code">{fMoney(data.allTotalAmount)}</span>
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
                    message.success('数据匹配成功!');
                    this.refreshTable();
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
        const {selectedRowKeys,selectedRows,visible,dataSource,statusParam} = this.state;
        const tabList = [{
            key: 'tab1',
            tab: '完全匹配',
            content:this.tabInitDate('tab1')
        },{
            key: 'tab2',
            tab: '无法匹配',
            content:this.tabInitDate('tab2')
        }, {
            key: 'tab3',
            tab: '发票信息不匹配',
            content:this.tabInitDate('tab3')
        }]
        const {search} = this.props.location;
        let disabled = !!search;
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
                                getFields(this.props.form,[
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
                                    },
                                ])
                            }
                            <Col span={12} style={{textAlign:'right'}}>
                                <Form.Item>
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
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
                        <AutoFileUpload url={`/income/invoice/marry/upload`} fetchTable_1_Data={this.refreshTable} />
                        <FileExport
                            url='/income/invoice/marry/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" style={buttonStyle} onClick={this.handleMarry}>
                            <Icon type="database" />
                            数据匹配
                        </Button>
                        {
                            this.state.activeKey !=='tab3' && <span>
                                <SubmitOrRecall type={1} url="/income/invoice/marry/submit" onSuccess={this.refreshTable} />
                                <SubmitOrRecall type={2} url="/income/invoice/marry/revoke" onSuccess={this.refreshTable} />
                            </span>
                        }
                    </div>}
                    style={{marginTop:10}}>


                    <div className="card-container">

                        <Tabs type="card"
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
                                        <TabPane tab={item.tab} key={item.key} forceRender={true}>
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