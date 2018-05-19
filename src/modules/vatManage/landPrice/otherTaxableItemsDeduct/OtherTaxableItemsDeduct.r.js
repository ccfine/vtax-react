/**
 * Created by liuliyuan on 2018/5/17.
 */
import React, { Component } from 'react'
import {fMoney,requestResultStatus,getUrlParam,listMainResultStatus,composeBotton} from 'utils'
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
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
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
    fetchResultStatus = ()=>{
        requestResultStatus('/account/othertax/deducted/main/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
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
        const {updateKey,searchTableLoading,statusParam,totalSource,filters} = this.state;
        const {search} = this.props.location;
        let disabled = !!search;
        return(
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(disabled),
                    }}
                    tableOption={{
                        key:updateKey,
                        pagination:true,
                        size:'small',
                        scroll:{x:'120%'},
                        columns:columns,
                        cardProps:{
                            title:'其他应税项目扣除台账列表'
                        },
                        url:'/account/othertax/deducted/list',
                        extra: <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                    type:'reset',
                                    url:'/account/othertax/deducted/main/reset',
                                    params:filters,
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/account/othertax/deducted/main/submit',
                                    params:filters,
                                    monthFieldName:'authMonth',
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/account/othertax/deducted/main/revoke',
                                    params:filters,
                                    monthFieldName:'authMonth',
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                            <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                        </div>,
                        onSuccess:(params)=>{
                            this.setState({
                                filters:params,
                            },()=>{
                                this.fetchResultStatus()
                            })
                        },
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                    }}
                />
        )
    }
}
export default withRouter(tab1)