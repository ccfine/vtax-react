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
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width:200,
    },{
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
        },
        width:100,
    },{
        title: '购货单位名称',
        dataIndex: 'purchaseName',
        width:200,
    },{
        title: '备注',
        dataIndex: 'remark',
        width: 300,
    },{
        title: '货物或应税劳务名称',
        dataIndex: 'itemName',
        width: 200,
    },{
        title: '规格型号',
        dataIndex: 'spec',
        width: 100,
    },{
        title: '单位',
        dataIndex: 'unit',
        width: 100,
    },{
        title: '数量',
        dataIndex: 'quantity',
        width: 100,
    },{
        title: '单价',
        dataIndex: 'unitPrice',
        className:'text-right',
        render:text=>fMoney(text),
        width: 100,
    },{
        title: '金额',
        dataIndex: 'amountWithoutTax',
        className:'text-right',
        render:text=>fMoney(text),
        width:100,
    },{
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:100,
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        className:'text-right',
        render:text=>fMoney(text),
        width:100,
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:100,
    /*},{
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width:100,
    },{
        title: '购方税号',
        dataIndex: 'purchaseTaxNum',
        width:150,
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        width: 100,
        render:text=>fMoney(text),*/
    },
];
export default class PopInvoiceInformationModal extends Component{
    state={
        tableKey:Date.now(),
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now(),
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
        const filters = {
            ...props.filters,
            ...props.params
        }
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
                <div className='oneLine'>
                <SearchTable
                    searchOption={{
                        fields:searchFields,
                    }}
                    doNotFetchDidMount={true}
                    spinning={searchTableLoading}
                    tableOption={{
                        key:tableKey,
                        pageSize:100,
                        columns:columns,
                        url:`/account/output/billingSale/detail/list?${parseJsonToParams(filters)}`,
                        onSuccess:(params)=>{
                            this.setState({
                                filters:params
                            })
                        },
                        scroll:{ x: 1800, y: 200 },
                        /*extra:<div>
                            <FileExport
                                url='account/output/billingSale/detail/export'
                                title='导出'
                                setButtonStyle={{marginRight:5}}
                                params={{
                                    ...props.filters,
                                    ...filters
                                }}
                            />
                            <TableTotal totalSource={totalSource} />
                        </div>,
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },*/
                    }}

                />
            </div>
            </Modal>
        )
    }
}