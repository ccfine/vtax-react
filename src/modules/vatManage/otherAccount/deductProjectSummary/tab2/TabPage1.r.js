/**
 * Created by liurunbin on 2018/1/2.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-07 12:25:16
 *
 */
import React, { Component } from 'react'
import {Button,Icon,message,Modal} from 'antd'
import {fMoney,request,getUrlParam,listMainResultStatus} from 'utils'
import SubmitOrRecallMutex from 'compoments/buttonModalWithForm/SubmitOrRecallMutex.r'
import {SearchTable,TableTotal} from 'compoments'
import { withRouter } from 'react-router'
import moment from 'moment';
const searchFields =(disabled)=> [
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
    title: '税率',
    dataIndex: 'taxRate',
    render:text=>text? `${text}%`: text,
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
// 总计数据结构，用于传递至TableTotal中
const totalData =  [
    {
        title:'本页合计',
        total:[
            {title: '期初余额', dataIndex: 'pageInitialBalance'},
            {title: '本期发生额', dataIndex: 'pageCurrentAmount'},
            {title: '本期应扣除金额', dataIndex: 'pageCurrentDeductAmount'},
            {title: '本期实际扣除金额', dataIndex: 'pageActualDeductAmount'},
            {title: '期末余额', dataIndex: 'pageEndingBalance'},
            {title: '销项税额', dataIndex: 'pageOutputTax'},
            {title: '价税合计', dataIndex: 'pageTotalAmount'},
        ],
    },{
        title:'总计',
        total:[
            {title: '期初余额', dataIndex: 'totalInitialBalance'},
            {title: '本期发生额', dataIndex: 'totalCurrentAmount'},
            {title: '本期应扣除金额', dataIndex: 'totalCurrentDeductAmount'},
            {title: '本期实际扣除金额', dataIndex: 'totalActualDeductAmount'},
            {title: '期末余额', dataIndex: 'totalEndingBalance'},
            {title: '销项税额', dataIndex: 'totalOutputTax'},
            {title: '价税合计', dataIndex: 'totalTotalAmount'},
        ],
    }
];
class tab1 extends Component{
    state={
        updateKey:Date.now(),
        filters:{},
        searchTableLoading:false,
        dataSource:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        },()=>{
            this.updateStatus()
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
                request.put('/account/othertax/deducted/main/reset',this.state.filters)
                    .then(({data}) => {
                        if(data.code===200){
                            message.success('重算成功!');
                            this.refreshTable();
                        }else{
                            message.error(`重算失败:${data.msg}`)
                        }
                    });
            }
        })
    }
    updateStatus=()=>{
        request.get('/account/othertax/deducted/main/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
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
        const {updateKey,searchTableLoading,dataSource,statusParam,totalSource} = this.state;
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
                                        mainId:undefined,
                                        authMonth:undefined
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
                            <SubmitOrRecallMutex
                                buttonSize="small"
                                paramsType="object"
                                url="/account/othertax/deducted/main"
                                restoreStr="revoke"//撤销接口命名不一致添加属性
                                refreshTable={this.refreshTable}
                                toggleSearchTableLoading={this.toggleSearchTableLoading}
                                hasParam={mainId && authMonth}
                                dataStatus={statusParam.status}
                                searchFieldsValues={this.state.filters}
                              />
                              <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                        </div>,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        },
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}
export default withRouter(tab1)
