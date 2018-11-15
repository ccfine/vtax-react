/**
 * Created by liurunbin on 2018/1/24.
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 14:50:00
 *
 */
import React,{Component} from 'react'
import {message,Form} from 'antd'
import {SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'
import moment from 'moment';
import { WaterMarkComponent } from 'compoments'
const searchFields =(disabled,declare,defaultParams={})=>{
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
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || (defaultParams.mainId ? {key:defaultParams.mainId,label:''}:undefined),
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
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || (defaultParams.authMonth?moment(defaultParams.authMonth, 'YYYY-MM'):undefined),
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            },
        }
    ]
}
const getColumns = (context,getFieldDecorator,disabled) => [
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
            return disabled && record.generalAmountEdit ?
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
            return disabled && record.drawbackPolicyAmountEdit ?
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
        //tableUrl:'/account/prepaytax/list',
        tableUrl:'/account/taxCalculation/list',
        /**
         *修改状态和时间
         * */
        statusParam:{},
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
                request.post('/account/taxCalculation/save',{
                    data:values,
                    mainId:this.state.filters.mainId,
                    authMonth:this.state.filters.authMonth
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
    fetchResultStatus = ()=>{
        requestResultStatus('/tax/decConduct/main/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {searchTableLoading,tableKey,statusParam,tableUrl,filters} = this.state;
        const {getFieldDecorator} = this.props.form;
        let { declare,defaultParams} = this.props;
        defaultParams.authMonth = defaultParams.taxMonth;

        let disabled = !!declare;
        return(
            <div className="oneLine">
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:searchFields(disabled,declare,defaultParams),
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
                        },() => {
                            this.fetchResultStatus()
                        });
                    }}
                    tableOption={{
                        key:tableKey,
                        onRow:record=>({
                            onDoubleClick:()=>{console.log(record)}
                        }),
                        pagination:false,
                        columns:getColumns(this,getFieldDecorator,(disabled && parseInt(statusParam.status,10)===1)),
                        url:tableUrl,
                        cardProps:{
                            title:<span><label className="tab-breadcrumb">{this.props.title} / </label>税款计算表</span>
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-330-(disabled?50:0),
                        },
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/taxCalculation/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1911007'],
                                }])
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'save',
                                    icon:'save',
                                    text:'保存',
                                    userPermissions:['1911003'],
                                    onClick:()=>this.save()
                                }/*,{
                                    type:'reset',
                                    url:'/account/taxCalculation/reset',
                                    params:filters,
                                    userPermissions:['1371009'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/account/taxCalculation/submit',
                                    params:filters,
                                    // monthFieldName:'authMonth',
                                    userPermissions:['1371010'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/account/taxCalculation/revoke',
                                    params:filters,
                                    // monthFieldName:'authMonth',
                                    userPermissions:['1371011'],
                                    onSuccess:this.refreshTable,
                                }*/],statusParam)
                            }
                        </div>
                    }}
                >
                </SearchTable>
            </div>

        )
    }
}

export default Form.create()(WaterMarkComponent(TaxCalculation, 'ant-table-wrapper'));