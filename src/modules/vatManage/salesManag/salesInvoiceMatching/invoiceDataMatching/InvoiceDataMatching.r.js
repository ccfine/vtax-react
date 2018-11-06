/**
 * Created by liurunbin on 2018/1/9.
 */
import React, { Component } from 'react'
import {Modal,message} from 'antd'
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
            fieldName:'main',
            type:'taxMain',
            span:6,
            componentProps:{
                disabled,
                labelInValue:true,
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
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount: !declare,
                fetchAble: (getFieldValue("main") && getFieldValue("main").key) || (declare && declare.mainId),
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
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
                fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
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
            label:'房间编码',
            fieldName:'roomCode',
            type:'input',
            span:6,
            formItemStyle
        },
        {
            label:'路址',
            fieldName:'htRoomName',
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
        width:'50px',
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
            width:'200px',
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
            title:'发票代码',
            dataIndex:'invoiceCode',
            width:'150px',
        },
        {
            title:'发票号码',
            dataIndex:'invoiceNum',
            width:'150px',
        },
        {
            title:'发票类型',
            dataIndex:'invoiceType',
            width:'100px',
            render: (text) => {
                let txt = '';
                if(text==='s'){
                    txt = '专票'
                }
                if(text==='c'){
                    txt = '普票'
                }
                return txt
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            //width:'500px',
        },
        {
            title:'金额',
            dataIndex:'amount',
            width:'100px',
            className:'table-money',
            render:text=>fMoney(text),
        },
        {
            title:'税率',
            dataIndex:'taxRate',
            className:'text-right',
            width:'100px',
            render:text=>text? `${text}%`: text,
        },
        {
            title:'税额',
            dataIndex:'taxAmount',
            width:'100px',
            className:'table-money',
            render:text=>fMoney(text),
        },
        {
            title:'价税合计',
            dataIndex:'totalAmount',
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
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
        },
        {
            title:'路址',
            dataIndex:'htRoomName',
            width:'200px',
        },
        {
            title:'成交金额',
            dataIndex:'totalPrice',
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
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
            title:'客户名称',
            dataIndex:'customerName',
            width:'100px',
        },
        {
            title:'身份证号/纳税识别号',
            dataIndex:'taxIdentificationCode',
            width:'200px',
        },
        {
            title:'匹配时间',
            dataIndex:'marryTime',
            width:'100px',
        },
        {
            title:'匹配方式',
            dataIndex:'matchingWay',
            width:'100px',
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
        }
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
    matchData = ()=>{
        const {filters} = this.state;
        request.put(`/output/invoice/marry/already/automatic`,filters)
            .then(({data})=>{
                if(data.code===200){
                    message.success(data.msg);
                    this.props.refreshTabs()
                }else{
                    message.error(`数据匹配失败:${data.msg}`)
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
            <div className='oneLine'>
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
                backCondition={(filters)=>{
                    this.setState({
                        filters,
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this,disabled),
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
                                userPermissions:['1211007'],
                            }])
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'match',
                                icon:'copy',
                                text:'数据匹配',
                                btnType:'default',
                                userPermissions:['1215002'],
                                onClick:this.matchData
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
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '发票金额', dataIndex: 'allAmount'},
                                        {title: '发票税额', dataIndex: 'allTaxAmount'},
                                        {title: '房间成交金额', dataIndex: 'allTotalPrice'},
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
                        x: 3050,
                        y:window.screen.availHeight-480-(disabled?50:0),
                    },
                    cardProps:{
                        title:<span><label className="tab-breadcrumb">销项发票匹配 / </label>销项发票数据匹配</span>,
                    },
                }}
            >
            </SearchTable>
            </div>
        )
    }
}
export default InvoiceDataMatching