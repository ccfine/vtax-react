/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import {requestResultStatus,fMoney,composeBotton} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import ViewDocumentDetails from 'modules/vatManage/entryManag/otherDeductionVoucher/viewDocumentDetailsPopModal'
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff'
}
const markFieldsData = [
    {
        label:'简易计税标记',
        fieldName:'commonlyFlag',
        type:'select',
        notShowAll:true,
        span:'22',
        options:[  //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
            {
                text:'标记',
                value:'1'
            },{
                text:'不标记',
                value:'0'
            }
        ],
        fieldDecoratorOptions:{
            rules:[
                {
                    required:true,
                    message:'请选择标记类型'
                }
            ]
        }
    }
]
const columns = context =>[
    {
        title: '纳税主体名称',
        dataIndex: 'mainName',
        width:'12%',
    },{
        title: '项目分期代码',
        dataIndex: 'stagesNum',
        width:'8%',
    },{
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'12%',
    },{
        title: '凭证日期',
        dataIndex: 'voucherDate',
        width:75,
    },{
        title: '凭证类型',
        dataIndex: 'voucherType',
        width:'6%',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
        render:(text,record)=>(
            <span title="查看凭证详情" onClick={()=>{
                context.setState({
                    voucherInfo:{
                        voucherId:record.voucherId,
                    }},()=>{
                    context.toggleViewModalVisible(true)
                })
            }} style={pointerStyle}>
                {text}
            </span>
        ),
        width:'8%',
    },{
        title: '凭证摘要',
        dataIndex: 'voucherAbstract',
    },{
        title: '借方科目代码',
        dataIndex: 'debitSubjectCode',
        width:'6%',
    },{
        title: '借方科目名称',
        dataIndex: 'debitSubjectName',
        width:'16%',
    },{
        title: '借方金额',
        dataIndex: 'debitAmount',
        render: text => fMoney(text),
        className: "table-money",
        width:'5%',
    },{
        title: '简易计税',
        dataIndex: 'commonlyFlag',
        sorter: true,
        render: text => {
            //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
            let res = "";
            switch (parseInt(text, 0)) {
                case 1:
                    res = "标记";
                    break;
                case 0:
                    res = ""; //不标记
                    break;
                default:
            }
            return res;
        },
        width:60,
    }
];
class GeneralTaxCertificate extends Component{
    state={
        visible:false,
        tableKey:Date.now(),
        voucherInfo:{},
        filters:{},
        selectedRowKeys:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
    }
    toggleViewModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/incomeSimpleOut/controller/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now(),
            selectedRowKeys:[],
        })
    }
    render(){
        const {visible,voucherInfo,tableKey,filters,selectedRowKeys,statusParam,totalSource} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={!disabled}
                searchOption={{
                    fields:this.props.searchFields.concat({
                        label:'标记类型',
                        fieldName:'commonlyFlag',
                        type:'select',
                        span:8,
                        options:[  //1-标记;0-不标记；不传则所有状态
                            {
                                text:'标记',
                                value:'1'
                            },{
                                text:'不标记',
                                value:'0'
                            }
                        ],
                    }),
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:columns(this),
                    url:'/account/incomeSimpleOut/controller/commonlyTaxList',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                            selectedRowKeys:[],
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    onRowSelect:parseInt(statusParam.status, 0) === 1 ? (selectedRowKeys)=>{
                        this.setState({
                            selectedRowKeys
                        })
                    } : undefined,
                    cardProps: {
                        title: <span><label className="tab-breadcrumb">简易计税进项税额转出台账 / </label>一般计税列表</span>,
                        extra:<div>
                            {
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/incomeSimpleOut/controller/commonly/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1391007'],
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([{
                                    type:'mark',
                                    formOptions:{
                                        filters: filters,
                                        selectedRowKeys: selectedRowKeys,
                                        url:"/account/incomeSimpleOut/controller/commonlyFlag",
                                        fields: markFieldsData,
                                        onSuccess:()=>{
                                            this.refreshTable()
                                        },
                                        userPermissions:['1395000'],
                                    }
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '借方金额', dataIndex: 'debitAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>,
                    },
                    onTotalSource: (totalSource) => {
                        this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:1800,
                        y:window.screen.availHeight-420-(disabled?50:0),
                    },
                }}
            >
                <ViewDocumentDetails
                    title="查看凭证详情"
                    visible={visible}
                    {...voucherInfo}
                    toggleViewModalVisible={this.toggleViewModalVisible} />
            </SearchTable>
        )
    }
}

export default GeneralTaxCertificate;