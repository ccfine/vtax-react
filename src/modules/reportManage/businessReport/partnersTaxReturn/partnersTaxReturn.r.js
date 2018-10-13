/**
 * Created by liuliyuan on 2018/10/11.
 */
import React, { Component } from 'react'
import {message,Modal,Icon} from 'antd'
import {SearchTable} from 'compoments'
import {request,composeBotton,requestResultStatus} from 'utils'
import { Link } from "react-router-dom";
import PopModal from './popModal'
import moment from "moment";

const searchFields = (disabled,declare) => {
    return [
        {
            label: "纳税主体",
            type: "taxMain",
            span: 8,
            fieldName: "main",
            componentProps: {
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions: {
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择纳税主体"
                    }
                ]
            }
        },
        {
            label: "查询期间",
            fieldName: "authMonth",
            type: "monthPicker",
            span: 8,
            componentProps: {
                format: "YYYY-MM",
                disabled
            },
            fieldDecoratorOptions: {
                initialValue:
                (declare && moment(declare["authMonth"], "YYYY-MM")) ||
                undefined,
                rules: [
                    {
                        required: true,
                        message: "请选择查询期间"
                    }
                ]
            }
        }
    ];
};
const getColumns = (context,hasOperate) => {
    let operates = [{
        title:'合作方公操作',
        key:'actions',
        width:'160px',
        render:(text,record)=>{
            return (
                <div>
                    {
                        composeBotton([{
                            type: 'action',
                            icon: 'edit',
                            title: '编辑',
                            onSuccess: () => {
                                console.log(record)
                                context.showModal('edit',record)
                            }
                        }, {
                            type: 'action',
                            icon: 'delete',
                            title: '删除',
                            style:{
                                cursor:'pointer',
                                color:'red',
                                marginRight:10
                            },
                            userPermissions: ['1361008'],
                            onSuccess: () => {
                                const modalRef = Modal.confirm({
                                    title: "友情提醒",
                                    content: "该删除后将不可恢复，是否删除？",
                                    okText: "确定",
                                    okType: "danger",
                                    cancelText: "取消",
                                    onOk: () => {
                                        context.deleteRecord(`/parnter/taxPartner/delete/${record.id}`, () => {
                                            modalRef && modalRef.destroy();
                                            context.refreshTable();
                                        });
                                    },
                                    onCancel() {
                                        modalRef.destroy();
                                    }
                                })
                            }
                        }])
                    }
                </div>
            );
        },
    },{
        title:'纳税申报操作',
        key:'vTaxActions',
        width:'160px',
        render:(text,record)=>{
            return (
                <div>
                    <Link
                        style={{margin:'0 5px'}}
                        title="纳税申报"
                        to={{
                            pathname: `/web/reportManage/businessReport/partnersTaxReturnForm`,
                            //search:parseJsonToParams(context.state.searchValues),
                            /*state:{
                             roleName:record.roleName,
                             isEnabled:record.isEnabled,
                             remark:record.remark,
                             params:{ ...context.state.searchValues, }
                             }*/
                        }}
                    >
                        <Icon type="search" theme="outlined" style={{ fontSize: 16 }}/>
                    </Link>
                    {
                        composeBotton([{
                            type: 'action',
                            icon: 'edit',
                            title: '编辑',
                            onSuccess: () => {
                                context.props.history.push(`/web/reportManage/businessReport/partnersTaxReturnForm`)
                            }
                        }, {
                            type: 'action',
                            icon: 'delete',
                            title: '删除',
                            style:{
                                cursor:'pointer',
                                color:'red',
                                marginRight:10
                            },
                            userPermissions: ['1361008'],
                            onSuccess: () => {
                                const modalRef = Modal.confirm({
                                    title: "友情提醒",
                                    content: "该删除后将不可恢复，是否删除？",
                                    okText: "确定",
                                    okType: "danger",
                                    cancelText: "取消",
                                    onOk: () => {
                                        context.deleteRecord(`/parnter/taxPartner/delete/${record.id}`, () => {
                                            modalRef && modalRef.destroy();
                                            context.refreshTable();
                                        });
                                    },
                                    onCancel() {
                                        modalRef.destroy();
                                    }
                                })
                            }
                        }])
                    }
                </div>
            );
        },
    }];
    return [
        ...operates
        ,
    {
        title: '合作方公司名称',
        dataIndex: 'name',
        render: (text, record) => {
            return <a title='查看详情' onClick={() => {
                context.setState({
                    modalConfig: {
                        type: "look",
                        id: record.id,
                        record
                    }
                },() => {
                    context.toggleModalVisible(true);
                });
            }}>
                {text}
            </a>
        }
        //width:'200px',
    },
    {
        title: '是否处理',
        dataIndex: 'finish',
        width:'150px',
        render: text => {
            //1:处理，0:未处理',
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color:'#b7eb8f'}}>处理</span>;
                    break;
                case 0:
                    t=<span style={{color: "#f50"}}>未处理</span>;
                    break;
                default:
                //no default
            }
            return t
        },
    }
    ];
}
export default class PartnersTaxReturn extends Component{
    state={
        updateKey:Date.now(),
        visible: false,
        modalConfig: {
            type: ''
        },
        filters:{},
        statusParam: {},

    }
    toggleModalVisible=visible=>{
        this.mounted && this.setState({
            visible
        })
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        })
    }
    showModal=(type,record)=>{
        this.toggleModalVisible(true)
        this.mounted && this.setState({
            modalConfig:{
                type,
                id:record.id,
                record
            }
        })
    }
    deleteRecord = (url, cb) => {
        request
            .delete(url)
            .then(({ data }) => {
                if (data.code === 200) {
                    message.success("删除成功", 4);
                    cb && cb();
                } else {
                    message.error(data.msg, 4);
                }
            })
            .catch(err => {
                message.error(err.message);
            });
    };
    updateStatus = (values) => {
        requestResultStatus('/account/output/othertax/listMain',values,result=>{
            this.setState({
                statusParam: result,
            })
        })
    };
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {updateKey,statusParam = {},visible,modalConfig} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        console.log(disabled)
        let noSubmit = parseInt(statusParam.status,10)===1;
        return(
            <div className="oneLine">
                <SearchTable
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(disabled,declare),
                        cardProps:{
                            style:{borderTop:0}
                        }
                    }}
                    backCondition={(filters)=>{
                        this.setState({
                            filters,
                        },()=>{
                            this.updateStatus(filters)
                        })
                    }}
                    tableOption={{
                        key:updateKey,
                        pageSize:100,
                        columns:getColumns(this,disabled && declare.decAction==='edit' && noSubmit),
                        cardProps:{
                            title:'合作方的纳税申报信息表',
                            extra:<div>
                                {
                                    composeBotton([{ //(disabled && declare.decAction==='edit') &&
                                        type:'add',
                                        icon:'plus',
                                        //userPermissions:['1381003'],
                                        onClick:()=>this.showModal('add',{})
                                    }],statusParam)
                                }
                            </div>,
                        },
                        url:'/parnter/taxPartner/list',
                        scroll:{ x: '100%',y:window.screen.availHeight-360, },
                    }}
                />
                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    id={modalConfig.id}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                    declare={declare}
                />
            </div>
        )
    }
}