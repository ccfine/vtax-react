/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-26 15:08:03
 *
 */
import React,{Component} from 'react'
import {Modal,message,Icon} from 'antd'
import {connect} from 'react-redux'
import {TableTotal,SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
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
]
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
        componentProps:{
            disabled,
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
        label:'发票号码',
        fieldName:'invoiceNum',
        type:'input',
        formItemStyle,
        span:6
    },
    {
        label:'发票代码',
        fieldName:'invoiceCode',
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
const getColumns = (context,disabled) => [
    {
        title: '操作',
        key: 'actions',
        className:'text-center',
        width:50,
        render: (text, record) => {
            return (disabled && parseInt(context.state.statusParam.status,0) === 1) ? (
                <span title='删除' style={{
                    color:'#f5222d',
                    cursor:'pointer'
                }} onClick={()=>{
                    if(parseInt(record.matchingStatus,0) ===1){
                        const errorModalRef = Modal.warning({
                            title: '友情提醒',
                            content: '只能删除未匹配的数据!',
                            okText: '确定',
                            onOk:()=>{
                                errorModalRef.destroy()
                            },
                            onCancel() {
                                errorModalRef.destroy()
                            },
                        });
                        return false;
                    }
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
                }}>
                <Icon type='delete'/>
            </span>
            ) : null
        }
    },
    {
        title:'纳税主体',
        dataIndex:'mainName'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别号',
        dataIndex:'taxIdentificationCode'
    },
    {
        title:'发票号码',
        dataIndex:'invoiceNum'
    },
    {
        title:'发票代码',
        dataIndex:'invoiceCode'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName'
    },
    {
        title:'单元',
        dataIndex:'element'
    },
    {
        title:'房号',
        dataIndex:'roomNumber'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode'
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money'
    },
    {
        title:'房间面积',
        /**
         * roomArea 是普通数值型
         * roomArea2 是字符串四位小数型
         * */
        dataIndex:'roomArea2',
        className:'text-right'
    },
    {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ?<span style={{color: '#f5222d'}}>未匹配</span>:<span style={{color: "#87d068"}}>已匹配</span> //0:未匹配,1:已匹配
    },
    {
        title:'交易日期',
        dataIndex:'transactionDate'
    },
]
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
        requestResultStatus('/output/room/files/listMain',this.state.filters,result=>{
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
                    columns:getColumns(this,disabled),
                    url: '/output/room/files/list',
                    key:tableUpDateKey,

                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            composeBotton([{
                                type:'fileExport',
                                url:'output/room/files/download',
                                onSuccess:this.refreshTable
                            }],statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') && composeBotton([{
                                type:'fileImport',
                                url:'/output/room/files/upload',
                                onSuccess:this.refreshTable,
                                fields:fields(disabled,declare)
                            },{
                                type:'submit',
                                url:'/output/room/files/submit',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/output/room/files/revoke',
                                params:filters,
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={[
                                {
                                    title:'本页合计',
                                    total:[
                                        {title: '本页总价', dataIndex: 'pageTotalPrice'},
                                    ],
                                },{
                                    title:'总计',
                                    total:[
                                        {title: '全部总价', dataIndex: 'allTotalPrice'},
                                    ],
                                }
                            ]} />

                </div>,
                    cardProps: {
                        title: ''
                    },
                }}
            >
            </SearchTable>
        )
    }
}

export default connect(state=>({
    declare:state.user.get('declare')
}))(RoomTransactionFile)