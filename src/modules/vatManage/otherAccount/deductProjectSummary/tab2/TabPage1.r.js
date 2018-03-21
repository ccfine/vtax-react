/**
 * Created by liurunbin on 2018/1/2.
 */
import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import {fMoney,request,getUrlParam,listMainResultStatus} from '../../../../../utils'
import {SearchTable} from '../../../../../compoments'
import { withRouter } from 'react-router'
import moment from 'moment';
const searchFields =(disabled)=> [
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
        fieldName:'authMonth',
        type:'monthPicker',
        span:6,
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
        request.put('/account/othertax/deducted/main/reset',this.state.filters
        )
            .then(({data}) => {
                if(data.code===200){
                    message.success('重算成功!');
                    this.refreshTable();
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            });
    }
    handleClick=type=>{
        let url = '';
        switch (type){
            case '提交':
                url='/account/othertax/deducted/main/submit';
                break;
            case '撤回':
                url='/account/othertax/deducted/main/revoke';
                break;
            default:
                break;
        }
        this.toggleSearchTableLoading(true)
        request.post(url,this.state.filters)
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
        const {updateKey,searchTableLoading,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = this.state.filters;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
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
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled1}
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
                                <div className="footer-total">
                                    <div>
                                        <label>本页合计：</label>
                                        期初余额：<span className="amount-code">{fMoney(data.pageInitialBalance)}</span>
                                        本期发生额：<span className="amount-code">{fMoney(data.pageCurrentAmount)}</span>
                                        本期应扣除金额：<span className="amount-code">{fMoney(data.pageCurrentDeductAmount)}</span>
                                        本期实际扣除金额：<span className="amount-code">{fMoney(data.pageActualDeductAmount)}</span>
                                        期末余额：<span className="amount-code">{fMoney(data.pageEndingBalance)}</span>
                                        销项税额：<span className="amount-code">{fMoney(data.pageOutputTax)}</span>
                                        价税合计：<span className="amount-code">{fMoney(data.pageTotalAmount)}</span>
                                    </div>
                                    <div>
                                        <label>总计：</label>
                                        期初余额：<span className="amount-code">{fMoney(data.totalInitialBalance)}</span>
                                        本期发生额：<span className="amount-code">{fMoney(data.totalCurrentAmount)}</span>
                                        本期应扣除金额：<span className="amount-code">{fMoney(data.totalCurrentDeductAmount)}</span>
                                        本期实际扣除金额：<span className="amount-code">{fMoney(data.totalActualDeductAmount)}</span>
                                        期末余额：<span className="amount-code">{fMoney(data.totalEndingBalance)}</span>
                                        销项税额：<span className="amount-code">{fMoney(data.totalOutputTax)}</span>
                                        价税合计：<span className="amount-code">{fMoney(data.totalTotalAmount)}</span>
                                    </div>
                                </div>
                            )
                        },
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
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