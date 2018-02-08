/**
 * author       : liuliyuan
 * createTime   : 2018/1/5 11:31
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal,Tabs,message } from 'antd'
import {AsyncTable,AutoFileUpload,FileExport} from '../../../../compoments'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,getFields,getUrlParam} from '../../../../utils'
import PopDifferenceModal from './popModal'
import { withRouter } from 'react-router'
import moment from 'moment';
const TabPane = Tabs.TabPane;
const buttonStyle={
    marginRight:5
}
const spanPaddingRight={
    paddingRight:30
}
const code = {
    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
}
const transformDataStatus = status =>{
    status = parseInt(status,0)
    if(status===1){
        return '暂存';
    }
    if(status===2){
        return '提交'
    }
    return status
}
class InvoiceMatching extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{},

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,
        selectedRows:null,
        visible:false,
        uploaderVisible:false,
        undoUploadVisible:false,
        modalConfig:{
            type:''
        },
        activeKey:'tab1',

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
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
                if(values.authMonth && values.authMonth.length!==0){
                    values.authMonthStar = values.authMonth[0].format('YYYY-MM')
                    values.authMonthEnd= values.authMonth[1].format('YYYY-MM')
                    values.authMonth = undefined;
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
    fetchResultStatus = ()=>{
        request.get('/output/invoice/collection/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data.status,
                        submitDate:data.data.lastModifiedDate
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
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
    refreshTable=()=>{
        this.setState({
            tableUpDateKey:Date.now()
        },()=>{
            this.fetchResultStatus()
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
        });

    }
    tabInitDate = (activeKey)=>{
        const {tableUpDateKey,filters,selectedRowKeys,submitDate,dataStatus} = this.state;
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
        const {search} = this.props.location;
        return (
            <AsyncTable url={url}
                        updateKey={tableUpDateKey}
                        filters={{
                            ...filters,
                            authMonth:(!!search && moment(getUrlParam('authMonthStart'), 'YYYY-MM').format('YYYY-MM')),
                        }}
                        tableProps={{
                            rowKey:record=>record.id,
                            pagination:true,
                            size:'small',
                            columns: this.state.activeKey !=='tab1' ? this.columns.concat(causeDifference) : this.columns,
                            rowSelection:rowSelection,
                            renderFooter:data=>{
                                return (
                                    <div>
                                        <div style={{marginBottom:10}}>
                                            <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>本页合计：</span>
                                            本页金额：<span style={code}>{fMoney(data.pageAmount)}</span>
                                            本页税额：<span style={code}>{fMoney(data.pageTaxAmount)}</span>
                                            本页价税：<span style={code}>{fMoney(data.pageTotalAmount)}</span>
                                        </div>
                                        <div style={{marginBottom:10}}>
                                            <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>总计：</span>
                                            总金额：<span style={code}>{fMoney(data.allAmount)}</span>
                                            总税额：<span style={code}>{fMoney(data.allTaxAmount)}</span>
                                            总价税：<span style={code}>{fMoney(data.allTotalAmount)}</span>
                                        </div>
                                    </div>
                                )
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.taxSubjectId!==nextProps.taxSubjectId){
            this.initData()
        }
    }
    render() {
        const {selectedRowKeys,selectedRows,visible,dataStatus,submitDate} = this.state;
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
                                        label:'开票日期',
                                        fieldName:'billingDate',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                            format:'YYYY-MM',
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue: (disabled && (!!search && moment(getUrlParam('authMonthStart'), 'YYYY-MM'))) || undefined,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }

                            <Col span={18} style={{textAlign:'right'}}>
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
                            dataStatus && this.state.activeKey !=='tab3' && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
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
                                <SubmitOrRecall type={1} url="/income/invoice/marry/main/submit" onSuccess={this.refreshTable} />
                                <SubmitOrRecall type={2} url="/income/invoice/marry/main/revoke" onSuccess={this.refreshTable} />
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