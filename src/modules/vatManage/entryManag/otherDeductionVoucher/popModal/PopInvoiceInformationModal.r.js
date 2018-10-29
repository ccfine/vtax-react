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
import moment from 'moment'

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
        title: '发票类型',
        dataIndex: 'zefplx',
        width: '80px',
        render: text => {
            if (text === 's') {
                return '专票';
            }
            if (text === 'c') {
                return '普票';
            }
            return text;
        }
    }, {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width: '100px'
    }, {
        title: '发票号码',
        dataIndex: 'invoiceNum',
        width: '100px'
    }, {
        title: '开票日期',
        dataIndex: 'zekprq',
        width: '200px',
        render(text){
            return moment(text).format('YYYY-MM-DD');
        }
    }, {
        title: '认证所属期',
        dataIndex: 'zerzshq',
        width: '200px'
    }, {
        title: '认证时间',
        dataIndex: 'zerzsj',
        width: '200px',
        render(text){
            return moment(text).format('YYYY-MM-DD');
        }
    }, {
        title: '购买方纳税人识别号',
        dataIndex: 'zegmfnsrsbh',
        width: '100px'
    }, {
        title: '金额',
        dataIndex: 'zebhsje',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)
    }, {
        title: '税额',
        dataIndex: 'zese',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)

    }, {
        title: '含税金额',
        dataIndex: 'zehsje',
        className: "table-money",
        width: '80px',
        render: text => fMoney(text)
    }
];

export default class PopInvoiceInformationModal extends Component{
    state={
        tableKey:Date.now(),
    }
    // refreshTable = ()=>{
    //     this.setState({
    //         tableKey:Date.now()
    //     })
    // }
    // componentWillReceiveProps(nextProps){
    //     if(!this.props.visible && nextProps.visible){
    //         //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
    //         setTimeout(()=>{
    //             this.refreshTable()
    //         },200)
    //     }
    // }
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
                        doNotFetchDidMount={false}
                        spinning={searchTableLoading}
                        tableOption={{
                            key:tableKey,
                            cardProps: {
                                title: "发票信息列表",
                            },
                            pageSize:100,
                            columns: columns,
                            url:`/other/tax/deduction/vouchers/list/pools/${this.props.id}?${parseJsonToParams(props.filters)}`,
                            scroll:{ x: '200%', y: 200},
                        }}
                    />
                </div>
            </Modal>
        )
    }
}
