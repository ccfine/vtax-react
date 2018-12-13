/**
 * Created by liuliyuan on 2018/5/24.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import DrawerModal from 'compoments/drawerModal'
import {request,fMoney,requestResultStatus,composeBotton} from 'utils'
import moment from 'moment';
const formItemStyle={
    labelCol:{
        span:8
    },
    wrapperCol:{
        span:16
    }
}

const searchFields = (disabled,declare) =>(getFieldValue)=>[
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:8,
        formItemStyle,
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
        }
    },
    {
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
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择查询期间'
                    }
                ]
            },
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
        }
    },
    {
        label:'借方科目名称',
        fieldName:'debitSubjectName',
        span:8,
        formItemStyle,
    },
    {
        label:'借方科目代码',
        fieldName:'debitSubjectCode',
        span:8,
        formItemStyle,
    },
    {
        label:'贷方科目名称',
        fieldName:'creditSubjectName',
        span:8,
        formItemStyle,
    },
    {
        label:'贷方科目代码',
        fieldName:'creditSubjectCode',
        span:8,
        formItemStyle,
    },
    {
        label:'SAP凭证号',
        fieldName:'voucherNumSap',
        span:8,
        formItemStyle,
    }
]

const columns=[
    /*{
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'200px',
    },
    {
        title: '纳税主体编码',
        dataIndex: 'mainNum',
        width:'100px',
    },*/
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    /*{
        title: '项目名称',
        dataIndex: 'projectName',
        width:'200px',
    },*/
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },
    /*{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'100px',
    },*/
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: '过账日期',
        dataIndex: 'billingDate',
        width:'100px',
    /*},
    {
        title: '凭证号',
        dataIndex: 'voucherNum',
        width:'100px',
        sorter: true,*/
    },
    {
        title: 'SAP凭证号',
        dataIndex: 'voucherNumSap',
        width:'100px',
        sorter: true,
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        width:'500px',
    },
    /*{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'100px',
    },*/
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'200px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '借方辅助核算名称',
        dataIndex: 'debitProjectName',
        width:'200px',
    },
    {
        title: '借方辅助核算代码',
        dataIndex: 'debitProjectNum',
        width:'150px',
    },
    {
        title: '贷方科目名称',
        dataIndex: 'creditSubjectName',
        width:'300px',
    },
    {
        title: '贷方科目代码',
        dataIndex: 'creditSubjectCode',
        width:'100px',
    },
    {
        title: '贷方金额',
        dataIndex: 'creditAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'100px',
    },
    {
        title: '贷方辅助核算名称',
        dataIndex: 'creditProjectName',
        width:'150px',
    },
    {
        title: '贷方辅助核算代码',
        dataIndex: 'creditProjectNum',
        width:'150px',
    },
    {
        title:'辅助核算明细',
        children:[
            {
                title:'房间编码',
                dataIndex:'roomCode',
                width:'150px',
            },
            {
                title:'能源转售类型',
                dataIndex:'energyType',
                width:'150px',
            },
            {
                title:'付款成本项目',
                dataIndex:'paymentItem',
                width:'150px',
            },
            {
                title:'代扣代缴类型',
                dataIndex:'withholdingType',
                width:'150px',
            }
        ]
    },
];

const drawerFields = (disabled,filters) =>(getFieldValue)=>[
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:8,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            fetchAble:(disabled && filters.mainId) || false,
            url:`/taxsubject/profitCenterList/${disabled && filters.mainId}`,
        },
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择利润中心'
                }
            ]
        }
    },
    {
        label:'借方科目代码',
        fieldName:'debitSubjectCode',
        span:8,
        formItemStyle,
    },
    {
        label:'贷方科目代码',
        fieldName:'creditSubjectCode',
        span:8,
        formItemStyle,
    },
    {
        label:'SAP凭证号',
        fieldName:'voucherNumSap',
        span:8,
        formItemStyle,
    },
    {
        label:'修改标记',
        fieldName:'relationStagesFlag',
        type:'select',
        formItemStyle,
        span:8,
        options:[  //0-未修改;1-已修改
            {
                text:'未修改',
                value:'0'
            },{
                text:'已修改',
                value:'1'
            }
        ],
    }
]

const drawerColumns=[
    {
        title: '修改标记',
        dataIndex: 'relationStagesFlag',
        width:'150px',
        render: text => {
            //0-待修改;1-已修改；不传则所有状态
            let t = '';
            switch (parseInt(text,0)){
                case 0:
                    t='待修改';
                    break;
                case 1:
                    t='已修改';
                    break;
                default:
                //no default
            }
            return t
        }
    },
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        width:'200px',
    },
    {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },
    {
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:'100px',
    },
    {
        title: '过账日期',
        dataIndex: 'billingDate',
        width:'100px',
    },
    {
        title: 'SAP凭证号',
        dataIndex: 'voucherNumSap',
        width:'100px',
    },
    {
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
        //width:'500px',
    },
    {
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'200px',
    },
    {
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'100px',
    },
    {
        title: '贷方科目名称',
        dataIndex: 'creditSubjectName',
        width:'300px',
    },
    {
        title: '贷方科目代码',
        dataIndex: 'creditSubjectCode',
        width:'100px',
    },
    {
        title:'辅助核算明细',
        children:[
            {
                title:'房间编码',
                dataIndex:'roomCode',
                width:'150px',
            },
            {
                title:'能源转售类型',
                dataIndex:'energyType',
                width:'150px',
            },
            {
                title:'付款成本项目',
                dataIndex:'paymentItem',
                width:'150px',
            },
            {
                title:'代扣代缴类型',
                dataIndex:'withholdingType',
                width:'150px',
            }
        ]
    },
];
const markFieldsData = (dFilters) =>{
    return [
        {
            label:'项目分期',
            fieldName:'stageId',
            type:'asyncSelect',
            span:'22',
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                //doNotFetchDidMount:true,
                fetchAble:dFilters && dFilters.profitCenterId,
                url:`/project/stages/${(dFilters && dFilters.profitCenterId) || ''}?size=1000`
            },
            fieldDecoratorOptions:{
                rules:[
                    {
                        required:true,
                        message:'请选择关联项目分期'
                    }
                ]
            }
        }
    ]
}
export default class FinancialDocumentsCollection extends Component{
    state={
        updateKey:Date.now(),
        drawerUpdateKey:Date.now(),
        filters:{},
        dFilters:{},
        drawerVisible: false,
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam: {},
        totalSource:undefined,
        errMsg: ''
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    refreshTableDrawer = ()=>{
        this.setState({
            drawerUpdateKey:Date.now(),
            selectedRowKeys:[],
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    togglesDrawerVisible = drawerVisible => {
        this.setState({
            drawerVisible
        });
    };

    requestMessage = () => {
        request.get('/inter/financial/voucher/load/noStages', {
            params: this.state.filters
        }).then(({data}) => {
            if (data.code === 200) {
                this.setState({errMsg: ''})
            }else {
                this.setState({errMsg: data.msg})
            }
        })
    }

    render(){
        const {updateKey,drawerUpdateKey,filters,dFilters,drawerVisible,selectedRowKeys,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            handle = declare && declare.decAction==='edit';
        return(
            <React.Fragment>
                <SearchTable
                    doNotFetchDidMount={!disabled}
                    searchOption={{
                        fields:searchFields(disabled,declare),
                        cardProps:{
                            style:{
                                borderTop:0
                            },
                        }
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:columns,
                        url:`/inter/financial/voucher/manageList${handle ? '?handle=true' : ''}`,
                        scroll:{ x: 3350 ,y:window.screen.availHeight-500-(disabled?50:0)},
                        onSuccess:(params)=>{
                            this.setState({
                                filters:params,
                            },()=>{
                                handle && this.fetchResultStatus()
                                this.requestMessage()
                            })
                        },
                        cardProps: {
                            title: "财务凭证采集",
                            extra: (
                                <div>
                                    {
                                        <span style={{color: 'red',marginRight: '10px'}}>{this.state.errMsg}</span>
                                    }
                                    {
                                        (disabled && declare.decAction==='edit') &&  composeBotton([{
                                            type:'consistent',
                                            //icon:'exception',
                                            //btnType:'default',
                                            text:'查看缺失项目分期凭证',
                                            userPermissions:['1235000'],
                                            onClick:()=>{
                                                this.togglesDrawerVisible(true);
                                            }
                                        }],statusParam)
                                    }
                                    <TableTotal type={3} totalSource={totalSource} data={
                                        [
                                            {
                                                title:'合计',
                                                total:[
                                                    {title: '贷方金额', dataIndex: 'creditAmount'},
                                                ],
                                            }
                                        ]
                                    } />
                                </div>
                            )
                        },
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                    }}
                />
                <DrawerModal
                    title="凭证信息"
                    visible={drawerVisible}
                    onClose={()=>{
                        this.togglesDrawerVisible(false)
                        this.refreshTable();
                    }}
                    searchTableOptions={{
                        doNotFetchDidMount:JSON.stringify(filters) !=='{}',
                        searchOption:{
                            fields:drawerFields(JSON.stringify(filters) !=='{}',filters),
                            cardProps:{
                                style:{
                                    borderTop:0
                                },
                            }
                        },
                        tableOption:{
                            key:drawerUpdateKey,
                            pageSize:100,
                            columns:drawerColumns,
                            url:`/inter/financial/voucher/listStagesNumIsNull?mainId=${filters.mainId}&authMonth=${filters.authMonth}`,
                            scroll:{ x: 2500 ,y:window.screen.availHeight-450-(disabled?50:0)},
                            onSuccess:(params)=>{
                                console.log(params)
                                this.setState({
                                    dFilters:params,
                                    selectedRowKeys:[],
                                })
                            },
                            onRowSelect:parseInt(statusParam.status, 0) === 1 ? (selectedRowKeys)=>{
                                this.setState({
                                    selectedRowKeys
                                })
                            } : undefined,
                            cardProps: {
                                title: "凭证信息",
                                extra: (
                                    <div>
                                        {
                                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                                type:'mark',
                                                buttonOptions:{
                                                    text:'关联项目分期',
                                                },
                                                formOptions:{
                                                    filters: dFilters,
                                                    selectedRowKeys: selectedRowKeys,
                                                    url:"/inter/financial/voucher/relationStages",
                                                    fields: markFieldsData(dFilters),
                                                    onSuccess:()=>{
                                                        this.refreshTableDrawer()
                                                    },
                                                    //userPermissions:['1395000'],
                                                }
                                            }])
                                        }
                                    </div>
                                )
                            },
                        }
                    }}
                />
            </React.Fragment>
        )
    }
}