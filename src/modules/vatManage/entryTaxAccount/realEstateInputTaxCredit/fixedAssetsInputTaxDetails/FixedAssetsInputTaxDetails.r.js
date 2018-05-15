/**
 * Created by liuliyuan on 2018/5/13.
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {message} from 'antd'
import {SearchTable} from 'compoments'
import SubmitOrRecall from 'compoments/buttonModalWithForm/SubmitOrRecall.r'
import {request,fMoney,listMainResultStatus,toPercent} from 'utils'
const columns = context =>[
    {
        title:'纳税主体名称',
        dataIndex: "taxSubjectName",
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">项目分期名称</p>
                <p className="apply-form-list-p2">项目分期代码</p>
            </div>
        ),
        dataIndex: "stageName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.stageNum}</p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">固定资产名称</p>
                <p className="apply-form-list-p2">固定资产编号</p>
            </div>
        ),
        dataIndex: "assetName",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.assetNo}</p>
            </div>
        )
    },
    {
        title: "入账日期",
        dataIndex: "accountDate"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">取得方式</p>
                <p className="apply-form-list-p2">取得价值</p>
            </div>
        ),
        dataIndex: "acquisitionMode",
        render: (text, record) => {
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
            return (
                <div>
                    <p className="apply-form-list-p1">{res}</p>
                    <p className="apply-form-list-p2">
                        {fMoney(record.gainValue)}
                    </p>
                </div>
            );
        }
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">资产类别</p>
                <p className="apply-form-list-p2">资产状态</p>
            </div>
        ),
        dataIndex: "assetType",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{text}</p>
                <p className="apply-form-list-p2">{record.assetsState}</p>
            </div>
        )
    },
    {
        title: "占地面积",
        dataIndex: "areaCovered"
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">购进税额</p>
                <p className="apply-form-list-p2">购进税率</p>
            </div>
        ),
        dataIndex: "inTax",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">
                    {toPercent(record.intaxRate)}
                </p>
            </div>
        )
    },
    {
        title: (
            <div className="apply-form-list-th">
                <p className="apply-form-list-p1">当期抵扣的进项税额</p>
                <p className="apply-form-list-p2">待抵扣的进项税额</p>
            </div>
        ),
        dataIndex: "taxAmount",
        render: (text, record) => (
            <div>
                <p className="apply-form-list-p1">{fMoney(text)}</p>
                <p className="apply-form-list-p2">
                    {fMoney(record.deductedTaxAmount)}
                </p>
            </div>
        )
    },{
        title: "待抵扣期间",
        dataIndex: "deductedPeriod"
    }
];
class FixedAssetsInputTaxDetails extends Component{
    state={
        tableKey:Date.now(),
        searchFieldsValues:{},
        dataSource:[],
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    fetchResultStatus = ()=>{
        request.get('/account/income/estate/listMain',{
            params:this.state.searchFieldsValues
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        statusParam: data.data,
                    })
                }else{
                    message.error(`列表主信息查询失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {tableKey,searchFieldsValues,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = searchFieldsValues;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = statusParam && parseInt(statusParam.status, 0) === 2;
        return(
            <SearchTable
                style={{
                    marginTop:-16
                }}
                doNotFetchDidMount={true}
                searchOption={{
                    fields:this.props.searchFields,
                    cardProps:{
                        style:{
                            borderTop:0
                        }
                    }
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:20,
                    columns:columns(this),
                    url:'/account/income/estate/fixedList',
                    onSuccess:(params)=>{
                        this.setState({
                            searchFieldsValues:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps: {
                        title: "固定资产进项税额明细",
                        extra:<div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }
                            <SubmitOrRecall disabled={disabled2} type={1} url="/account/income/estate/submit" onSuccess={this.refreshTable} />
                            <SubmitOrRecall disabled={!disabled1} type={2} url="/account/income/estate/revoke" onSuccess={this.refreshTable} />

                        </div>,
                    },
                    /*scroll:{
                     x:'180%'
                     },*/
                    onDataChange:(dataSource)=>{
                        this.setState({
                            dataSource
                        })
                    },
                }}
            />
        )
    }
}
export default withRouter(FixedAssetsInputTaxDetails)