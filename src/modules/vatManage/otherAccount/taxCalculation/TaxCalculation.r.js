/**
 * Created by liurunbin on 2018/1/24.
 *@Last Modified by: xiaminghua
 *@Last Modified time: 2018-04-28 
 *
 */
import React,{Component} from 'react'
import {Button,Icon,message,Form,Modal} from 'antd'
import {SearchTable} from 'compoments'
import {request,getUrlParam,fMoney} from 'utils'
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
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
        resultFieldsValues:{

        },
        //tableUrl:'/account/prepaytax/list',
        tableUrl:'/account/taxCalculation/list',
        /**
         *修改状态和时间
         * */
        dataStatus:'',
        submitDate:'',

        hasData:false
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
        Modal.confirm({
            title: '友情提醒',
            content: '确定要重算吗',
            onOk : ()=> {
                this.toggleSearchTableLoading(true)
                request.put('/account/taxCalculation/reset',this.state.resultFieldsValues
                )
                    .then(({data}) => {
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success('重算成功!');
                            this.setState({
                                tableKey:Date.now()
                            })
                        }else{
                            message.error(`重算失败:${data.msg}`)
                        }
                    });
            },
            onCancel() {

            },
        })
    }
    handleClickActions = action => ()=>{
        if(action ==='recount'){
            this.recount()
            return false;
        }
    }


    save = e =>{
        e && e.preventDefault()
        this.toggleSearchTableLoading(true)
        this.props.form.validateFields((err, values) => {
            if(!err){
                request.post('/account/taxCalculation/save',{
                    data:values,
                    mainId:this.state.searchFieldsValues.mainId,
                    authMonth:this.state.searchFieldsValues.authMonth
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
        const {searchTableLoading,tableKey,submitDate,dataStatus,tableUrl,resultFieldsValues,hasData} = this.state;
        const {mainId,authMonth} = resultFieldsValues;
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
                    onSuccess:(params,data)=>{
                        this.setState({
                            searchFieldsValues:params,
                            hasData:data.length !== 0,
                            resultFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    pagination:false,
                    columns:getColumns(getFieldDecorator),
                    url:tableUrl,
                    extra:<div>
                        {
                            dataStatus && <div style={{marginRight:30,display:'inline-block'}}>
                                <span style={{marginRight:20}}>状态：<label style={{color:'#f5222d'}}>{
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
                        <SubmitOrRecallMutex
                          paramsType="object"
                          buttonSize="small"
                          restoreStr="revoke"//撤销接口命名不一致添加属性
                          url="/account/taxCalculation"
                          refreshTable={this.refreshTable}
                          toggleSearchTableLoading={this.toggleSearchTableLoading}
                          hasParam={mainId && hasData && authMonth}
                          dataStatus={dataStatus}
                          searchFieldsValues={this.state.resultFieldsValues}
                        />
                    </div>
                }}
            >
            </SearchTable>
        </div>

        )
    }
}
export default Form.create()(withRouter(TaxCalculation))