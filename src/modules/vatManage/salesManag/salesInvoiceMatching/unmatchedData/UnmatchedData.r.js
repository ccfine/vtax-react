/**
 * Created by liurunbin on 2018/1/11.
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import ManualMatchRoomModal from './manualMatchRoomModal.r'
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
            label: '开票月份',
            type: 'monthPicker',
            fieldName: 'authMonth',
            span:6,
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
            label: '购货单位名称',
            type: 'input',
            fieldName: 'purchaseName',
            span:6,
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '发票号码',
            type: 'input',
            fieldName: 'invoiceNum',
            span:6,
            formItemStyle,
            fieldDecoratorOptions: {}
        },
        {
            label: '税率',
            type: 'numeric',
            fieldName: 'taxRate',
            span:6,
            formItemStyle,
            componentProps: {
                valueType: 'int'
            }
        }
    ]
}

const getColumns = (context,disabled) =>{
    let operates = (disabled && parseInt(context.state.statusParam.status, 0) === 1)?[{
        title: '操作',
        key: 'actions',
        fixed:true,
        className:'text-center',
        width:'50px',
        render: (text, record) => composeBotton([{
            type:'action',
            title:'手工匹配',
            userPermissions:['1215006'],
            style:{color: '#1890ff'},
            icon:'check-circle-o',
            onSuccess:() => {
                context.setState({
                    visible: true,
                    selectedData: record
                })
            }
        }])
    }]:[];
    return [
        ...operates
     ,
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum',
        width:'12%',
    },
    {
        title: '购货单位名称',
        dataIndex: "purchaseName",
        width:'8%',
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票代码</p>
                <p className="apply-form-list-p2">发票号码</p>
            </div>
        ),
        dataIndex: "invoiceCode",
        width:'6%',
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceNum}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票类型</p>
                <p className="apply-form-list-p2">开票日期</p>
            </div>
        ),
        dataIndex: "invoiceType",
        width:70,
        render: (text, record) => {
            let typeText = '';
            if(text==='s'){
                typeText = '专票'
            }
            if(text==='c'){
                typeText = '普票'
            }
            return (
                <div>
                    <p className="apply-form-list-p1">{typeText}</p>
                    <p className="apply-form-list-p2">{record.billingDate}</p>
                </div>
            )
        }
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">金额</p>
                <p className="apply-form-list-p2">税额</p>
            </div>
        ),
        dataIndex: "amount",
        className:'table-money',
        width:'6%',
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">{fMoney(record.taxAmount)}</p>
            </div>
        )
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        render:text=>text? `${text}%`: text,
        className:'text-right',
        width:60,
    },
    {
        title:'价税合计',
        dataIndex:'totalAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'6%',
    },
    {
        title:'匹配时间',
        dataIndex:'marryTime',
        width:120,
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">客户名称</p>
                <p className="apply-form-list-p2">身份证号/纳税识别码</p>
            </div>
        ),
        dataIndex: "customerName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.taxIdentificationCode}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">楼栋名称</p>
                <p className="apply-form-list-p2">单元</p>
            </div>
        ),
        dataIndex: "buildingName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.element}</p>
            </div>
        ),
        width:'10%',
    }, {
        title:'路址',
        dataIndex:'htRoomName',
        width:'5%',
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">房号</p>
                <p className="apply-form-list-p2">房间编码</p>
            </div>
        ),
        dataIndex: "roomNumber",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.roomCode}</p>
            </div>
        ),
        width:'5%',
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money',
        width:'6%',
    },
    {
        title:'匹配方式',
        dataIndex:'matchingWay',
        render:text=>{
            text = parseInt(text,0);//0:手动匹配,1:自动匹配
            if(text === 0){
                return '手动匹配';
            }else if(text ===1){
                return '自动匹配';
            }else{
                return ''
            }
        },
        width:60,
    },
];
}
class UnmatchedData extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        /*filters:{},*/
        selectedData:{},

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
    fetchResultStatus = ()=>{
        requestResultStatus('/output/invoice/marry/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    render(){
        const {visible,tableKey,selectedData,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                style={{
                    marginTop:-16
                }}
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
                    columns:getColumns(this,disabled),
                    url:'/output/invoice/marry/unmatched/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {/*{
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'fileExport',
                                url:'output/invoice/marry/unmatched/export',
                                params:filters,
                                title:'导出未匹配发票',
                                userPermissions:['1215005'],
                                onSuccess:this.refreshTable
                            }],statusParam)
                        }*/}
                        <TableTotal type={2} totalSource={totalSource} />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:1300,
                        y:window.screen.availHeight-430,
                    },
                    cardProps:{
                        title:<span><label className="tab-breadcrumb">销项发票匹配 / </label>未匹配的发票列表</span>,
                    },
                }}
            >
                <ManualMatchRoomModal title="手工匹配房间" selectedData={selectedData} refreshTable={this.props.refreshTabs} visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default UnmatchedData