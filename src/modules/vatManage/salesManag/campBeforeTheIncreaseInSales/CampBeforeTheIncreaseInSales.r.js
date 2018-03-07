/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import {SearchTable,FileExport,FileImportModal} from '../../../../compoments'
import {fMoney,getUrlParam,request} from '../../../../utils'
import PopModal from './popModal'
import SubmitOrRecall from '../../../../compoments/buttonModalWithForm/SubmitOrRecall.r'
import { withRouter } from 'react-router'
import moment from 'moment'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
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
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:14
    }
}
const searchFields=(disabled)=>(getFieldValue,setFieldsValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                disabled,
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
            fieldName:'taxMonth',
            type:'monthPicker',
            span:6,
            formItemStyle,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
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
            type:'asyncSelect',
            span:6,
            formItemStyle,
            componentProps:{
                fieldTextName:'buildingName',
                fieldValueName:'buildingName',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('stagesId') || false,
                url:`/output/room/files/queryListByStagesId?stagesId=${getFieldValue('stagesId') || ''}`,
            }
        },
        {
            label:'单元',
            fieldName:'element',
            type:'element',
            formItemStyle,
            span:6
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            formItemStyle,
            span:6
        },
        {
            label:'房间编码',
            fieldName:'roomCode',
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
            label:'纳税识别号',
            fieldName:'taxIdentificationCode',
            type:'input',
            formItemStyle,
            span:6
        }
    ]
}
const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
        render:(text,record)=>{
            return (
                <div>
                <span style={pointerStyle} onClick={()=>{
                    context.setState({
                        modalConfig:{
                            type:'edit',
                            id:record.id
                        }
                    },()=>{
                        context.toggleModalVisible(true)
                    })
                }}>修改</span>
                    {
                        parseInt(context.state.dataStatus,0) === 1 && (
                            <span style={{
                                ...pointerStyle,
                                marginLeft:5
                            }} onClick={()=>{
                                context.setState({
                                    modalConfig:{
                                        type:'view',
                                        id:record.id
                                    }
                                },()=>{
                                    context.toggleModalVisible(true)
                                })
                            }}>
                            查看
                        </span>
                        )
                    }

                </div>
            )

        },
        fixed:'left',
        width:'70px',
        className:'text-center'
    },{
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName'
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
    },{
        title: '楼栋名称',
        dataIndex: 'buildingName'
    },{
        title: '单元',
        dataIndex: 'element',
    },{
        title: '房号',
        dataIndex: 'roomNumber',
    },{
        title: '客户名称',
        dataIndex: 'customerName',
    },{
        title: '身份证/纳税人识别号',
        dataIndex: 'taxIdentificationCode',
    },{
        title: '房间编码',
        dataIndex: 'roomCode',
    },{
        title: '营业税收款金额',
        dataIndex: 'businessTaxCollectionAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '营业税结转收入金额',
        dataIndex: 'turnoverOfBusinessTax',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '营业税开票金额',
        dataIndex: 'businessTaxInvoiceAmount',
        render:text=>fMoney(text),
        className:'table-money'
    },{
        title: '操作员',
        dataIndex: 'realname',
    },{
        title: '操作时间',
        dataIndex: 'lastModifiedDate',
    }
];
class CampBeforeTheIncreaseInSales extends Component{
    state={
        visible:false,
        modalConfig:{
            type:''
        },
        tableKey:Date.now(),
        searchFieldsValues:{

        },
        hasData:false,

        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type:type
            }
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    fetchResultStatus = ()=>{
        request.get('/output/sellinghouse/listMain',{
            params:{
                ...this.state.searchFieldsValues,
                authMonth:this.state.searchFieldsValues.taxMonth
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
    }
    render(){
        const {visible,modalConfig,tableKey,searchFieldsValues,hasData,dataStatus,submitDate} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this),
                    url:'/output/sellinghouse/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0
                        },()=>{
                            this.state.hasData && this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            dataStatus && hasData && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
                        }
                        <Button size='small' style={{marginRight:5}} onClick={()=>this.showModal('add')} >
                            <Icon type="file-add" />
                            新增
                        </Button>
                        <FileExport
                            url='/output/sellinghouse/download'
                            title="下载导入模板"
                            size="small"
                            setButtonStyle={{marginRight:5}}
                        />
                        <FileImportModal
                            url="output/sellinghouse/upload"
                            onSuccess={()=>{
                                this.refreshTable()
                            }}
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
                                        label:'查询期间',
                                        fieldName:'authMonth',
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
                                                    message:'请选择查询期间'
                                                }
                                            ]
                                        }
                                    },
                                ]
                            }
                            style={{marginRight:5}} />
                        <FileExport
                            url={`output/sellinghouse/export`}
                            title="导出"
                            size="small"
                            disabled={!hasData}
                            params={
                                searchFieldsValues
                            }
                            setButtonStyle={{marginRight:5}}
                        />
                        <SubmitOrRecall type={1} url="/output/sellinghouse/submit" monthFieldName="authMonth" onSuccess={this.refreshTable} />
                        <SubmitOrRecall type={2} url="/output/sellinghouse/revoke" monthFieldName="authMonth" onSuccess={this.refreshTable} />
                    </div>,
                    scroll:{
                        x:'140%'
                    }
                }}
            >
                <PopModal refreshTable={this.refreshTable} visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </SearchTable>
        )
    }
}
export default withRouter(CampBeforeTheIncreaseInSales)