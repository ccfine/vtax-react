/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: xiaminghua
 * @Last Modified time: 2018-04-28
 *
 */
import React, { Component } from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {fMoney,request,getUrlParam,listMainResultStatus} from 'utils'
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
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
            span:8,
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
            fieldName:'authMonth',
            type:'monthPicker',
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
            fieldName:'projectId',
            type:'asyncSelect',
            span:8,
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
            let res = "";
            switch (parseInt(text, 10)) {
                case 1:
                    res = "一般计税方法";
                    break;
                case 2:
                    res = "简易计税方法";
                    break;
                default:
            }
            return res;
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
        render:text=>text? `${text}%`: text,
        className:'text-right',
    },{
        title: '土地出让合同编号',
        dataIndex: 'contractNum',
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '期初余额',
        dataIndex: 'initialBalance',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '本期发生额',
        dataIndex: 'currentAmount',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '本期应扣除金额',
        dataIndex: 'currentDeductAmount',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '本期实际扣除金额',
        dataIndex: 'actualDeductAmount',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '期末余额',
        dataIndex: 'endingBalance',
        render:text=>fMoney(text),
        className: "table-money",
    },{
        title: '销项税额',
        dataIndex: 'outputTax',
        render:text=>fMoney(text),
        className: "table-money",
    }
];
class tab1 extends Component{
    state={
        updateKey:Date.now(),
        pageTwoKey:Date.now(),
        filters:{},
        selectedRows:[],
        searchTableLoading:false,
        /**
         *修改状态和时间
         * */
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
        Modal.confirm({
            title: '友情提醒',
            content: '确定要重算吗',
            onOk : ()=> {
                request.put('/account/land/price/deducted/main/reset',this.state.filters)
                    .then(({data}) => {
                        if(data.code===200){
                            message.success('重算成功!');
                            this.refreshTable();
                        }else{
                            message.error(`重算失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            }
        })

    }
    updateStatus=()=>{
        request.get('/account/land/price/deducted/main/listMain',{params:this.state.filters})
            .then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
        })
        .catch(err => {
            message.error(err.message)
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
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({
                updateKey:props.updateKey
            });
        }
    }

    render(){
        const {updateKey,pageTwoKey,searchTableLoading,selectedRows,filters,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = this.state.filters;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
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
                                    filters:{
                                        mainId:(disabled && getUrlParam('mainId')) || undefined,
                                        authMonth:(disabled && moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM')) || undefined,
                                    }
                                })
                            }else if(values.mainId || values.authMonth){
                                if(values.authMonth){
                                    values.authMonth = values.authMonth.format('YYYY-MM')
                                }
                                this.setState(prevState=>({
                                    filters:{
                                        ...prevState.filters,
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
                        rowSelection:{type:'radio'},
                        onRowSelect:(selectedRowKeys,selectedRows)=>{
                            this.setState({
                                selectedRows,
                                pageTwoKey:Date.now(),
                            })
                        },
                        onSuccess:()=>{
                            this.setState({
                                selectedRows:[],
                                pageTwoKey:Date.now(),
                            })
                        },
                        url:'account/land/price/deducted/project/list',
                        extra: <div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled1}
                                onClick={this.handleReset}>
                                <Icon type="retweet" />
                                重算
                            </Button>
                            {/*<Button size='small' style={{marginRight:5}}>
                                                    <Icon type="check" />
                                                    清算
                                                </Button>*/}
                            <SubmitOrRecallMutex
                                buttonSize="small"
                                paramsType="object"
                                url="/account/land/price/deducted/main"
                                restoreStr="revoke"//撤销接口命名不一致添加属性
                                refreshTable={this.refreshTable}
                                toggleSearchTableLoading={this.toggleSearchTableLoading}
                                hasParam={mainId && authMonth}
                                dataStatus={statusParam.status}
                                searchFieldsValues={this.state.filters}
                              />
                        </div>,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        },
                    }}
                >
                </SearchTable>

                <PageTwo key={pageTwoKey} selectedRows={selectedRows} filters={filters} />
            </div>
        )
    }
}
export default withRouter(tab1)
