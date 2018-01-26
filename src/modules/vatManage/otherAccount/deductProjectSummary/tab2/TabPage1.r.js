/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {fMoney,request} from '../../../../../utils'
import {SearchTable} from '../../../../../compoments'
import {Button,Icon,message} from 'antd'

const searchFields = [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:6,
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },{
        label:'查询期间',
        fieldName:'month',
        type:'monthPicker',
        span:6,
        componentProps:{
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选查询期间'
                }
            ]
        },
    },
]
const columns = [{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '应税项目',
    dataIndex: 'taxableProjectName',
},{
    title: '计税方法',
    dataIndex: 'taxMethod',
},{
    title: '税率',
    dataIndex: 'taxRate',
},{
    title: '价税合计 ',
    dataIndex: 'totalAmount',
    render:text=>fMoney(text),
},{
    title: '期初余额',
    dataIndex: 'initialBalance',
    render:text=>fMoney(text),
},{
    title: '本期发生额',
    dataIndex: 'currentAmount',
    render:text=>fMoney(text),
},{
    title: '本期应扣除金额',
    dataIndex: 'currentDeductAmount',
    render:text=>fMoney(text),
},{
    title: '本期实际扣除金额',
    dataIndex: 'actualDeductAmount',
    render:text=>fMoney(text),
},{
    title: '期末余额',
    dataIndex: 'endingBalance',
    render:text=>fMoney(text),
},{
    title: '销项税额',
    dataIndex: 'outputTax',
    render:text=>fMoney(text),
}];
export default class tab1 extends Component{
    state={
        updateKey:Date.now(),
        searchFieldsValues:{

        },
        searchTableLoading:false,
        statusParam:{},
        dataSource:[],
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    handleReset=()=>{
        request.get('/account/othertax/deducted/main/reset',{
            params:this.state.searchFieldsValues
        })
            .then(({data}) => {
                if(data.code===200){
                    message.success('重算成功!');
                    setTimeout(()=>{
                        this.refreshTable()
                    },200)
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            });
    }
    handleClick=type=>{
        let url = '';
        if(type ==='recount'){
            this.recount()
            return false;
        }
        switch (type){
            case '提交':
                url='/account/othertax/deducted/main/submit';
                break;
            case '撤回':
                url='/account/othertax/deducted/main/restore';
                break;
            default:
                break;
        }
        this.toggleSearchTableLoading(true)
        request.post(url,this.state.searchFieldsValues)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable();
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            }).catch(err=>{
            this.toggleSearchTableLoading(false)
        })
    }
    updateStatus=(values)=>{
        request.get('/account/landPrice/deductedDetails/listMain',{params:values}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data
                })
            }
        })
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }

    render(){
        const {updateKey,searchTableLoading,statusParam,dataSource} = this.state;
        console.log(statusParam);
        const {mainId,month} = this.state.searchFieldsValues;
        const disabled = !((mainId && month) && (statusParam && parseInt(statusParam.status, 0) === 1) && (dataSource.length > 0));
        const disabled2 = !((mainId && month) && (statusParam && parseInt(statusParam.status, 0) === 2) && (dataSource.length > 0));
        return(
            <div style={{marginTop: '-16px'}}>
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields,
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        },
                        onFieldsChange:values=>{
                            if(JSON.stringify(values) === "{}"){
                                this.setState({
                                    searchFieldsValues:{
                                        mainId:undefined,
                                        month:undefined
                                    }
                                })
                            }else if(values.mainId || values.month){
                                if(values.month){
                                    values.month = values.month.format('YYYY-MM')
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
                    backCondition={this.updateStatus}
                    tableOption={{
                        key:updateKey,
                        pagination:true,
                        size:'small',
                        scroll:{x:'120%'},
                        columns:columns,
                        cardProps:{
                            title:'项目信息'
                        },
                        url:'/account/othertax/deducted/list',
                        extra: <div>
                            {
                                JSON.stringify(statusParam) !== "{}" &&
                                <div style={{marginRight:30,display:'inline-block'}}>
                                    <span style={{marginRight:20}}>状态：<label style={{color:parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                                    <span>提交时间：{statusParam.lastModifiedDate}</span>
                                </div>
                            }
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled}
                                onClick={this.handleReset()}>
                                <Icon type="retweet" />
                                重算
                            </Button>
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled}
                                onClick={()=>this.handleClick('提交')}>
                                <Icon type="check" />
                                提交
                            </Button>
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled2}
                                onClick={()=>this.handleClick('撤回')}>
                                <Icon type="rollback" />
                                撤回提交
                            </Button>
                        </div>,
                        renderFooter:data=>{
                            return(
                                <div>
                                    <div style={{marginBottom:10}}>
                                        <span style={{width:100, display:'inline-block',textAlign: 'right',paddingRight:30}}>本页合计：</span>
                                        期初余额：<span className="amount-code">{data.pageAmount}</span>
                                        本期发生额：<span className="amount-code">{data.pageTaxAmount}</span>
                                        本期应扣除金额：<span className="amount-code">{data.pageTotalAmount}</span>
                                        本期实际扣除金额：<span className="amount-code">{data.pageTotalPrice}</span>
                                        期末余额：<span className="amount-code">{data.pageTotalPrice}</span>
                                        销项税额：<span className="amount-code">{data.pageTotalPrice}</span>
                                    </div>
                                </div>
                            )
                        },
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        }
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}