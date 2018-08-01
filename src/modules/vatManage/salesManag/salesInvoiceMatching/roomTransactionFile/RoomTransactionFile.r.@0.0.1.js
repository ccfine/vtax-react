/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-01 21:52:44
 *
 */
import React,{Component} from 'react'
import {message} from 'antd'
import {connect} from 'react-redux'
import {TableTotal,SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
// import moment from 'moment';
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
/*
const fields = (disabled,declare)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps:{
            //labelInValue:true,
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && declare.mainId) || undefined,
            //initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
    {
        label:'交易月份',
        fieldName:'authMonth',
        type:'monthPicker',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择交易月份'
                }
            ]
        }
    },
]*/
const searchFeilds = (disabled,declare) =>(getFieldValue)=>[
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
        label:'交易月份',
        fieldName:'authMonth',
        type:'monthPicker',
        formItemStyle,
        span:6,
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
        label:'房号',
        fieldName:'roomNumber',
        type:'input',
        formItemStyle,
        span:6
    },
    {
        label:'客户名称',
        fieldName:'customerName',
        type:'input',
        formItemStyle,
        span:6
    },
    {
        label:'匹配状态',
        fieldName:'matchingStatus',
        type:'select',
        formItemStyle,
        span:6,
        options:[
            {
                text:'未匹配',
                value:'0'
            },
            {
                text:'已匹配',
                value:'1'
            }
        ]
    },
];

const getColumns = (context,disabled) => {
    /*let operates = (disabled && parseInt(context.state.statusParam.status,0) === 1)?[{
        title: '操作',
        key: 'actions',
        className:'text-center',
        fixed:'left',
        width:'50px',
        render: (text, record) => {
            return parseInt(record.matchingStatus,0) === 0 ? composeBotton([{
                    type:'action',
                    title:'删除',
                    icon:'delete',
                    style:{color:'#f5222d'},
                    userPermissions:['1215013'],
                    onSuccess:()=>{
                        const modalRef = Modal.confirm({
                            title: '友情提醒',
                            content: '该删除后将不可恢复，是否删除？',
                            okText: '确定',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk:()=>{
                                context.deleteRecord(record.id,()=>{
                                    modalRef && modalRef.destroy();
                                    context.refreshTable()
                                })
                            },
                            onCancel() {
                                modalRef.destroy()
                            },
                        });
                    }}]) : <span></span>
        }
    }]:[];*/
    return [{
        title:'项目名称',
        dataIndex:'projectName',
        width:'150px',
    },
    {
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'200px',
    },
    {
        title:'路址',
        dataIndex:'htRoomName',
        //width:'300px',
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'150px',
    },
    {
        title:'房间交付日期',
        dataIndex:'deliveryDate',
        width:'100px',
    },
    {
        title:'合同约定交付日期',
        dataIndex:'agreeDate',
        width:'150px',
    },
    {
        title:'成交金额',
        dataIndex:'dealPrice',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },
    {
        title:'已开票金额',
        dataIndex:'invoiced',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'已收款金额',
        dataIndex:'receivables',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "taxAmount",
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'价税合计',
        dataIndex:'sdValorem',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'300px',
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
        title:'房间面积',
        dataIndex:'roomArea',
        width:'100px',
    },
    {
        title:'交易日期',
        dataIndex:'transactionDate',
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
        title:' 款项名称',
        dataIndex:'priceType',
        width:'100px',
    },
    {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        width:'100px',
        render:text=>{ //0:未匹配,1:已匹配
            let txt = '';
            switch (parseInt(text,0)) {
                case 0:
                    txt = "未匹配";
                    break;
                case 1:
                    txt = "已匹配";
                    break;
                default:
                    txt = text;
                    break;
            }
            return txt
        },
    },
    /*{
        title:'纳税主体名称',
        dataIndex:'mainName',
        width:'200px',
    },
    {
        title:'纳税主体编码',
        dataIndex:'mainCode',
        width:'100px',
    },
    {
        title:'项目编码',
        dataIndex:'projectCode',
        width:'100px',
    },
    {
        title:'项目分期编码',
        dataIndex:'stagesCode',
        width:'100px',
    },
    {
        title:'交易月份',
        dataIndex:'authMonth',
        width:'100px',
    },*/
]}
class RoomTransactionFile extends Component{
    state={
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:null,

        /**
         *修改状态和时间
         * */
        statusParam:'',

        filters:{},
        totalSource:undefined
    }

    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    deleteRecord = (id,cb) => {
        request.delete(`/output/room/files/delete/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    message.success('删除成功!');
                    cb && cb()
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    fetchResultStatus = ()=>{
        const { declare } = this.props;
        if(!declare){return}
        requestResultStatus('/output/room/files/listMain',{...this.state.filters,authMonth:this.props.declare.authMonth},result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableUpDateKey,statusParam,totalSource,filters={}} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
                style={{
                    marginTop:-16
                }}
                searchOption={{
                    fields:searchFeilds(disabled,declare),
                    cardProps:{
                        style:{
                            borderTop:0
                        },
                        className:''
                    }
                }}
                doNotFetchDidMount={!disabled}
                tableOption={{
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    columns:getColumns(this,(disabled && declare.decAction==='edit')),
                    url: '/output/room/files/list',
                    key:tableUpDateKey,

                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters)!=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'output/room/files/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1211007'],
                            }])
                        }
                        {/*
                            composeBotton([{
                                type:'fileExport',
                                url:'output/room/files/download',
                                onSuccess:this.refreshTable
                            }],statusParam)
                        */}
                        {
                            (disabled && declare.decAction==='edit') && composeBotton([/*{
                                type:'fileImport',
                                url:'/output/room/files/upload',
                                onSuccess:this.refreshTable,
                                // userPermissions:['1215012'],
                                fields:fields(disabled,declare)
                            },*/
                            {
                                type:'submit',
                                url:'/output/room/files/submit',
                                params:{...filters,authMonth:declare.authMonth},
                                userPermissions:['1215010'],
                                onSuccess:this.refreshTable
                            },
                            {
                                type:'revoke',
                                url:'/output/room/files/revoke',
                                params:{...filters,authMonth:declare.authMonth},
                                userPermissions:['1215011'],
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '成交金额', dataIndex: 'allTotalPrice'},
                                        {title: '已开票金额', dataIndex: 'allInvoicedAmount'},
                                    ],
                                }
                            ]
                        } />
                    </div>,
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">销项发票匹配 / </label>房间交易档案</span>
                    },
                    scroll:{
                        x: 3200,
                        y:window.screen.availHeight-500,
                    },
                }}
            >
            </SearchTable>
            </div>
        )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
}))(RoomTransactionFile)