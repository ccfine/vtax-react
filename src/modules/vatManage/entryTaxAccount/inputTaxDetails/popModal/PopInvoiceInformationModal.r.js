/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
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
        //width:100,
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
        //width:180,
    }, {
        title: '发票类型',
        dataIndex: 'invoiceType',
        //width:180,
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
        //width:180,
    },{
        title: '发票号码',
        dataIndex: 'invoiceNum',
        //width:180,
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        //width:100,
    },{
        title: '认证月份',
        dataIndex: 'authMonth',
        //width:70,
    },{
        title: '认证时间',
        dataIndex: 'authDate',
        //width:100,
    },{
        title: '销售单位名称',
        dataIndex: 'sellerName',
        //width:180,
    },{
        title: '纳税人识别号',
        dataIndex: 'sellerTaxNum',
        //width:180,
    },{
        title: '金额',
        dataIndex: 'amount',
        //width:100,
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        //width:100,
        render:text=>fMoney(text),

    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        //width:150,
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
                style={{ top: 50 ,maxWidth:'80%'}}
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
                            pageSize:10,
                            columns:columns,
                            url:`/income/invoice/collection/detailList?${parseJsonToParams(props.filters)}`,
                            scroll:{ x: '140%', y: 200},
                        }}
                    />
            </Modal>
        )
    }
}
