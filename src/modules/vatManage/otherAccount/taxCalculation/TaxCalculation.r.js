/**
 * Created by liurunbin on 2018/1/24.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-07-17 14:19:29
 *
 */
import React,{Component} from 'react'
import { compose } from 'redux';
import {connect} from 'react-redux'
import {message,Form} from 'antd'
import {SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import { NumericInputCell } from 'compoments/EditableCell'
import moment from 'moment';
const searchFields =(disabled,declare)=>{
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
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
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && declare.mainId) || undefined,
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
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
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
const getColumns = (getFieldDecorator,disabled) => [
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
                    initialValue={text}
                    getFieldDecorator={getFieldDecorator}
                    editAble={record.generalAmountEdit}
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
                    initialValue={text}
                    getFieldDecorator={getFieldDecorator}
                    editAble={record.drawbackPolicyAmountEdit}
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
    fetchResultStatus = ()=>{
        requestResultStatus('/account/taxCalculation/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {searchTableLoading,tableKey,statusParam,tableUrl,filters} = this.state;
        const {getFieldDecorator} = this.props.form;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
        <div>
            <SearchTable
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:searchFields(disabled,declare),
                    cardProps:{
                        className:''
                    },
                }}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    onRow:record=>({
                        onDoubleClick:()=>{console.log(record)}
                    }),
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    pagination:false,
                    columns:getColumns(getFieldDecorator,(disabled && parseInt(statusParam.status,10)===1)),
                    url:tableUrl,
                    cardProps:{
                        title:'税款计算台账'
                    },
                    scroll:{
                        y:window.screen.availHeight-320,
                        x:1000,
                    },
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'save',
                                icon:'save',
                                text:'保存',
                                userPermissions:['1371003'],
                                onClick:()=>this.save()
                            },{
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
                            }],statusParam)
                        }
                    </div>
                }}
            >
            </SearchTable>
        </div>

        )
    }
}

export default Form.create()(TaxCalculation);