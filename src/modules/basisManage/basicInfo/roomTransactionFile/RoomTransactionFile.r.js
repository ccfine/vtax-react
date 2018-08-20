/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import {Modal} from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,composeBotton} from 'utils'

const importFeilds = [
    {
        label: "纳税主体",
        type: "taxMain",
        fieldName: "mainId",
        span: 24,
        formItemStyle: {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 17
            }
        },
        fieldDecoratorOptions: {
            rules: [
                {
                    required: true,
                    message: "请选择纳税主体"
                }
            ]
        }
    }
];

const searchFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:6,
        fieldDecoratorOptions:{

        },
    },
    {
        label:'项目名称',
        fieldName:'projectId',
        type:'asyncSelect',
        span:6,
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
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('projectId') || false,
            url:`/project/stages/${getFieldValue('projectId') || ''}`,
        }
    },
    {
        label:'交易月份',
        fieldName:'authMonth',
        type:'monthPicker',
        span:6
    },
]
const getColumns = context=>[
    {
        title:'操作',
        render:(text, record, index)=>composeBotton([{
            type:'action',
            title:'删除',
            icon:'delete',
            style:{color:'#f5222d'},
            userPermissions:['1531008'],
            onSuccess:()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '该删除后将不可恢复，是否删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk:()=>{
                        context.deleteRecord(record)
                        modalRef && modalRef.destroy();
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }
        }]),
        fixed:'left',
        width:'70px',
        dataIndex:'action',
        className:'text-center',
    },
    {
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
        }
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
        }
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
        }
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
        }
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
        }
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">房间交付日期</p>
                <p className="apply-form-list-p2">合同约定交付日期</p>
            </div>
        ),
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
        dataIndex:'buildingName'
    },{
        title:'单元',
        dataIndex:'element'
    }, {
        title:'房号',
        dataIndex:'roomNumber'
    }, {
        title:'房间编码',
        dataIndex:'roomCode'
    },{
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">成交总价</p>
                <p className="apply-form-list-p2">已收款金额</p>
            </div>
        ),
        dataIndex: 'totalPrice',
        className:'table-money',
        render: (text, record) => {
            return (
                <div>
                    <p className="apply-form-list-p1">{fMoney(text)}</p>
                    <p className="apply-form-list-p2">{fMoney(record.receivables)}</p>
                </div>
            );
        }
    }, {
        title:'房间面积',
        dataIndex:'roomArea'
    }, {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? <span style={{color: '#f5222d'}}>未匹配</span>:<span style={{color: "#87d068"}}>已匹配</span> //0:未匹配,1:已匹配
    }, {
        title:'已开票金额',
        dataIndex:'invoiced',
        render:text=>fMoney(text),
        className:'table-money'
    }, {
        title:' 款项名称',
        dataIndex:'priceType'
    }, {
        title: "税额",
        dataIndex: "taxAmount",
        render:text=>fMoney(text),
        className:'table-money'
    }, {
        title:'价税合计',
        dataIndex:'sdValorem',
        render:text=>fMoney(text),
        className:'table-money'
    },
]
class RoomTransactionFile extends Component{
    state={
        filters:undefined
    }
    render(){
        let {filters} = this.state;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    pageSize:100,
                    columns:getColumns(this),
                    cardProps:{
                        title:'房间交易档案期初数据'
                    },
                    url:'/output/room/files/report/list',
                    scroll:{ x: '120%' },
                    onSuccess:filters=>{
                        this.setState({filters})
                    },
                    extra:(
                        <span>
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type: 'fileExport',
                                    url: 'interAvailableBuildingAreaInformation/download',
                                },{
                                    type:'fileImport',
                                    url:'/interAvailableBuildingAreaInformation/upload',
                                    onSuccess:this.update,
                                    userPermissions:['1531005'],
                                    fields:importFeilds
                                }])
                            }
                        </span>
                    )
                }}
            >
            </SearchTable>
        )
    }
}

export default RoomTransactionFile