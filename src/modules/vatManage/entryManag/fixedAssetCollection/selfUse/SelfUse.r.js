/*
 * @Author: zhouzhe 
 * @Date: 2018-10-13 11:48:33 
 * @Description: '' 
 * @Last Modified by:   zhouzhe 
 * @Last Modified time: 2018-10-13 11:48:33 
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {fMoney,listMainResultStatus,requestResultStatus,composeBotton} from 'utils'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

const searchFields =  (disabled,declare) => (getFieldValue) => {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:6,
            formItemStyle,
            componentProps:{
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        }, {
            label: '纳税申报期',
            fieldName: 'authMonth',
            type: 'monthPicker',
            formItemStyle,
            span: 6,
            componentProps: {
                format: 'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && moment(declare['authMonth'], 'YYYY-MM')) || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择查询期间'
                    }
                ]
            },
        }, {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:false,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            }
        }, {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('profitCenterId') || ''}?size=1000`
            }
        }
    ]
}
const columns=[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'150px',
    },
    {
        title:'项目分期名称',
        dataIndex:'stageName',
        width:'150px',
    },
    {
        title:'固定资产名称',
        dataIndex:'assetName',
        width:'100px',
    },
    {
        title:'固定资产编号',
        dataIndex:'assetNo',
        width:'100px',
    },
    {
        title: "入账日期",
        dataIndex: "accountDate",
        width:'100px',
    },
    {
        title:'取得方式',
        dataIndex:'acquisitionMode',
        render:(text)=>{
            // 0-外部获取
            // 1-单独新建
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
                    break;
                case 1:
                    res = "单独新建";
                    break;
                case 2:
                    res = "自建转自用";
                    break;
                default:
                    break;
            }
            return res;
        },
        width:'100px',
    },
    {
        title: "取得价值",
        dataIndex: "gainValue",
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: "资产类别",
        dataIndex: "assetType",
        width:'100px',
    },
    {
        title: "资产状态",
        dataIndex: "assetsState",
        width:'100px',
    },
    {
        title: "建筑面积",
        dataIndex: "areaCovered",
        width:'100px',
    },
    {
        title: "税率",
        dataIndex: "intaxRate",
        render:text=>text && `${text}%`,
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "inTax",
        width:'100px',
        render: text => fMoney(text),
        className: "table-money"
    },
];
 class SelfUseCollection extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam: {},
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/fixedAssetCard/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {updateKey,filters,statusParam} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                backCondition={(filters)=>{
                    this.setState({
                        filters,
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:100,
                    columns:columns,
                    url:'/fixedAssetCard/manageList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">固定资产信息采集 / </label>
                        自建转自用固定资产</span>,
                        extra: (
                            <div>
                                {
                                    listMainResultStatus(statusParam)
                                }
                                {
                                    JSON.stringify(filters)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'fixedAssetCard/export',
                                        params:filters,
                                        title:'导出',
                                        userPermissions:['1511007'],
                                    }])
                                }
                                {
                                    (disabled && declare.decAction==='edit') &&  composeBotton([{
                                        type:'submit',
                                        url:'/fixedAssetCard/submit',
                                        params:filters,
                                        userPermissions:['1511010'],
                                        onSuccess:this.refreshTable
                                    },{
                                        type:'revoke',
                                        url:'/fixedAssetCard/revoke',
                                        params:filters,
                                        userPermissions:['1511011'],
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                                }
                            </div>
                        )
                    },
                    scroll:{
                     x:1800,
                     y:window.screen.availHeight-380-(disabled?50:0),
                     },
                }}
            />
            </div>
        )
    }
}
export default SelfUseCollection
