/**
 * Created by liurunbin on 2018/1/24.
 */
import React,{Component} from 'react'
import {Button,Icon,message,Form} from 'antd'
import {SearchTable} from '../../../../compoments'
import {request,getUrlParam} from '../../../../utils'
import EditableCell from './EditableCell.r'
import { withRouter } from 'react-router'
import moment from 'moment';
import {fMoney} from '../../../../utils'
const searchFields =(disabled)=>(getFieldValue)=> {
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
            }
        },
        {
            label:'查询期间',
            fieldName:'authMonth',
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
                initialValue: (disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM')) || undefined,
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
class TaxCalculation extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        searchFieldsValues:{

        },
        //tableUrl:'/account/prepaytax/list',
        tableUrl:'/account/taxCalculation/list',
        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

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
    recount = ()=>{
        this.toggleSearchTableLoading(true)
        request.get('/account/taxCalculation/reset',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    this.setState({
                        tableKey:Date.now()
                    })
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            })

    }
    handleClickActions = action => ()=>{
        let actionText,
            actionUrl;
        if(action ==='recount'){
            this.recount()
            return false;
        }
        switch (action){
            case 'submit':
                actionText='提交';
                actionUrl='/account/taxCalculation/submit';
                this.handleSubmit(actionUrl,actionText);
                break;
            case 'restore':
                actionText='撤回';
                actionUrl='/account/taxCalculation/revoke';
                this.handleRestore(actionUrl,actionText);
                break;
            default:
                break;
        }

    }
    handleSubmit = (actionUrl,actionText)=>{
        this.toggleSearchTableLoading(true)
        request.post(actionUrl,this.state.searchFieldsValues)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${actionText}成功！`);
                    this.refreshTable();
                }else{
                    message.error(`${actionText}失败:${data.msg}`)
                }
            }).catch(err=>{
            this.toggleSearchTableLoading(false)
        })
    }
    handleRestore = (actionUrl,actionText)=>{
        this.toggleSearchTableLoading(true)
        request.post(actionUrl,this.state.searchFieldsValues)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${actionText}成功！`);
                    this.refreshTable();
                }else{
                    message.error(`${actionText}失败:${data.msg}`)
                }
            }).catch(err=>{
            this.toggleSearchTableLoading(false)
        })
    }
    save = e =>{
        e && e.preventDefault()
        this.toggleSearchTableLoading(true)
        this.props.form.validateFields((err, values) => {
            if(!err){
                //this.refreshTable()
                request.post('/account/taxCalculation/save',values)
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
            params:this.state.searchFieldsValues
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
        const {searchTableLoading,tableKey,submitDate,dataStatus,tableUrl} = this.state;
        const {mainId,authMonth} = this.state.searchFieldsValues;
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
                                    authMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.authMonth){
                            if(values.authMonth){
                                values.authMonth = values.authMonth.format('YYYY-MM')
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
                //doNotFetchDidMount={true}
                spinning={searchTableLoading}
                tableOption={{
                    key:tableKey,
                    onRow:record=>({
                        onDoubleClick:()=>{console.log(record)}
                    }),
                    onDataChange:data=>{
                        this.fetchResultStatus()
                    },
                    pagination:false,
                    columns:getColumns(getFieldDecorator),
                    url:tableUrl,
                    extra:<div>
                        {
                            dataStatus && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'red'}}>{
                                    transformDataStatus(dataStatus)
                                }</label></span>
                                {
                                    submitDate && <span>提交时间：{submitDate}</span>
                                }
                            </div>
                        }
                        <Button
                            size="small"
                            style={{marginRight:5}}
                            disabled={parseInt(dataStatus,0)!==1}
                            onClick={this.save}><Icon type="save" />保存</Button>
                        <Button onClick={this.handleClickActions('recount')} disabled={parseInt(dataStatus,0)!==1} size='small' style={{marginRight:5}}>
                            <Icon type="retweet" />
                            重算
                        </Button>
                        <Button size="small" style={{marginRight:5}} onClick={this.handleClickActions('submit')} disabled={!(mainId && authMonth && parseInt(dataStatus,0) ===1)}><Icon type="file-add" />提交</Button>
                        <Button size="small" onClick={this.handleClickActions('restore')} disabled={!(mainId && authMonth && parseInt(dataStatus,0) ===2)}><Icon type="rollback" />撤回提交</Button>
                    </div>
                }}
            >
            </SearchTable>
        </div>

        )
    }
}
export default Form.create()(withRouter(TaxCalculation))