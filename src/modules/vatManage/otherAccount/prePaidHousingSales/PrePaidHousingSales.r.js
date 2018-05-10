/**
 * Created by liurunbin on 2018/1/17.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-07 10:45:12
 *
 * 售房预缴台账
 */
import React,{Component} from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {SearchTable,FileExport,FileImportModal,TableTotal} from 'compoments'
import {fMoney,request,getUrlParam} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment';
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
const transformDataStatus = status =>{
    status = parseInt(status,0)
    if(status===1){
        return '暂存';
    }
    if(status===2){
        return '提交'
    }
    return status
}
const searchFields =(disabled)=> (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled
            },
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
            label:'查询期间',
            fieldName:'receiveMonth',
            type:'monthPicker',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择过滤期间'
                    }
                ]
            },
        },
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
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
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
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
            type:'input',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldName:'buildingName'
        },
        {
            label:'房号',
            type:'input',
            fieldName:'roomNumber',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
        },
        {
            label:'收款时房屋状态',
            fieldName:'housingStatus',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房',
                    value:'2'
                },
                {
                    text:'期房',
                    value:'1'
                }
            ]
        },
        /*{
            label:'现房缴费',
            fieldName:'roomState',
            type:'select',
            span:6,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            options:[
                {
                    text:'现房需要预缴',
                    value:'1'
                },
                {
                    text:'现房且结转收入不预缴',
                    value:'2'
                },
                {
                    text:'现房不预缴',
                    value:'3'
                }
            ]
        }*/
    ]
}
const columns = [
    {
        title:'纳税主体',
        dataIndex:'mainName',
        width:'150px'
    },
    {
        title:'项目',
        dataIndex:'projectName',
    },
    {
        title:'分期',
        dataIndex:'stagesName',
        width:'100px'
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName',
        width:'100px'
    },
    {
        title:'单元',
        dataIndex:'element',
        width:'60px'
    },
    {
        title:'房号',
        dataIndex:'roomNumber',
        width:'60px'
    },
    {
        title:'交付时间',
        dataIndex:'deliveryTime',
        width:'75px',
        className:'text-center',
    },
    {
        title:'收款日期',
        dataIndex:'receiveMonth',
        width:'70px',
        className:'text-center',
    },
    {
        title:'收款时房屋状态',
        dataIndex:'housingStatus',
        width:'100px',
        className:'text-center',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '期房'
            }
            if(text===2){
                return '现房'
            }
            return text;
        }
    },
    {
        title:'累计预售价款',
        dataIndex:'cumulativePrepaidPayment',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'当期结转收入金额',
        dataIndex:'currentIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'累计结转收入金额',
        dataIndex:'cumulativeIncomeAmount',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'预缴销售额',
        dataIndex:'prepaidSales',
        render:text=>fMoney(text),
        width:'120px',
        className:'table-money'
    },
    {
        title:'房间编码',
        dataIndex:'roomCode',
        width:'110px',
    }
];
// 总计数据结构，用于传递至TableTotal中
const totalData =  [
    {
        title:'本页合计',
        total:[
            {title: '累计预收价款', dataIndex: 'pageCumulativePrepaidPayment'},
            {title: '当期结转收入金额', dataIndex: 'pageCurrentIncomeAmount'},
            {title: '累计结转收入金额', dataIndex: 'pageCumulativeIncomeAmount'},
            {title: '预缴销售额', dataIndex: 'pagePrepaidSales'},
        ],
    },{
        title:'总计',
        total:[
            {title: '累计预收价款', dataIndex: 'totalCumulativePrepaidPayment'},
            {title: '当期结转收入金额', dataIndex: 'totalCurrentIncomeAmount'},
            {title: '累计结转收入金额', dataIndex: 'totalCumulativeIncomeAmount'},
            {title: '预缴销售额', dataIndex: 'totalPrepaidSales'},
        ],
    }
];

class PrePaidHousingSales extends Component{

      state={
          selectedRowKeys:[],
          tableKey:Date.now(),
          searchTableLoading:false,
          searchFieldsValues:{},

          hasData:false,

          resultFieldsValues:{

          },

          /**
           *修改状态和时间
           * */
          dataStatus:'',
          submitDate:'',
          totalSource:undefined,
      }

    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    refreshTable=()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    deleteRecord = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleSearchTableLoading(true)
                request.delete(`/account/salehouse/delete/${this.state.selectedRowKeys.toString()}`)
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.setState({
                                selectedRowKeys:[]
                            })
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                        message.error(err.message)
                        this.toggleSearchTableLoading(false)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    fetchResultStatus = ()=>{
        request.get('/account/salehouse/listMain',{
            params:{
                ...this.state.searchFieldsValues,
                taxMonth:this.state.searchFieldsValues.receiveMonth
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataStatus:data.data.status,
                        submitDate:data.data.lastModifiedDate
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
        const {selectedRowKeys,searchTableLoading,tableKey,hasData,resultFieldsValues,submitDate,dataStatus,totalSource} = this.state;
        const {mainId,receiveMonth} = resultFieldsValues;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                    onResetFields:()=>{
                        this.setState({
                            submitDate:'',
                            dataStatus:''
                        })
                    },
                    onFieldsChange:values=>{
                        if(JSON.stringify(values) === "{}"){
                            this.setState({
                                searchFieldsValues:{
                                    mainId:undefined,
                                    receiveMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.receiveMonth){
                            if(values.receiveMonth){
                                values.receiveMonth = values.receiveMonth.format('YYYY-MM')
                            }
                            this.setState(prevState=>({
                                searchFieldsValues:{
                                    ...prevState.searchFieldsValues,
                                    ...values
                                }
                            }))
                        }
                    }
                }}
                doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns,
                    url:'/account/salehouse/list',
                    onRowSelect:parseInt(dataStatus,0) === 1 ? (selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    } : undefined,
                    onSuccess:(params,data)=>{
                        this.setState({
                            hasData:data.length !==0,
                            resultFieldsValues:params,
                            searchFieldsValues:params
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    cardProps: {
                        title: "售房预缴台账",
                    },
                    extra:<div>
                        {
                            dataStatus && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'#f5222d'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
                        }
                        <FileImportModal
                            url="/account/salehouse/upload"
                            fields={[
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
                                            span:10
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
                                    label:'导入月份',
                                    fieldName:'receiveMonth',
                                    type:'monthPicker',
                                    span:24,
                                    formItemStyle:{
                                        labelCol:{
                                            span:6
                                        },
                                        wrapperCol:{
                                            span:10
                                        }
                                    },
                                    fieldDecoratorOptions:{
                                        rules:[
                                            {
                                                required:true,
                                                message:'请选择导入月份'
                                            }
                                        ]
                                    },
                                }
                            ]}
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
                            style={{marginRight:5}} />
                        <FileExport
                            url={`account/salehouse/download`}
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <Button size="small" style={{marginRight:5}} type='danger' onClick={this.deleteRecord} disabled={selectedRowKeys.length === 0}><Icon type="delete" />删除</Button>
                       <SubmitOrRecallMutex
                         paramsType="string"
                         buttonSize="small"
                         restoreStr="restore"//撤销接口命名不一致添加属性
                         url="/account/salehouse"
                         refreshTable={this.refreshTable}
                         toggleSearchTableLoading={this.toggleSearchTableLoading}
                         hasParam={mainId && hasData && receiveMonth}
                         dataStatus={dataStatus}
                         searchFieldsValues={this.state.searchFieldsValues}
                       />
                       <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                    </div>,
                    scroll:{
                        x:'1430px',
                        y:'400px'
                    },
                    rowSelection:parseInt(dataStatus,0) === 1 ? {
                        getCheckboxProps:record=>({
                            /**
                             * 设置该数据是否可以选中
                             * 条件为数据状态是暂存的才可以被删除
                             * */
                            disabled:parseInt(record.status,0) === 2
                        })
                    } : undefined
                }}
            >
            </SearchTable>
        )
    }
}
export default withRouter(PrePaidHousingSales)