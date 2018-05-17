/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal } from 'antd'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney} from 'utils'
const searchFields = [
    {
        label:'凭证号',
        fieldName:'invoiceNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
]
const columns = [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
        width:180,
    }, {
        title: '项目分期代码',
        dataIndex: 'invoiceTypeName',
        width:180,
    },{
        title: '项目分期',
        dataIndex: 'invoiceCode',
        width:180,
    },{
        title: '凭证号日期',
        dataIndex: 'invoiceNum',
        width:180,
    },{
        title: '凭证号',
        dataIndex: 'billingDate',
        width:100,
    },{
        title: '凭证摘要',
        dataIndex: 'authMonth',
        width:70,
    },{
        title: '借方科目名称',
        dataIndex: 'authDate',
        width:100,
    },{
        title: '借方科目代码',
        dataIndex: 'sellerName',
        width:180,
    },{
        title: '借方金额',
        dataIndex: 'amount',
        width:100,
        render:text=>fMoney(text),
    },{
        title: '扣税凭证类型',
        dataIndex: 'sellerTaxNum',
        width:180,
    }
];

export default class VoucherPopModal extends Component{
    state={
        tableKey:Date.now(),
        totalSource:{},
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
        const {searchTableLoading,tableKey,totalSource} = this.state;
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
                                title: "预缴税款台账",
                            },
                            pageSize:10,
                            columns:columns,
                            url:'/income/invoice/collection/list',
                            scroll:{ x: '210%'},
                            extra:<div>
                                <TableTotal totalSource={totalSource} />
                            </div>,
                            onTotalSource: (totalSource) => {
                                this.setState({
                                    totalSource
                                })
                            },
                        }}
                    />
            </Modal>
        )
    }
}
