/**
 * Created by liurunbin on 2018/1/24.
 *@Last Modified by: xiaminghua
 *@Last Modified time: 2018-04-28 
 *
 */
import React,{Component} from 'react'
import {message,Form} from 'antd'
import {SearchTable} from 'compoments'
import {request,getUrlParam,fMoney,listMainResultStatus,composeBotton} from 'utils'
import EditableCell from './EditableCell.r'
import { withRouter } from 'react-router'
import moment from 'moment';
const searchFields =(disabled)=>(getFieldValue)=> {
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
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
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
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
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
const getColumns = getFieldDecorator => [
    {
        title:'项目名称',
        dataIndex:'projectName',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>

            </span>
        )
    },
    {
        title:'一般货物及劳务和应税服务',
        dataIndex:'generalAmount',
        render:(text,record)=>{
            return record.generalAmountEdit ?
                <EditableCell fieldName={`generalAmount_${record.id}`} renderValue={text} getFieldDecorator={getFieldDecorator}/> : fMoney(text)
        },
        className:'table-money'
    },
    {
        title:'即征即退货物及劳务和应税服务',
        dataIndex:'drawbackPolicyAmount',
        render:(text,record)=>{
            return record.drawbackPolicyAmountEdit ?
                <EditableCell
                    fieldName={`drawbackPolicyAmount_${record.id}`}
                    renderValue={text} getFieldDecorator={getFieldDecorator} editAble={record.drawbackPolicyAmountEdit} />
                : fMoney(text)
        },
        className:'table-money'
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    fetchResultStatus = ()=>{
        request.get('/account/taxCalculation/listMain',{
            params:this.state.filters
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam:data.data,
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
        const {searchTableLoading,tableKey,statusParam,tableUrl,filters} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
        <div>
            <SearchTable
                doNotFetchDidMount={true}
                searchOption={{
                    fields:searchFields(disabled),
                    cardProps:{
                        className:''
                    },
                }}
                //doNotFetchDidMount={true}
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
                    columns:getColumns(getFieldDecorator),
                    url:tableUrl,
                    extra:<div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                type:'save',
                                text:'保存',
                                icon:'save',
                                onClick:()=>this.save()
                            },{
                                type:'reset',
                                url:'/account/taxCalculation/reset',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'submit',
                                url:'/account/taxCalculation/submit',
                                params:filters,
                                monthFieldName:'authMonth',
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/taxCalculation/revoke',
                                params:filters,
                                monthFieldName:'authMonth',
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
export default Form.create()(withRouter(TaxCalculation))