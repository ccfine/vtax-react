/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-29 16:34:01
 *
 */
import React,{Component} from 'react'
import {Modal,message} from 'antd'
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
    let operates = (disabled && parseInt(context.state.statusParam.status,0) === 1)?[{
        title: '操作',
        key: 'actions',
        className:'text-center',
        width:50,
        render: (text, record) => {
            return parseInt(record.matchingStatus,0) === 0 && composeBotton([{
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
                    }}])
        }
    }]:[];
    return [...operates,{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">纳税主体名称</p>
                <p className="apply-form-list-p2">纳税主体编码</p>
            </div>
        ),
        dataIndex: 'mainName',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.mainCode}</p>
                </div>
            );
        },
    }, {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">客户名称</p>
                <p className="apply-form-list-p2">身份证号/纳税识别号</p>
            </div>
        ),
        dataIndex: 'customerName',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.taxIdentificationCode}</p>
                </div>
            );
        },
        width:'8%',
    }, {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目名称</p>
                <p className="apply-form-list-p2">项目编码</p>
            </div>
        ),
        dataIndex: 'projectName',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.projectCode}</p>
                </div>
            );
        },
        width:'10%',
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目分期名称</p>
                <p className="apply-form-list-p2">项目分期编码</p>
            </div>
        ),
        dataIndex: 'stagesName',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.stagesCode}</p>
                </div>
            );
        },
        width:'12%',
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">交易月份</p>
                <p className="apply-form-list-p2">交易日期</p>
            </div>
        ),
        dataIndex: 'authMonth',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.transactionDate}</p>
                </div>
            );
        },
        width:80,
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">房间交付日期</p>
                <p className="apply-form-list-p2">合同约定交付日期</p>
            </div>
        ),
        width:110,
        dataIndex: 'deliveryDate',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{text}</p>
                    <p className="apply-form-list-p2">{record.agreeDate}</p>
                </div>
            );
        }
    },{
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'8%',
    },{
        title:'单元',
        dataIndex:'element',
        width:'4%',
    }, {
        title:'路址',
        dataIndex:'htRoomName',
        width:'8%',
    }, {
        title:'房号',
        dataIndex:'roomNumber',
        width:50,
    }, {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'5%',
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">成交金额</p>
                <p className="apply-form-list-p2">已收款金额</p>
            </div>
        ),
        dataIndex: 'dealPrice',
        className:'table-money',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{fMoney(text)}</p>
                    <p className="apply-form-list-p2">{fMoney(record.receivables)}</p>
                </div>
            );
        },
        width:'4%',
    }, {
        title:'房间面积',
        dataIndex:'roomArea',
        width:'3%',
    }, {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        width:60,
        render:text=>parseInt(text,0) === 0 ? <span style={{color: '#f5222d'}}>未匹配</span>:<span style={{color: "#87d068"}}>已匹配</span> //0:未匹配,1:已匹配
    }, {
        title:'已开票金额',
        dataIndex:'invoiced',
        render:text=>fMoney(text),
        className:'table-money',
        width:'4%',
    }, {
        title:' 款项名称',
        dataIndex:'priceType',
        width:60,
    }, {
        title: "税额",
        dataIndex: "taxAmount",
        render:text=>fMoney(text),
        className:'table-money',
        width:'4%',
    }, {
        title:'价税合计',
        dataIndex:'sdValorem',
        render:text=>fMoney(text),
        className:'table-money',
        width:'4%',
    },
]
}
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
                    columns:getColumns(this,(disabled && declare.decAction==='edit')),
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
                                userPermissions:['1215012'],
                                fields:fields(disabled,declare)
                            },{
                                type:'submit',
                                url:'/output/room/files/submit',
                                params:filters,
                                userPermissions:['1215010'],
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/output/room/files/revoke',
                                params:filters,
                                userPermissions:['1215011'],
                                onSuccess:this.refreshTable,
                            }],statusParam)
                        }
                        <TableTotal type={3} totalSource={totalSource} data={[
                            {
                                title:'本页合计',
                                total:[
                                    {title: '成交金额', dataIndex: 'pageTotalPrice'},
                                ],
                            },{
                                title:'总计',
                                total:[
                                    {title: '成交金额', dataIndex: 'allTotalPrice'},
                                ],
                            }
                        ]} />

                    </div>,
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">销项发票匹配 / </label>房间交易档案</span>
                    },
                    scroll:{
                        x: 2200,
                        y:180,
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