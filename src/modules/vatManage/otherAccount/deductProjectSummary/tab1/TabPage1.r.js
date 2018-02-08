/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import {fMoney,request,getUrlParam} from '../../../../../utils'
import {SearchTable} from '../../../../../compoments'
import PageTwo from './TabPage2.r'
import { withRouter } from 'react-router'
import moment from 'moment';

const searchFields =(disabled)=>(getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
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
            },
        },{
            label:'查询期间',
            fieldName:'month',
            type:'monthPicker',
            span:6,
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
        }, {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        }
    ]
}
const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '应税项目',
        dataIndex: 'taxableProjectName',
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            text = parseInt(text,0);
            if(text===1){
                return '一般计税方法'
            }
            if(text ===2){
                return '简易计税方法'
            }
            return text;
        }
    },{
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目编码 ',
        dataIndex: 'projectNum',
    },{
        title: '税率（征收率）',
        dataIndex: 'taxRate',
    },{
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    },{
        title: '价税合计',
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
    }
];
class tab1 extends Component{
    state={
        updateKey:Date.now(),
        searchFieldsValues:{

        },
        selectedRowKeys:undefined,
        selectedRows:[],
        dataSource:[],
        searchTableLoading:false,
        statusParam:{},
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
        request.get('/account/land/price/deducted/main/reset',{
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
        switch (type){
            case '提交':
                url='/account/land/price/deducted/main/submit';
                break;
            case '撤回':
                url='/account/land/price/deducted/main/restore';
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
        request.get('/account/land/price/deducted/main/get',{params:values}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                searchFieldsValues:{
                    mainId:getUrlParam('mainId') || undefined,
                    month:moment(getUrlParam('authMonthStart'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }

    render(){
        const {updateKey,searchTableLoading,selectedRowKeys,selectedRows,searchFieldsValues,statusParam,dataSource} = this.state;
        const {mainId,month} = this.state.searchFieldsValues;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
            <div style={{marginTop: '-16px'}}>
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(disabled),
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        },
                        onFieldsChange:values=>{
                            if(JSON.stringify(values) === "{}"){
                                this.setState({
                                    searchFieldsValues:{
                                        mainId:(disabled && getUrlParam('mainId')) || undefined,
                                        month:(disabled && moment(getUrlParam('authMonthStart'), 'YYYY-MM').format('YYYY-MM')) || undefined,
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
                        },
                    }}
                    backCondition={this.updateStatus}
                    tableOption={{
                        key:updateKey,
                        pagination:false,
                        size:'small',
                        scroll:{x:'200%'},
                        columns:columns,
                        cardProps:{
                            title:'项目信息'
                        },
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                selectedRowKeys:selectedRowKeys[0],
                                selectedRows,
                            })
                        },
                        rowSelection:{
                            type:'radio',
                        },

                        url:'account/land/price/deducted/project/list',
                        extra: <div>
                            {
                                (JSON.stringify(statusParam) !== "{}" && dataSource.length>0) &&
                                <div style={{marginRight:30,display:'inline-block'}}>
                                    <span style={{marginRight:20}}>状态：<label style={{color:parseInt(statusParam.status, 0) === 1 ? 'red' : 'green'}}>{parseInt(statusParam.status, 0) === 1 ? '保存' : '提交'}</label></span>
                                    <span>提交时间：{statusParam.lastModifiedDate}</span>
                                </div>
                            }
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={!((mainId && month)&&(statusParam && parseInt(statusParam.status, 0) === 1))}
                                onClick={this.handleReset}>
                                <Icon type="retweet" />
                                重算
                            </Button>
                            {/*<Button size='small' style={{marginRight:5}}>
                                                    <Icon type="check" />
                                                    清算
                                                </Button>*/}
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={!((mainId && month)&&(statusParam && parseInt(statusParam.status, 0) === 1))}
                                onClick={()=>this.handleClick('提交')}>
                                <Icon type="check" />
                                提交
                            </Button>
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={!((mainId && month)&&(statusParam && parseInt(statusParam.status, 0) === 2))}
                                onClick={()=>this.handleClick('撤回')}>
                                <Icon type="rollback" />
                                撤回提交
                            </Button>
                        </div>,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        }
                    }}
                >
                </SearchTable>

                <PageTwo id={selectedRowKeys} selectedRows={selectedRows} filters={searchFieldsValues} updateKey={updateKey}/>
            </div>
        )
    }
}
export default withRouter(tab1)