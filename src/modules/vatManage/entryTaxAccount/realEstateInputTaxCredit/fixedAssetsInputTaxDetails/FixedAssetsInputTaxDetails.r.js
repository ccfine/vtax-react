/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {Form,message} from 'antd';
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus,request} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'
const columns = (context,isEdit) =>[
    {
        title:'纳税主体',
        dataIndex: "taxSubjectName",
        width:'150px',
    },{
        title:'项目分期名称',
        dataIndex:'stageName',
        width:'150px',
    },{
        title:'固定资产名称',
        dataIndex:'assetName',
        width:'150px',
    },{
        title:'固定资产编号',
        dataIndex:'assetNo',
        width:'100px',
    },{
        title: "入账日期",
        dataIndex: "accountDate",
        width:'100px',
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
        },
        width:'100px',
    },{
        title:'取得价值',
        dataIndex:'gainValue',
        render:(text)=>fMoney(text),
        className: "table-money",
        width:'100px',
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
                            initialValue={text==='0' ? '0.00' : text}
                            getFieldDecorator={context.props.form.getFieldDecorator}
                            fieldName={`list[${index}].intaxRate`}
                            editAble={true}
                            componentProps={{decimalPlaces:10}}
                        />
             }else{
                return text && `${text}%`
             }
        },
        width:'100px',
    },
    {
        title: "税额",
        dataIndex: "inTax",
        render:(text)=>fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: "当期抵扣的进项税额",
        dataIndex: "taxAmount",
        render:(text)=>fMoney(text),
        className: "table-money",
        width:'150px',
    },
    {
        title: "待抵扣的进项税额",
        dataIndex: "deductedTaxAmount",
        render:(text)=>fMoney(text),
        className: "table-money",
        width:'150px',
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod",
        width:'100px',
    },{
        title: "资产类别",
        dataIndex: "assetType",
        width:'150px',
    },{
        title: "资产状态",
        dataIndex: "assetsState",
        width:'100px',
    },
];
class FixedAssetsInputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
		filters: {},
        statusParam:{},
        dataSource:[],

        saveLoading:false,
        totalSource:undefined,
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
        const {tableKey,statusParam,filters,saveLoading,totalSource} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <div className='oneLine'>
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
                    pageSize:100,
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
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/income/estate/fixed/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1251007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'submit',
                                    url:'/account/income/estate/submit',
                                    params:filters,
                                    userPermissions:['1251010'],
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                },{
                                    type: 'reset',
                                    url:'/account/income/estate/reset',
                                    params:filters,
                                    userPermissions:['1251009'],
                                    onSuccess:()=>{
                                        this.props.refreshTabs()
                                    },
                                },{
                                    type:'revoke',
                                    url:'/account/income/estate/revoke',
                                    params:filters,
                                    userPermissions:['1251011'],
                                    onSuccess:()=>{
                                        //this.refreshTable();
                                        this.props.refreshTabs()
                                    },
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '当期抵扣的进项税额', dataIndex: 'taxAmount'},
                                            {title: '待抵扣的进项税额', dataIndex: 'deductedTaxAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>
                    ),
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                         x:1700,
                         y:window.screen.availHeight-430,
                    },
                }}
            />
            </div>
        )
    }
}

export default Form.create()(FixedAssetsInputTaxDetails);