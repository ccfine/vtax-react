/**
 * Created by liurunbin on 2018/1/24.
 */
import React,{Component} from 'react'
import {Button,Icon,message,Form} from 'antd'
import {SearchTable} from '../../../../compoments'
import {fMoney,request,getUrlParam} from '../../../../utils'
import EditableCell from './EditableCell.r'
import { withRouter } from 'react-router'
import moment from 'moment';

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
            return <EditableCell fieldName={record.id} getFieldDecorator={getFieldDecorator} editAble={record.editAble} />
        }
    },
    {
        title:'即征即退货物及劳务和应税服务',
        dataIndex:'drawbackPolicyAmount',
        render:text=>fMoney(text),
        className:'table-money'
    }
];
const transformDataStatus = status =>{
    status = parseInt(status,0)
    if(status===1){
        return '保存';
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
        submitDate:''
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
        this.setState({
            tableUrl:'/account/prepaytax/reset',
            tableKey:Date.now()
        },()=>{
            this.setState({
                tableUrl:'/account/prepaytax/list'
            })
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
                actionUrl='/account/prepaytax/submit';
                break;
            case 'restore':
                actionText='撤回';
                actionUrl='/account/prepaytax/restore';
                break;
            case 'recount':
                actionText='重算';
                actionUrl='/account/salehouse/restore';
                break;
            default:
                break;
        }
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
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if(!err){
                this.refreshTable()
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey,submitDate,dataStatus,tableUrl} = this.state;
        const {mainId,receiveMonth} = this.state.searchFieldsValues;
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
                                    receiveMonth:undefined
                                }
                            })
                        }else if(values.mainId || values.receiveMonth){
                            if(values.receiveMonth){
                                values.receiveMonth = values.receiveMonth.format('YYYY-MM')
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
                        if(data && data.length !==0){
                            this.setState({
                                submitDate:data[0].lastModifiedDate,
                                dataStatus:data[0].status
                            })
                        }
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
                        <Button size="small" style={{marginRight:5}} onClick={this.save}><Icon type="save" />保存</Button>
                        <Button onClick={this.handleClickActions('recount')} disabled={!(mainId && receiveMonth)} size='small' style={{marginRight:5}}>
                            <Icon type="retweet" />
                            重算
                        </Button>
                        <Button size="small" style={{marginRight:5}} onClick={this.handleClickActions('submit')} disabled={!(mainId && receiveMonth)}><Icon type="file-add" />提交</Button>
                        <Button size="small" onClick={this.handleClickActions('restore')} disabled={!(mainId && receiveMonth)}><Icon type="rollback" />撤回提交</Button>
                    </div>
                }}
            >
            </SearchTable>
        </div>

        )
    }
}
export default Form.create()(withRouter(TaxCalculation))