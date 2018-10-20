/**
 * Created by liurunbin on 2018/1/11.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-08 10:34:46
 *
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
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
const searchFields=(disabled,declare)=> getFieldValue =>{
    return [
        {
            label: '纳税主体',
            type: 'taxMain',
            fieldName: 'main',
            span:6,
            componentProps:{
                labelInValue:true,
                disabled,
            },
            formItemStyle,
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
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
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
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode',
        width:'150px',
    },
    {
        title: '发票号码',
        dataIndex: "invoiceNum",
        width:'200px',
    },
    /*{
        title:'纳税主体',
        dataIndex:'mainName',
        width:'200px',
    },*/
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
        },
        width:'100px',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        //width:'500px',
    },
    {
        title:'金额',
        dataIndex:'amount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:'100px',
    },
    {
        title:'税额',
        dataIndex:'taxAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum',
        width:'200px',
    },
    {
        title:'开票日期',
        dataIndex:'billingDate',
        width:'100px',
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName',
        width:'200px',
    }
]

class NeedNotMatchInvoices extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        filters:{

        },
        selectedRowKeys:[],
        // revokeLoading:false,

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
            tableKey:Date.now(),
            selectedRowKeys:[],
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/output/invoice/marry/listMain',this.state.filters,result=>{
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
               // this.setState({revokeLoading:true})
                request.put('/output/invoice/marry/unwanted/revoke',this.state.selectedRowKeys).then(({data})=>{
                    //this.setState({revokeLoading:false})
                    if(data.code===200){
                        message.success('撤销成功！');
                        this.props.refreshTabs();
                    }else{
                        message.error(`撤销失败:${data.msg}`)
                    }
                }).catch(err=>{
                    message.error(err.message)
                    //this.setState({revokeLoading:false})
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    render(){
        const {visible,tableKey,statusParam,totalSource,selectedRowKeys} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
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
                backCondition={(filters)=>{
                    this.setState({
                        filters,
                        selectedRowKeys:[],
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/output/invoice/marry/unwanted/list',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }{
                            (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'add',
                                icon:'plus',
                                userPermissions:['1215009'],
                                onClick: ()=>this.toggleModalVisible(true)
                            },{
                                type:'cancel',
                                userPermissions:['1215008'],
                                onClick: ()=>this.backOutData(),
                                icon:'rollback',
                                text:'撤销',
                                selectedRowKeys
                            }],statusParam)
                        }
                        {/* {(disabled && declare.decAction==='edit') && <Button size="small" loading={revokeLoading} onClick={this.backOutData} disabled={selectedRowKeys.length === 0}><Icon type="rollback" />撤销</Button>} */}
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '发票金额', dataIndex: 'allAmount'},
                                        {title: '发票税额', dataIndex: 'allTaxAmount'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:1850,
                        y:window.screen.availHeight-430-(disabled?50:0),
                    },
                    cardProps:{
                        title:<span><label className="tab-breadcrumb">销项发票匹配 / </label>无需匹配的发票列表</span>,
                    },
                    onRowSelect:(disabled && declare.decAction==='edit' && parseInt(statusParam.status, 0) !== 2)?(selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    }:undefined,
                }}
            >
                <ManualMatchRoomModal title="新增信息" refreshTable={this.refreshTable} visible={visible} toggleModalVisible={this.toggleModalVisible} declare={declare}/>
            </SearchTable>
            </div>
        )
    }
}
export default NeedNotMatchInvoices
