/**
 * Created by liuliyuan on 2018/5/17.
 */
import React, { Component } from 'react'
import {fMoney,requestResultStatus,listMainResultStatus,composeBotton} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import moment from 'moment';
const searchFields =(disabled,declare)=> [
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:8,
        componentProps:{
            labelInValue:true,
            disabled
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
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
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
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
    width:'16%',
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
    },
    width:90,
},{
    title: '税率',
    dataIndex: 'taxRate',
    render:text=>text? `${text}%`: text,
    width:50,
},{
    title: '价税合计 ',
    dataIndex: 'totalAmount',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '期初余额',
    dataIndex: 'initialBalance',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '本期发生额',
    dataIndex: 'currentAmount',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '本期应扣除金额',
    dataIndex: 'currentDeductAmount',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '本期实际扣除金额',
    dataIndex: 'actualDeductAmount',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '期末余额',
    dataIndex: 'endingBalance',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
},{
    title: '销项税额',
    dataIndex: 'outputTax',
    render:text=>fMoney(text),
    className:'table-money',
    width:'8%',
}];
// 总计数据结构，用于传递至TableTotal中
const totalData =  [{
        title:'合计',
        total:[
            {title: '本期实际扣除金额', dataIndex: 'totalActualDeductAmount'},
            {title: '本期应扣除金额', dataIndex: 'totalCurrentDeductAmount'},
            {title: '本期发生额', dataIndex: 'totalCurrentAmount'},
            {title: '期初余额', dataIndex: 'totalInitialBalance'},
            {title: '销项税额', dataIndex: 'totalOutputTax'},
        ],
    }
];
class OtherTaxableItemsDeduct extends Component{
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
        requestResultStatus('/account/othertax/deducted/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
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
        const { declare } = this.props;
        let disabled = !!declare;
        return(
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:searchFields(disabled,declare),
                        cardProps:{
                            style:{
                                borderTop:0,
                            }
                        }
                    }}
                    backCondition={(filters) => {
                        this.setState({
                            filters,
                        },() => {
                            this.fetchResultStatus();
                        });
                    }}
                    tableOption={{
                        key:updateKey,
                        pagination:true,
                        size:'small',
                        scroll:{x:1200,y:window.screen.availHeight-380-(disabled?50:0)},
                        columns:columns,
                        cardProps:{
                            title:'其他应税项目扣除台账'
                        },
                        url:'/account/othertax/deducted/list',
                        extra: <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/othertax/deducted/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1271007'],
                                }])
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'reset',
                                    url:'/account/othertax/deducted/reset',
                                    params:filters,
                                    userPermissions:['1271009'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/account/othertax/deducted/submit',
                                    params:filters,
                                    userPermissions:['1271010'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/account/othertax/deducted/revoke',
                                    params:filters,
                                    userPermissions:['1271011'],
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                            <TableTotal totalSource={totalSource} data={totalData} type={3}/>
                        </div>,
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
export default OtherTaxableItemsDeduct