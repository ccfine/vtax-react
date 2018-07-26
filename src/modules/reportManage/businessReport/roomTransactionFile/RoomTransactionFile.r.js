/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton} from 'utils'
import {connect} from 'react-redux'
import createSocket from './socket'
const searchFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:8,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label:'项目名称',
        fieldName:'projectId',
        type:'asyncSelect',
        span:8,
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
        span:8,
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
        span:8
    },
    {
        label:'房间编码',
        fieldName:'roomCode',
        span:8
    },
    {
        label:'路址',
        fieldName:'htRoomName',
        span:8
    },
]
const columns = [
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
        width:'8%',
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
        width:'10%',
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
        width:75,
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
        },
        width:80,
    },{
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'6%',
    },{
        title:'单元',
        dataIndex:'element',
        width:'4%',
    }, {
        title:'路址',
        dataIndex:'htRoomName',
        width:'6%',
    }, {
        title:'房号',
        dataIndex:'roomNumber',
        width:'4%',
    }, {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'4%',
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
        width:'5%',
    }, {
        title:'房间面积',
        dataIndex:'roomArea',
        width:'5%',
    }, {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? <span style={{color: '#f5222d'}}>未匹配</span>:<span style={{color: "#87d068"}}>已匹配</span>, //0:未匹配,1:已匹配
        width:60,
    }, {
        title:'已开票金额',
        dataIndex:'invoiced',
        render:text=>fMoney(text),
        className:'table-money',
        width:'5%',
    }, {
        title:' 款项名称',
        dataIndex:'priceType',
        width:'4%',
    }, {
        title: "税额",
        dataIndex: "taxAmount",
        render:text=>fMoney(text),
        className:'table-money',
        width:'5%',
    }, {
        title:'价税合计',
        dataIndex:'sdValorem',
        render:text=>fMoney(text),
        className:'table-money',
        width:'5%',
    },
]
const apiFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label:'项目名称',
        fieldName:'projectId',
        type:'asyncSelect',
        span:24,
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('mainId') || false,
            url:`/project/list/${getFieldValue('mainId')}`,
        },
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择项目名称',
            }]
        },
    },
    {
        label:'项目分期',
        fieldName:'stagesId',
        type:'asyncSelect',
        span:24,
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('projectId') || false,
            url:`/project/stages/${getFieldValue('projectId') || ''}`,
        },
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择项目分期',
            }]
        },
    },
]
class RoomTransactionFile extends Component{
    state={
        filters:{},
        totalSource:undefined,
    }
    render(){
        const {totalSource}=this.state; //filters,
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields
                }}
                tableOption={{
                    pageSize:100,
                    columns,
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params
                        })
                    },
                    cardProps:{
                        title:'房间交易档案'
                    },
                    url:'/output/room/files/report/list',
                    extra:<div>
                        {/*{
                            JSON.stringify(filters)!=='{}' && composeBotton([{
                                type:'fileExport',
                                url:'output/room/files/report/export',
                                params:filters,
                                title:'导出',
                                userPermissions:['1861007'],
                            }])
                        }*/}
                        {
                            composeBotton([{
                                type:'modal',
                                url:'/output/room/files/report/sendApi',
                                title:'抽数',
                                icon:'usb',
                                fields:apiFields,
                                userPermissions:['1865001'],
                                onSuccess:()=>{
                                    createSocket(this.props.userid)
                                }
                            }])
                        }
                        <TableTotal type={3} totalSource={totalSource} data={
                            [
                                {
                                    title:'合计',
                                    total:[
                                        {title: '成交金额', dataIndex: 'allTotalPrice'},
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
                        x: 1800,
                        y:window.screen.availHeight-400
                    },
                }}
            >
            </SearchTable>
        )
    }
}

export default connect(state=>({
    userid:state.user.getIn(['personal','id'])
}))(RoomTransactionFile)