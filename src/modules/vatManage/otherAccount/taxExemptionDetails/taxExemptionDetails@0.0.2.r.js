/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-06-06 11:01:21
 *
 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Modal,message} from 'antd'
import {fMoney,request,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import {SearchTable,TableTotal} from 'compoments'
import PopModal from "./popModal";
import moment from 'moment';
const pointerStyle = {
    cursor: "pointer",
    color: "#1890ff"
};
const pointerStyleDelete = {
    cursor:'pointer',
    color:'red',
}
const searchFields =(disabled,declare)=> [
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:8,
        componentProps:{
            disabled
        },
        fieldDecoratorOptions:{
            initialValue: (disabled && declare.mainId) || undefined,
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
    },{
        label:'凭证号',
        fieldName:'voucherNum',
        type:'input',
        span:8,
        componentProps:{

        }
    },
]
const getColumns = (context,disabled,declare) => {
    let operates = (disabled && declare.decAction==='edit' && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1) ?[{
        title: '操作',
        render:(text, record, index) =>composeBotton([{
            type: 'action',
            icon: 'edit',
            title: '编辑',
            userPermissions:['1301004'],
            onSuccess: () => {
                context.setState({visible: true, action: 'modify', opid: record.id});
            }
        },{
            type:'action',
            icon:'delete',
            title:'删除',
            style:pointerStyleDelete,
            userPermissions:['1301008'],
            onSuccess:()=>{
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
            }
        }]),
        fixed: 'left',
        width: '75px',
        dataIndex: 'action',
        className: "text-center",
    }]:[];
    return [
        ...operates
        , {
            title: '纳税主体',
            dataIndex: 'mainName',
            render: (text, record) => (
                <span
                    title="查看详情"
                    style={{
                        ...pointerStyle,
                        marginLeft: 5
                    }}
                    onClick={() => {
                        context.setState({
                            visible: true,
                            action: 'look',
                            opid: record.id
                        });
                    }}
                >
                {text}
            </span>
            ),
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
}
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
        requestResultStatus('/account/other/reduceTaxDetail/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {visible,action,opid,tableKey,searchTableLoading,statusParam,totalSource,filters} = this.state;
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
                            borderTop:0
                        }
                    },
                }}
                tableOption={{
                    key:tableKey,
                    pageSize:10,
                    columns:getColumns(this,disabled,declare),
                    url:'/account/other/reduceTaxDetail/list',
                    onSuccess:(params)=>{
                        this.setState({
                            filters:params,
                        },()=>{
                            this.fetchResultStatus()
                        })
                    },
                    cardProps:{
                        title:'减免税明细台账'
                    },
                    extra: <div>
                        {
                            listMainResultStatus(statusParam)
                        }
                        {
                            (disabled && declare.decAction==='edit') &&  composeBotton([{
                                type:'add',
                                icon:'plus',
                                userPermissions:['1301003'],
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
                                userPermissions:['1301010'],
                                onSuccess:this.refreshTable
                            },{
                                type:'revoke',
                                url:'/account/other/reduceTaxDetail/revoke',
                                params:filters,
                                userPermissions:['1301011'],
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
export default connect(state=>({
    declare:state.user.get('declare')
}))(TaxExemptionDetails)