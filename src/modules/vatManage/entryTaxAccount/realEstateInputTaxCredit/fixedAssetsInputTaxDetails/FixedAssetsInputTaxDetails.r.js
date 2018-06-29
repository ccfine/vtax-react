/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import {Form,message} from 'antd';
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus,request} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'
const columns = (context,isEdit) =>[
    {
        title:'纳税主体',
        dataIndex: "taxSubjectName",
    },{
        title:'项目分期名称',
        dataIndex:'stageName',
    },{
        title:'固定资产名称',
        dataIndex:'assetName',
    },{
        title:'固定资产编号',
        dataIndex:'assetNo',
    },{
        title: "入账日期",
        dataIndex: "accountDate"
    },{
        title:'取得方式',
        dataIndex:'acquisitionMode',
        render: (text, record) => {
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
        }
    },{
        title:'取得价值',
        dataIndex:'gainValue',
        render:(text)=>fMoney(text)
    },
    /*{
        title: "建筑面积",
        dataIndex: "areaCovered"
    },*/
    {
        title: "税率（%）",
        dataIndex: "intaxRate",
        render:(text,record,index)=>{
            if(isEdit && record.intaxRateEdit){
                return <NumericInputCell
                initialValue={text}
                getFieldDecorator={context.props.form.getFieldDecorator}
                fieldName={`list[${index}].intaxRate`}
                editAble={true}
                />
             }else{
                return text && `${text}%`
             }
        },
    },
    {
        title: "税额",
        dataIndex: "inTax",
        render:(text)=>fMoney(text)
    },
    {
        title: "当期抵扣的进项税额",
        dataIndex: "taxAmount",
        render:(text)=>fMoney(text)
    },
    {
        title: "待抵扣的进项税额",
        dataIndex: "deductedTaxAmount",
        render:(text)=>fMoney(text)
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod"
    },{
        title: "资产类别",
        dataIndex: "assetType"
    },{
        title: "资产状态",
        dataIndex: "assetsState"
    },
];
class FixedAssetsInputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
		filters: {},
        statusParam:{},
        dataSource:[],

        saveLoading:false,
    }
    toggoleSaveLoading=(saveLoading)=>{
        this.setState({saveLoading})
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/estate/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    save=(e)=>{
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params={...this.state.filters,list:[]};
                values.list && values.list.forEach((ele,index)=>{
                    params.list.push({id:this.state.dataSource[index].id,intaxRate:ele.intaxRate });
                })
                this.toggoleSaveLoading(true)
                request.post('/account/income/estate/save',params)
                .then(({data})=>{
                    this.toggoleSaveLoading(false)
                    if(data.code===200){
                        message.success(`保存成功！`);
                        this.props.refreshTabs();
                    }else{
                        message.error(`保存失败:${data.msg}`)
                    }
                }).catch(err=>{
                    this.toggoleSaveLoading(false)
                    message.error(`保存失败:${err.message}`)
                })
            }
        })
    }
    render(){
        const {tableKey,statusParam,filters,saveLoading} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:columns(this,disabled && declare.decAction==='edit' && parseInt(statusParam.status,10)===1),
                    url:'/account/income/estate/fixedList',
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">不动产进项税额抵扣台账 / </label>固定资产进项税额明细</span>,
                    },
                    onSuccess: (params,dataSource) => {
                        this.setState({
                            filters: params,
                            dataSource
                        },()=>{
                            this.fetchResultStatus()
                        })
                        this.props.form.resetFields();
                    },
                    extra: (
                        <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                disabled && declare.decAction==='edit' && parseInt(statusParam.status,10)===1 && composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    userPermissions:['1251003'],
                                    onClick:this.save,
                                    loading:saveLoading
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([
                                    {
                                        type: 'reset',
                                        url:'/account/income/estate/reset',
                                        params:filters,
                                        userPermissions:['1251009'],
                                        onSuccess:()=>{
                                            this.props.refreshTabs()
                                        },
                                    }
                                ],statusParam)
                            }
                        </div>
                    ),
                    scroll:{
                     x:1600
                     },
                }}
            />
        )
    }
}

export default Form.create()(FixedAssetsInputTaxDetails);