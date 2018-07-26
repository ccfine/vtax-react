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
            title: '发票号码',
            dataIndex: "invoiceNum",
            width:'200px',
        },
        {
            title:'发票类型',
            dataIndex:'invoiceType',
            width:'100px',
            render: (text) => {
                let typeText = '';
                if(text==='s'){
                    typeText = '专票'
                }
                if(text==='c'){
                    typeText = '普票'
                }
                return typeText
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width:'500px',
        },
        {
            title: '金额',
            dataIndex: "amount",
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
        },
        {
            title:'税率',
            dataIndex:'taxRate',
            render:text=>text? `${text}%`: text,
            className:'text-right',
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
            title: '开票日期',
            dataIndex: "billingDate",
            width:'100px',
        },

        /*{
            title: '购货单位名称',
            dataIndex: "purchaseName",
            width:'200px',
        },
        {
            title:'发票代码',
            dataIndex:'invoiceCode',
            width:'200px',
        },
        {
            title:'匹配时间',
            dataIndex:'marryTime',
            width:'100px',
        },
        {
            title:'客户名称',
            dataIndex:'customerName',
            width:'100px',
        },
        {
            title:'身份证号/纳税识别码',
            dataIndex:'taxIdentificationCode',
            width:'200px',
        },
        {
            title:'楼栋名称',
            dataIndex:'buildingName',
            width:'200px',
        },
        {
            title:'单元',
            dataIndex:'element',
            width:'100px',
        },
        {
            title:'路址',
            dataIndex:'htRoomName',
            width:'200px',
        },
        {
            title:'房号',
            dataIndex:'roomNumber',
            width:'100px',
        },
        {
            title:'房间编码',
            dataIndex:'roomCode',
            width:'100px',
        },
        {
            title:'成交总价',
            dataIndex:'totalPrice',
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
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
            width:'100px',
        },*/
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
                    pageSize:100,
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
                        x:1800,
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
export default connect(state=>({
    declare:state.user.get('declare')
}))(UnmatchedData)