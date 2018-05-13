/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, { Component } from 'react'
import {SearchTable} from 'compoments'
import PageTwo from './TabPage2.r'
import {fMoney,getUrlParam} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}
const searchFields = (disabled) => {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:8,
            formItemStyle,
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
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            formItemStyle,
            span:8,
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
        }, {
            label:'项目名称',
            fieldName:'projectName',
            type:'input',
            span:8,
            formItemStyle,
        }, {
            label:'分期名称',
            fieldName:'stagesName',
            type:'input',
            span:8,
            formItemStyle,
        }
    ]
}
const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '项目分期名称',
        dataIndex: 'contractNum',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesName',
    },{
        title: '财务期间 ',
        dataIndex: 'voucherDate',
    },{
        title: '科目名称',
        dataIndex: 'creditSubjectName',
    },{
        title: '科目代码',
        dataIndex: 'creditSubjectCode',
    },{
        title: '收入金额',
        dataIndex: 'creditAmount',
        render:text=>fMoney(text),
        className: "table-money"
    }
];
class IncomeCheck extends Component{
    state={
        updateKey:Date.now(),
        pageTwoKey:Date.now(),
        filters:{},
        selectedRows:[],
        searchTableLoading:false,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        },()=>{
            this.updateStatus()
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                filters:{
                    mainId:getUrlParam('mainId') || undefined,
                    authMonth:moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateKey !== this.props.updateKey){
            this.setState({
                filters:nextProps.filters,
                updateKey:nextProps.updateKey
            });
        }
    }

    render(){
        const {updateKey,pageTwoKey,searchTableLoading,filters} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
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
                }}
                tableOption={{
                    key:updateKey,
                    pageSize:10,
                    columns:columns,
                    cardProps:{
                        title:'财务收入数据'
                    },
                    url:'/income/financeDetails/controller/incomeCheck',
                }}
            >

                <PageTwo key={pageTwoKey} filters={filters} />
            </SearchTable>

        )
    }
}
export default withRouter(IncomeCheck)