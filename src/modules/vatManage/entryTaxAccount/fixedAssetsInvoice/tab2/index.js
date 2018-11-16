/**
 * Created by liuliyuan on 2018/10/12.
 */
import React, { Component } from 'react'
import {SearchTable,TableTotal} from 'compoments'
import {fMoney,composeBotton,requestResultStatus,listMainResultStatus} from 'utils'

const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
        //width:'200px',
    }, {
        title: '项目分期名称',
        dataIndex: 'stagesName',
        width:'200px',
    },{
        title: '不动产名称',
        dataIndex: 'assetName',
        width:'200px',
    },{
        title: '不动产编号',
        dataIndex: 'assetNo',
        width:'200px',
    },{
        title: "转固单号",
        dataIndex: "rotaryNum",
        width: "200px"
    },{
        title: "产品编码",
        dataIndex: "productNum",
        width: "200px"
    },{
        title: '入账日期',
        dataIndex: 'accountDate',
        width:'100px',
    },{
        title: '取得方式',
        dataIndex: 'acquisitionMode',
        width:'100px',
        render: (text) => {
            // 0-外部获取
            // 1-单独新建
            // 2-自建转自用
            let res = "";
            switch (parseInt(text, 0)) {
                case 0:
                    res = "外部获取";
                    break;
                case 1:
                    res = "单独新建";
                    break;
                case 2:
                    res = "自建转自用";
                    break;
                default:
                    break;
            }
            return res
        },
    },{
        title: '取得价值',
        dataIndex: 'gainValue',
        width:'100px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '资产类别',
        dataIndex: 'assetType',
        width:'100px',
    },{
        title: '资产状态',
        dataIndex: 'assetsState',
        width:'100px',
    },{
        title: '建筑面积',
        dataIndex: 'areaCovered',
        width:'100px',
    },{
        title: '税率',
        dataIndex: 'fixedTaxRate',
        width:'100px',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    },{
        title: '税额',
        dataIndex: 'fixedTaxAmount',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '发票号码/发票代码',
        dataIndex: 'invoiceNum',
        width:'200px',
        render: (text, record) => <span>{record.invoiceNum}/{record.invoiceCode}</span>,
    },{
        title: '开票日期',
        dataIndex: 'billingDate',
        width:'100px',
    },{
        title: '发票类型',
        dataIndex: 'invoiceType',
        width:'100px',
        render: (text) => {
            // s-专票
            // c-普票
            let res = "";
            switch (text) {
                case "s":
                    res = "专票";
                    break;
                case "c":
                    res = "普票";
                    break;
                default:
                    break;
            }
            return res
        }
    },{
        title: '不含税金额',
        dataIndex: 'withoutTax',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'invoiceTaxRate',
        width:'100px',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    },{
        title: '进项税额',
        dataIndex: 'incomeTaxAmount',
        width:'150px',
        className:'table-money',
        render:text=>fMoney(text),
    }
];

export default class Tab2 extends Component{
    state={
        visible:false,
        filters: {},
        statusParam: {},
        modalConfig:{
            type:''
        },
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    showModal=(type,mainId)=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                mainId
            }
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/account/income/fixedAssets/listMain',this.state.filters,result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tableKey,filters, statusParam,totalSource} = this.state;
        const { declare,searchFields } = this.props;
        let disabled = !!declare;
        return(
            <SearchTable
                doNotFetchDidMount={!disabled}
                style={{
                    marginTop:-16
                }}
                searchOption={{
                    fields:searchFields
                }}
                backCondition={(filters)=>{
                    this.mounted && this.setState({
                        filters,
                    },()=>{
                        this.fetchResultStatus()
                    })
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:100,
                    columns:getColumns(this),
                    url:'/account/income/fixedAssets/incomeBuildList',
                    cardProps:{
                        title: <span><label className="tab-breadcrumb">不动产进项发票台账 / </label>自建转自用自持类进项发票</span>,
                    },
                    extra: (
                        <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type: 'reset',
                                    url:'/account/income/fixedAssets/reset',
                                    params:filters,
                                    userPermissions:['1241009'],
                                    onSuccess:()=>{
                                        this.props.refreshTabs()
                                    },
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '进项税额', dataIndex: 'inTaxAmount'},
                                            {title: '不含税金额', dataIndex: 'withoutTax'},
                                        ],
                                    }
                                ]
                            } />
                        </div>
                    ),
                    onTotalSource: (totalSource) => {
                        this.mounted && this.setState({
                            totalSource
                        })
                    },
                    scroll:{
                        x:2900,
                        y:window.screen.availHeight-430,
                    },
                }}
            />
        )
    }
}