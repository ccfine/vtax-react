/**
 * Created by liurunbin on 2018/1/24.
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 15:29:57
 *
 */
import React,{Component} from 'react'
import {message,Form} from 'antd'
import {SearchTable} from 'compoments'
import {request,fMoney,composeBotton} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'
import moment from 'moment';
import { WaterMarkComponent } from 'compoments'
const searchFields =(defaultParams={})=>(getFieldValue)=>{
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16 
                }
            },
            componentProps:{
                labelInValue:true,
            },
            fieldDecoratorOptions:{
                initialValue: defaultParams.mainId ? {key:defaultParams.mainId,label:''}:undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
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
            },
            fieldDecoratorOptions:{
                initialValue: defaultParams.authMonth?moment(defaultParams.authMonth, 'YYYY-MM'):undefined,
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            },
        },
        {
            label: '利润中心',
            fieldName: 'profitCenterId',
            type: 'asyncSelect',
            span: 6,
            fieldDecoratorOptions: {
                initialValue: JSON.stringify(defaultParams) !== "{}" ? (defaultParams && defaultParams.profitCenterId) : undefined ,
                rules: [
                    {
                        required: true,
                        message: '请选择利润中心'
                    }
                ]
            },
            componentProps: {
                fieldTextName: 'profitName',
                fieldValueName: 'id',
                doNotFetchDidMount: false,
                fetchAble: (getFieldValue('main') && getFieldValue('main').key) || (JSON.stringify(defaultParams) !== "{}" && (defaultParams && defaultParams.mainId)) || false,
                url: `/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key) || (JSON.stringify(defaultParams) !== "{}" && (defaultParams && defaultParams.mainId))}`,
            }
        }
    ]
}
const getColumns = (context,getFieldDecorator) => [
    {
        title:'栏次',
        dataIndex:'idx',
        width:'8%',
        className:'text-center',
    },{
        title:'项目名称',
        dataIndex:'projectName',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>

            </span>
        ),
        width:'42%',
    },
    {
        title:'一般货物及劳务和应税服务',
        dataIndex:'generalAmount',
        render:(text,record)=>{
            return record.generalAmountEdit ?
                <NumericInputCell
                    fieldName={`generalAmount_${record.id}`}
                    initialValue={text==='0' ? '0.00' : fMoney(text)}
                    getFieldDecorator={getFieldDecorator}
                    editAble={record.generalAmountEdit}
                    componentProps={{
                        onFocus:(e)=>context.handleFocus(e,`generalAmount_${record.id}`),
                        onBlur:(e)=>context.handleBlur(e,`generalAmount_${record.id}`)
                    }}
                /> : fMoney(text)
        },
        className:'table-money',
        width:'25%',
    },
    {
        title:'即征即退货物及劳务和应税服务',
        dataIndex:'drawbackPolicyAmount',
        render:(text,record)=>{
            return record.drawbackPolicyAmountEdit ?
                <NumericInputCell
                    fieldName={`drawbackPolicyAmount_${record.id}`}
                    initialValue={text==='0' ? '0.00' : fMoney(text)}
                    getFieldDecorator={getFieldDecorator}
                    editAble={record.drawbackPolicyAmountEdit}
                    componentProps={{
                        onFocus:(e)=>context.handleFocus(e,`drawbackPolicyAmount_${record.id}`),
                        onBlur:(e)=>context.handleBlur(e,`drawbackPolicyAmount_${record.id}`)
                    }}
                /> : fMoney(text)
        },
        className:'table-money',
        width:'25%',
    }
];
class TaxCalculation extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{},
        tableUrl:'/account/taxCalculation/pc/list',
    }
    componentDidMount() {
        const { defaultParams } = this.props;
        // 解决从报表管理-业务报表页进入后，切换tab首次不请求接口问题
        if (defaultParams.hasOwnProperty('mainId')) {
            this.setState({
                filters:{
                    ...defaultParams,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
        })
    }

    save = e =>{
        e && e.preventDefault()
        this.toggleSearchTableLoading(true)
        this.props.form.validateFields((err, values) => {
            if(!err){
                for(let key in values){
                    values[key] = values[key].replace(/\$\s?|(,*)/g, '')
                }
                request.post('/account/taxCalculation/pc/save',{
                    data:values,
                    ...this.state.filters
                })
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success(`保存成功！`);
                            this.props.form.resetFields();
                            this.refreshTable();
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    }).catch(err=>{
                        message.error(err.message)
                        this.toggleSearchTableLoading(false)
                    })
            }
        })
    }
    handleFocus = (e,fieldName) => {
        e && e.preventDefault()
        const {setFieldsValue,getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if(value === '0.00'){
            setFieldsValue({
                [fieldName]:''
            })
        }else{
            setFieldsValue({
                [fieldName]:value.replace(/\$\s?|(,*)/g, '')
            })
        }
    }

    handleBlur = (e,fieldName) => {
        e && e.preventDefault()
        const {setFieldsValue,getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if(value !== ''){
            setFieldsValue({
                [fieldName]:fMoney(value)
            })
        }else{
            setFieldsValue({
                [fieldName]:'0.00'
            })
        }
    }
    render(){
        const {searchTableLoading,tableKey,tableUrl,filters} = this.state;
        const {getFieldDecorator} = this.props.form;
        let { defaultParams} = this.props;
        defaultParams.authMonth = defaultParams.taxMonth;
        return(
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(defaultParams),
                        onResetFields:()=>{
                            this.setState({
                                filters: {}
                            },()=>{
                                this.props.onParamsChange && this.props.onParamsChange({});
                            })
                        },
                        cardProps:{
                            className:'',
                            style:{borderTop:0}
                        },
                    }}
                    spinning={searchTableLoading}
                    backCondition={(filters) => {
                        filters.taxMonth = filters.authMonth;
                        this.props.onParamsChange && this.props.onParamsChange(filters);
                        this.setState({
                            filters,
                        });
                    }}
                    tableOption={{
                        key:tableKey,
                        onRow:record=>({
                            onDoubleClick:()=>{console.log(record)}
                        }),
                        pagination:false,
                        columns:getColumns(this,getFieldDecorator),
                        url:tableUrl,
                        cardProps:{
                            title:<span><label className="tab-breadcrumb">{this.props.title} / </label>税款计算表</span>
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-350,
                        },
                        extra:<div>
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/taxCalculation/pc/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['2161007'],
                                },{
                                    type:'save',
                                    icon:'save',
                                    text:'保存',
                                    userPermissions:['2161003'],
                                    onClick:()=>this.save()
                                }])
                            }
                        </div>
                    }}
                />

        )
    }
}

export default Form.create()(WaterMarkComponent(TaxCalculation, 'ant-table-wrapper'));