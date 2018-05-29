/**
 * Created by liurunbin on 2018/1/11.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-29 11:49:36
 *
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal,message,Button,Icon} from 'antd'
import {fMoney,listMainResultStatus,composeBotton,requestResultStatus,request} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import ManualMatchRoomModal from './addDataModal'
import moment from 'moment';
const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const searchFields=(disabled,declare)=> {
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'mainId',
            span:6,
            componentProps:{
                disabled,
            },
            formItemStyle,
            fieldDecoratorOptions:{
                initialValue: (disabled && declare.mainId) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            },
        },
        {
            label: '开票日期',
            type: 'monthPicker',
            span:6,
            fieldName: 'authMonth',
            componentProps:{
                disabled,
            },
            formItemStyle,
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
        {
            label: '货物名称',
            type: 'input',
            span:6,
            fieldName: 'commodityName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '购货单位名称',
            type: 'input',
            span:6,
            fieldName: 'purchaseName',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '发票号码',
            type: 'input',
            span:6,
            fieldName: 'invoiceNum',
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '税率',
            type: 'numeric',
            span:6,
            fieldName: 'taxRate',
            formItemStyle,
            componentProps: {
                valueType: 'int'
            }
        }
    ]
}
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
    {
        title:'货物名称',
        dataIndex:'commodityName'
    },
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
        dataIndex:'taxRate'
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

class NeedNotMatchInvoices extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        filters:{

        },
        selectedRowKeys:[],
        revokeLoading:false,

        searchTableLoading:false,

        /**
         *修改状态
         * */
        statusParam:'',
        
        totalSource:undefined,
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/output/invoice/collection/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    backOutData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要撤销选中的数据？',
            okText: '确定',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.setState({revokeLoading:true})
                request.put('/output/invoice/marry/unwanted/revoke',this.state.selectedRowKeys).then(({data})=>{
                    this.setState({revokeLoading:false})
                    if(data.code===200){
                        message.success('撤销成功！');
                        this.refreshTable();
                    }else{
                        message.error(`撤销失败:${data.msg}`)
                    }
                }).catch(err=>{
                    message.error(err.message)
                    this.setState({revokeLoading:false})
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    render(){
        const {visible,tableKey,statusParam,totalSource,selectedRowKeys,revokeLoading} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        style:{
                            borderTop:0
                        },
                        className:''
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    url:'/output/invoice/marry/unwanted/list',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }{
                            (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'add',
                                userPermissions:[],
                                onClick: ()=>this.toggleModalVisible(true)
                            }],statusParam)
                        }
                        {(disabled && declare.decAction==='edit') && <Button size="small" loading={revokeLoading} onClick={this.backOutData} disabled={selectedRowKeys.length === 0}><Icon type="rollback" />撤销</Button>}
                        <TableTotal totalSource={totalSource} />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:'150%'
                    },
                    cardProps:{
                        title:<span><label className="tab-breadcrumb">销项发票匹配 / </label>无需匹配的发票列表</span>,
                    },
                    onRowSelect:(disabled && declare.decAction==='edit')?(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    }:undefined,
                }}
            >
                <ManualMatchRoomModal title="新增信息" refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(NeedNotMatchInvoices)
