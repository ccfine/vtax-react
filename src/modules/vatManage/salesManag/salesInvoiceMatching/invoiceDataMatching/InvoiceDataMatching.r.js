/**
 * Created by liurunbin on 2018/1/9.
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
import {connect} from 'react-redux'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
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
const searchFields=(disabled,declare)=>(getFieldValue,setFieldsValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
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
            label:'开票月份',
            fieldName:'authMonth',
            type:'monthPicker',
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
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'楼栋名称',
            fieldName:'buildingName',
            type:'input',
            span:6,
            formItemStyle
        },
        {
            label:'单元',
            fieldName:'element',
            type:'element',
            span:6,
            formItemStyle
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            span:6,
            formItemStyle
        },
        {
            label:'客户名称',
            fieldName:'customerName',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'纳税人识别号',
            fieldName:'taxIdentificationCode',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'发票号码',
            fieldName:'invoiceNum',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'匹配方式',
            fieldName:'matchingWay',
            type:'select',
            span:6,
            formItemStyle,
            options:[
                {
                    text:'手动匹配',
                    value:'0'
                },
                {
                    text:'自动匹配',
                    value:'1'
                }
            ]
        }
    ]
}
const getColumns = (context,disabled) => {
    let operates = (disabled && parseInt(context.state.statusParam.status,0)===1)?[{
        title: '操作',
        key: 'actions',
        fixed:true,
        className:'text-center',
        width:50,
        render: (text, record) => composeBotton([{
                type:'action',
                title:'解除匹配',
                icon:'disconnect',
                style:{color:'#f5222d'},
                userPermissions:['1215003'],
                onSuccess:()=>{
                    const modalRef = Modal.confirm({
                        title: '友情提醒',
                        content: '是否要解除匹配？',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk:()=>{
                            context.deleteRecord(record.id,()=>{
                                modalRef && modalRef.destroy();
                                context.props.refreshTabs()
                            })
                        },
                        onCancel() {
                            modalRef.destroy()
                        },
                    });
                }}])
    }]:[];
    return [...operates,
    {
        title:'纳税人识别号',
        dataIndex:'purchaseTaxNum',
        /*render:(text,record)=>{
            let color = '#333';
            if(record.taxIdentificationCode !== record.purchaseTaxNum){
                /!**销项发票的纳税识别号与房间交易档案中的纳税识别号出现不完全匹配时，销项发票的纳税识别号标记为红色字体；*!/
                color = '#f5222d';
            }
            if(record.customerName !== record.purchaseName){
                /!**销项发票的购货单位与房间交易档案中的客户，不一致时，销项发票中的购货单位标记为蓝色字体；*!/
                color = '#1890ff';
            }
            if(record.totalAmount !== record.totalPrice){
                /!** 销项发票的价税合计与房间交易档案中的成交总价不一致时，销项发票中的价税合计标记为紫色字体；*!/
                color = '#6f42c1'
            }
            return <span style={{color}}>{text}</span>
        }*/
    },
    {
        title:'购货单位名称',
        dataIndex:'purchaseName',
        width:'6%',
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票号码</p>
                <p className="apply-form-list-p2">发票代码</p>
            </div>
        ),
        dataIndex: "invoiceNum",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.invoiceCode}</p>
            </div>
        ),
        width:'6%',
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">发票类型</p>
                <p className="apply-form-list-p2">开票日期</p>
            </div>
        ),
        dataIndex: "invoiceType",
        render: (text, record) => {
            let txt = '';
            if(text==='s'){
                txt = '专票'
            }
            if(text==='c'){
                txt = '普票'
            }
            return (
                <div>
                    <p className="apply-form-list-p1">{txt}</p>
                    <p className="apply-form-list-p2">{record.billingDate}</p>
                </div>
            )
        },
        width:80,
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
        className:'text-right',
        width:40,
        render:text=>text? `${text}%`: text,
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
        width:'10%',
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
        width:'16%',
        dataIndex: "buildingName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.element}</p>
            </div>
        )
    }, {
        title:'路址',
        dataIndex:'htRoomName',
        width:'8%',
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">房号</p>
                <p className="apply-form-list-p2">房间编码</p>
            </div>
        ),
        width:'6%',
        dataIndex: "roomNumber",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.roomCode}</p>
            </div>
        )
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
        width:60,
        render:text=>{
            text = parseInt(text,0);//0:手动匹配,1:自动匹配
            if(text === 0){
                return '手动匹配';
            }else if(text ===1){
                return '自动匹配';
            }else{
                return ''
            }
        }
    },
]
}
class InvoiceDataMatching extends Component{
    state={
        tableKey:Date.now(),
        filters:{
        },

        /**
         *修改状态
         * */
        statusParam:'',
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/output/invoice/marry/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    deleteRecord = (id,cb) => {
        request.delete(`/output/invoice/marry/already/delete/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    message.success('解除成功!');
                    cb && cb()
                }else{
                    message.error(`解除匹配失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {tableKey,filters,matching,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                style={{
                    marginTop:-16
                }}
                spinning={matching}
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
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    url:'/output/invoice/marry/already/list',
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters)!=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'output/invoice/marry/already/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1211002'],
                            }])
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'match',
                                url:'/output/invoice/marry/already/automatic',
                                params:filters,
                                userPermissions:['1215002'],
                                onSuccess:()=>{
                                    this.props.refreshTabs()
                                }
                            },{
                                type:'submit',
                                url:'/output/invoice/marry/submit',
                                params:filters,
                                userPermissions:['1215000'],
                                onSuccess:()=>{
                                    this.props.refreshTabs()
                                }
                            },{
                                type:'revoke',
                                url:'output/invoice/marry/revoke',
                                params:filters,
                                userPermissions:['1215001'],
                                onSuccess:()=>{
                                    this.props.refreshTabs()
                                }
                            }],statusParam)
                        }
                        <TableTotal type={2} totalSource={totalSource} />
                    </div>,
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x: 1500,
                        y:130,
                    },
                    cardProps:{
                        title:<span><label className="tab-breadcrumb">销项发票匹配 / </label>销项发票数据匹配列表</span>,
                    },
                }}
            >
            </SearchTable>
        )
    }
}
export default connect(state=>({
    declare:state.user.get('declare')
}))(InvoiceDataMatching)