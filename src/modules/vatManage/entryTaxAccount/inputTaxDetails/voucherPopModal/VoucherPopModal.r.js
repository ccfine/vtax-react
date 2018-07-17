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
        label:'凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:8,
        componentProps:{ }
    }
]
const columns = [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
        //width:180,
    }, {
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        //width:180,
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
        //width:180,
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
        //width:180,
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        //width:100,
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        //width:70,
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        //width:100,
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        //width:180,
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        //width:100,
        render:text=>fMoney(text),
        className: "table-money"
    },{
        title: '扣税凭证类型',
        dataIndex: 'voucherType',
        //width:180,
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
                onCancel={()=>props.toggleModalVoucherVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>props.toggleModalVoucherVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>
                    <SearchTable
                        searchOption={{
                            fields:searchFields
                        }}
                        doNotFetchDidMount={true}
                        spinning={searchTableLoading}
                        tableOption={{
                            key:tableKey,
                            cardProps: {
                                title: "凭证信息列表",
                            },
                            pageSize:100,
                            columns:columns,
                            url:`/account/income/taxDetail/taxDetailVoucherList?${parseJsonToParams(filters)}`,
                            scroll:{ x: '140%'},
                        }}
                    />
            </Modal>
        )
    }
}
