/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 17:44:13 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-16 18:29:51
 */
import React from 'react';
import {message} from 'antd'
import {SearchTable} from 'compoments'
import {fMoney,getUrlParam,request,listMainResultStatus,composeBotton} from 'utils'
import { withRouter } from 'react-router';
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
const searchFields =(disabled)=>(getFieldValue)=> {
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
            label:'纳税申报期',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            formItemStyle,
            componentProps:{
                format:'YYYY-MM',
                disabled:disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税申报期'
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
        }
    ]
}


const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目分期',
        dataIndex: 'stagesName',
    },{
        title: '可售面积(㎡)',
        dataIndex: 'upAreaSale',
    },{
        title: '分摊抵扣的土地价款',
        dataIndex: 'deductibleLandPrice',
        render:text=>fMoney(text),
    },{
        title: '单方土地成本',
        dataIndex: 'singleLandCost',
    },{
        title: '累计销售面积(㎡)',
        dataIndex: 'saleArea',
    },{
        title: '累计已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积（㎡）',
        dataIndex: 'salesBuildingArea',
    },{
        title: '当起实际扣除土地价款',
        dataIndex: 'deductPrice',
        render:text=>fMoney(text),
    },{
        title: '收入确认金额',
        dataIndex: 'price',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    }
];
class HasDeduct extends React.Component{
    state={
        tableKey:Date.now(),
        doNotFetchDidMount:true,
        searchFieldsValues:{

        },
        statusParams:undefined,

        dataSource:undefined,
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
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
            this.setState({
                doNotFetchDidMount:false
            },()=>{
                this.refreshTable()
            })

        }else{
            this.setState({
                doNotFetchDidMount:true
            })
        }
    }
    fetchResultStatus = ()=>{
        request.get('/account/output/notInvoiceSale/realty/listMain',{
            params:{
                ...this.state.searchFieldsValues,
                authMonth:this.state.searchFieldsValues.month
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParams:data.data,
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
        const {tableKey,searchFieldsValues={},doNotFetchDidMount,statusParams={}} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        let submitIntialValue = {...searchFieldsValues,taxMonth:searchFieldsValues.month}
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={doNotFetchDidMount}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                // spinning={searchTableLoading}
                tableOption={{
                    cardProps:{
                        title:'土地价款当期实际扣除'
                    },
                    key:tableKey,
                    pageSize:10,
                    columns:columns,
                    url:'/account/output/notInvoiceSale/realty/list',
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra:<div>
                        {
                            listMainResultStatus(statusParams)
                        }
                        {
                            composeBotton([{
                                type:'submit',
                                url:'/account/output/notInvoiceSale/realty/submit',
                                params:{...submitIntialValue},
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/output/notInvoiceSale/realty/revoke',
                                params:{...submitIntialValue},
                                onSuccess:this.refreshTable,
                            }],statusParams)
                        }
                    </div>,
                    scroll:{
                        x:'100%'
                    },
                }}
            >
            </SearchTable>
        )
    }
}

export default withRouter(HasDeduct)