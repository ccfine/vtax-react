/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-14 15:06:45
 *
 */
import React,{Component} from 'react'
import {Form,Modal,message} from 'antd'
import {FileExport,FileImportModal,TableTotal,SearchTable} from 'compoments'
import {request,fMoney,getUrlParam,listMainResultStatus} from 'utils'
import { withRouter } from 'react-router'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
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
const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        render: (text, record) => {
            return parseInt(context.state.dataStatus,0) === 1 ? (
                <span style={{
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
                删除
            </span>
            ) : ''
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
        dataStatus:'',

        searchFieldsValues:{

        },
        hasData:false,
        totalSource:undefined
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable();
        }
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
        request.get('/output/room/files/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    render(){
        const {tableUpDateKey,dataStatus,totalSource,hasData,searchFieldsValues={}} = this.state;
        const {getFieldValue} = this.props.form;
        const {search} = this.props.location;
        let disabled = !!search;
        const submitIntitialValue = {...searchFieldsValues,taxMonth:searchFieldsValues.transactionDate};

        const searchFeilds = [
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
                    initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
                fieldName:'transactionDate',
                type:'monthPicker',
                formItemStyle,
                span:6,
                componentProps:{
                    disabled,
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
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
        return(
            <SearchTable
                searchOption={{
                    fields: searchFeilds
                }}
                doNotFetchDidMount={true}
                tableOption={{
                    onSuccess:(params,data)=>{
                        this.setState({
                            hasData:data.length !==0,
                            searchFieldsValues:params,
                        },()=>{
                            this.state.searchFieldsValues.transactionDate && this.state.searchFieldsValues.mainId && this.fetchResultStatus()
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    columns:getColumns(this),
                    url: '/output/room/files/list',
                    key:tableUpDateKey,
                    extra: <div>
                        {hasData &&
                                    listMainResultStatus(dataStatus)}
                    <FileImportModal
                        url="/output/room/files/upload"
                        fields={
                            [
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
                                            span:17
                                        }
                                    },
                                    fieldDecoratorOptions:{
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
                                    fieldName:'transactionDate',
                                    type:'monthPicker',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:6
                                        },
                                        wrapperCol:{
                                            span:17
                                        }
                                    },
                                    fieldDecoratorOptions:{
                                        rules:[
                                            {
                                                required:true,
                                                message:'请选择交易月份'
                                            }
                                        ]
                                    }
                                },
                            ]
                        }
                        onSuccess={()=>{
                            this.refreshTable()
                        }}
                        style={{marginRight:5}} />
                    <FileExport
                        url='output/room/files/download'
                        title="下载导入模板"
                        size="small"
                        setButtonStyle={{marginRight:5}}
                    />
                    <SubmitOrRecall type={1} url="/output/room/files/submit" onSuccess={this.refreshTable} initialValue={submitIntitialValue}/>
                    <SubmitOrRecall type={2} url="/output/room/files/revoke" onSuccess={this.refreshTable} initialValue={submitIntitialValue}/>
                    <TableTotal type={3} totalSource={totalSource} data={
                        [
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
                        ]
                    } />

                </div>,
                    cardProps: {
                        title: ''
                    },
                    scroll:{
                        x:'100%'
                    }
                }}
            >
            </SearchTable>
        )
    }
}

export default Form.create()(withRouter(RoomTransactionFile))