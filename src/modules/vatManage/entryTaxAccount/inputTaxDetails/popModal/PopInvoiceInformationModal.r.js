/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */

// 其他扣税凭证 使用了该组件 columns 可配置

import React,{Component} from 'react'
import {Row,Col,Button,Modal } from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,parseJsonToParams} from 'utils'

const searchFields = [
    {
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
]
const columns = [
    {
        title: '数据来源',
        dataIndex: 'sourceType',
        width:'5%',
        render:text=>{
            text = parseInt(text,0)
            if(text===1){
                return '手工采集'
            }
            if(text===2){
                return '外部导入'
            }
            return ''
        },
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
        width:'15%',
    }, {
        title: '发票类型',
        dataIndex: 'invoiceType',
        width:'5%',
        render:text=>{
            if(text==='s'){
                return '专票'
            }
            if(text==='c'){
                return '普票'
            }
            return text;
        }
    },{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:'5%',
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:'10%',
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'5%',
    },{
        title: '认证月份',
        dataIndex: 'authMonth',
        width:'5%',
    },{
        title: '认证时间',
        dataIndex: 'authDate',
        width:'5%',
    },{
        title: '销售单位名称',
        dataIndex: 'sellerName',
        width:'15%',
    },{
        title: '纳税人识别号',
        dataIndex: 'sellerTaxNum',
        width:'10%',
    },{
        title: '金额',
        dataIndex: 'amount',
        className: "table-money",
        width:'5%',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        className: "table-money",
        width:'8%',
        render:text=>fMoney(text),

    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        className: "table-money",
        width:'8%',
        render:text=>fMoney(text),
    }
];

export default class PopInvoiceInformationModal extends Component{
    state={
        tableKey:Date.now(),
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
            },200)
        }
    }
    render(){
        const {searchTableLoading,tableKey} = this.state;
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{ top: 50 }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
                <div className='oneLine'>
                    <SearchTable
                        searchOption={{
                            fields:searchFields,
                        }}
                        doNotFetchDidMount={true}
                        spinning={searchTableLoading}
                        tableOption={{
                            key:tableKey,
                            cardProps: {
                                title: "发票信息列表",
                            },
                            pageSize:100,
                            columns: this.props.columns || columns,
                            url:`/income/invoice/collection/detailList?${parseJsonToParams(props.filters)}`,
                            scroll:{ x: '200%', y: 200},
                        }}
                    />
                </div>
            </Modal>
        )
    }
}
