/**
 * Created by liurunbin on 2018/1/11.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-27 16:14:43
 *
 */
import React,{Component} from 'react';
import {Button,Modal,message} from 'antd';
import {request,fMoney} from 'utils'
import {SearchTable} from 'compoments'
import moment from 'moment'
const searchFields = (disabled,declare)=>[
    {
        label:'纳税主体',
        type:'taxMain',
        fieldName:'main',
        componentProps:{
            labelInValue:true,
            disabled,
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
    {
        label:'开票月份',
        fieldName:'authMonth',
        type:'monthPicker',
        componentProps:{
            disabled,
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择开票月份'
                }
            ]
        }
    },
    /*{
        label:'货物名称',
        type:'input',
        fieldName:'commodityName',
        fieldDecoratorOptions:{}
    },*/
    {
        label:'购货单位名称',
        type:'input',
        fieldName:'purchaseName',
        fieldDecoratorOptions:{}
    },
    {
        label:'发票号码',
        type:'input',
        fieldName:'invoiceNum',
        fieldDecoratorOptions:{}
    },
    {
        label:'税率',
        type:'numeric',
        fieldName:'taxRate',
        componentProps:{
            valueType:'int'
        },
    }
]
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum'
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票类型',
        dataIndex:'invoiceType',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },
    // {
    //     title:'货物名称',
    //     dataIndex:'commodityName'
    // },
    {
        title:'开票日期',
        dataIndex:'billingDate',
        width:'75px'
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        render:text=>text? `${text}%`: text,
        className:'text-right'
    },
    {
        title:'税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];

class ManualMatchRoomModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        tableKey:Date.now(),
        selectedRowKeys:[],
        searchTableLoading:false
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.visible){
            this.setState({
                tableKey:Date.now()
            })
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    addDataWithAsync = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否增加选中的数据？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.put('/output/invoice/marry/append/determine',this.state.selectedRowKeys).then(({data})=>{
                    this.toggleSearchTableLoading(false)
                    if(data.code===200){
                        message.success('添加成功！');
                        this.props.toggleModalVisible(false);
                        this.props.refreshTable();
                    }else{
                        message.error(`添加失败:${data.msg}`)
                    }
                }).catch(err=>{
                    message.error(err.message)
                    this.toggleSearchTableLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    render(){
        const props = this.props;
        const {title} = this.props;
        const {tableKey,selectedRowKeys,searchTableLoading} = this.state;
        
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={1000}
                destroyOnClose={true}
                bodyStyle={{
                    backgroundColor:'#fafafa',
                    maxHeight:420,
                    overflowY:'auto',
                }}
                style={{
                    maxWidth:'90%',
                    top:'5%',
                }}
                footer={<div>
                    <Button style={{marginRight:5}} type='primary' onClick={this.addDataWithAsync} disabled={selectedRowKeys.length === 0}>确定</Button>
                    <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                </div>}
                visible={props.visible}
                title={title}>
                <SearchTable
                    spinning={searchTableLoading}
                    searchOption={{
                        fields:searchFields(disabled,declare),
                        getFieldsValues:values=>{
                            this.setState({
                                searchFieldsValues:values
                            })
                        }
                    }}
                    tableOption={{
                        key:tableKey,
                        pageSize:100,
                        columns:columns,
                        onRowSelect:(selectedRowKeys)=>{
                            this.setState({
                                selectedRowKeys
                            })
                        },
                        url:'/output/invoice/marry/unmatched/list',
                        scroll:{
                            x:'180%'
                        },
                        renderFooter:data=>{
                            return(
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
                    }}
                >
                </SearchTable>
            </Modal>
        )
    }
}

export default ManualMatchRoomModal