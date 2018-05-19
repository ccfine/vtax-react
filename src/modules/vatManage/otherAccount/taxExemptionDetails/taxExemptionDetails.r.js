/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-07 14:19:47
 *
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {Icon,Modal,message} from 'antd'
import {fMoney,request,getUrlParam,listMainResultStatus,composeBotton} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import PopModal from "./popModal";
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
        }
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
    },{
        label:'凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:6,
        componentProps:{

        }
    },
]
const getColumns = (context,disabled1) => [
    {
        title: '操作',
        render(text, record, index) {
            return (<span>
                {
                    disabled1 && <span>
                        <a style={{margin:"0 5px" }} onClick={() => {
                            context.setState({ visible: true, action: 'modify', opid: record.id });
                        }}><Icon type="edit" /></a>
                        <a style={{ margin:"0 5px",color: "#f5222d" }}  onClick={() => {
                            const modalRef = Modal.confirm({
                                title: "友情提醒",
                                content: "该删除后将不可恢复，是否删除？",
                                okText: "确定",
                                okType: "danger",
                                cancelText: "取消",
                                onOk: () => {
                                    context.deleteRecord(record.id, () => {
                                        modalRef && modalRef.destroy();
                                        context.refreshTable();
                                    });
                                },
                                onCancel() {
                                    modalRef.destroy();
                                }
                            });
                        }}
                        >
                            <Icon type="delete" />
                        </a>
                    </span>
                }

                <a onClick={() => {
                    context.setState({ visible: true, action: 'look', opid: record.id });
                }}><Icon type="search" /></a>
            </span>)
        },
        fixed: 'left',
        width: '75px',
        dataIndex: 'action',
        className: "text-center",
    }, {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '减税性质代码',
        dataIndex: 'reduceNum',
    },{
        title: '减税性质名称',
        dataIndex: 'reduceName',
    },{
        title: '凭证号',
        dataIndex: 'voucherNum',
    },{
        title: '日期 ',
        dataIndex: 'monthDate',
    },{
        title: '金额',
        dataIndex: 'amount',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
    },{
        title: '减免税金额',
        dataIndex: 'reduceTaxAmount',
        render:text=>fMoney(text),
    },{
        title: '进项税额是否认证抵扣',
        dataIndex: 'incomeTaxAuth',
        render:text=>{
            //0 否，1 是 ,
            text = parseInt(text,0);
            if(text===0){
                return '否'
            }
            if(text ===1){
                return '是'
            }
            return text;
        }
    }
];
// 总计数据结构，用于传递至TableTotal中
const totalData =  [
    {
        title:'合计',
        total:[
            {title: '金额', dataIndex: 'pageAmount'},
            {title: '税额', dataIndex: 'pageTaxAmount'},
            {title: '减免税金额', dataIndex: 'pageReduceTaxAmount'},
        ],
    }
];
class TaxExemptionDetails extends Component{
    state={
        visible:false,
        action:undefined,
        opid:undefined,
        tableKey:Date.now(),
        filters:{},
        statusParam:{},
        searchTableLoading:false,
        totalSource:undefined,
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    hideModal = ()=>{
        this.setState({ visible:false });
    }
    update = () => {
        this.refreshTable()
    }
    deleteRecord = (id, cb) => {
        this.toggleSearchTableLoading(true)
        request.delete(`/account/other/reduceTaxDetail/delete/${id}`)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success('删除成功！');
                    cb && cb();
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            }).catch(err=>{
            message.error(err.message)
            this.toggleSearchTableLoading(false)
        })
    };

    fetchResultStatus=()=>{
        request.get('/account/other/reduceTaxDetail/listMain',{params:this.state.filters}).then(({data}) => {
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
    render(){
        const {visible,action,opid,tableKey,searchTableLoading,statusParam,totalSource,filters} = this.state;
        const disabled1 = statusParam && parseInt(statusParam.status, 0) === 2;
        const {search} = this.props.location;
        let disabled= !!search;
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
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this,!disabled1),
                    url:'/account/other/reduceTaxDetail/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            JSON.stringify(filters) !== "{}" &&  composeBotton([{
                                type:'add',
                                onClick: ()=>{
                                    this.setState({
                                        visible: true,
                                        action: "add",
                                        opid: undefined
                                    });
                                }
                            },{
                                type:'submit',
                                url:'/account/other/reduceTaxDetail/submit',
                                params:filters,
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/other/reduceTaxDetail/revoke',
                                params:filters,
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
            >
                <PopModal
                    visible={visible}
                    action={action}
                    hideModal={() => { this.hideModal() }}
                    id={opid}
                    update={this.update}
                />
            </SearchTable>
        )
    }
}

export default withRouter(TaxExemptionDetails)