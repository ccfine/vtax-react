/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton} from 'utils'
import {connect} from 'react-redux'
import createSocket from '../socket'
import TableTitle from 'compoments/tableTitleWithTime'
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
const columns = [{
        title:'纳税主体名称',
        dataIndex:'mainName',
        width:'150px',
    },{
        title:'纳税主体编码',
        dataIndex:'mainCode',
        width:'100px',
    },{
        title:'客户名称',
        dataIndex:'customerName',
        width:'150px',
    },{
        title:'身份证号/纳税识别号',
        dataIndex:'taxIdentificationCode',
        width:'150px',
    },{
        title:'项目名称',
        dataIndex:'projectName',
        width:'150px',
    },{
        title:'项目编码',
        dataIndex:'projectCode',
        width:'100px',
    },{
        title:'项目分期名称',
        dataIndex:'stagesName',
        width:'150px',
    },{
        title:'项目分期编码',
        dataIndex:'stagesCode',
        width:'100px',
    },{
        title:'交易月份',
        dataIndex:'authMonth',
        width:'100px',
    },{
        title:'交易日期',
        dataIndex:'transactionDate',
        width:'100px',
    },{
        title:'房间交付日期',
        dataIndex:'deliveryDate',
        width:'100px',
    },{
        title:'合同约定交付日期',
        dataIndex:'agreeDate',
        width:'100px',
    },{
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'150px',
    },{
        title:'单元',
        dataIndex:'element',
        width:'100px',
    }, {
        title:'路址',
        dataIndex:'htRoomName',
        width:'150px',
    }, {
        title:'房号',
        dataIndex:'roomNumber',
        width:'100px',
    }, {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'100px',
    },{
        title:'成交金额',
        className:'table-money',
        dataIndex:'dealPrice',
        width:'100px',
    }, {
        title:'已收款金额',
        className:'table-money',
        dataIndex:'receivables',
        width:'100px',
    }, {
        title:'房间面积',
        dataIndex:'roomArea',
        width:'100px',
    }, {
        title:'匹配状态',
        dataIndex:'matchingStatus',
        render:text=>parseInt(text,0) === 0 ? <span style={{color: '#f5222d'}}>未匹配</span>:<span style={{color: "#87d068"}}>已匹配</span>, //0:未匹配,1:已匹配
        width:'100px',
    }, {
        title:'已开票金额',
        dataIndex:'invoiced',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    }, {
        title:' 款项名称',
        dataIndex:'priceType',
        width:'100px',
    }, {
        title: "税额",
        dataIndex: "taxAmount",
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:'100px',
    }, {
        title:'价税合计',
        dataIndex:'sdValorem',
        render:text=>fMoney(text),
        className:'table-money',
        width:'100px',
    },
]
const apiFields = (getFieldValue)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择纳税主体',
            }]
        },
    },
    {
        label:'抽取月份',
        fieldName:'authMonth',
        type:'monthPicker',
        span:20,
        fieldDecoratorOptions:{
            rules:[{
                required:true,
                message:'请选择抽取月份',
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
                        title:<TableTitle time={totalSource && totalSource.extractTime}>房间交易档案</TableTitle>
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
                        x: 2850,
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