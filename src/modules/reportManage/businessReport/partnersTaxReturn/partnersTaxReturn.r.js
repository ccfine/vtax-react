/**
 * Created by liuliyuan on 2018/10/11.
 */
import React, { Component } from 'react'
import {Card,message,Modal} from 'antd'
import {AsyncTable} from 'compoments'
import {request,composeBotton} from 'utils'
import { Link } from "react-router-dom";
import PopModal from './popModal'

const getColumns = context =>[
    {
        title:'操作',
        key:'actions',
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
                        纳税申报
                    </Link>
                    {
                        composeBotton([{
                            type: 'action',
                            icon: 'edit',
                            title: '编辑',
                            onSuccess: () => {
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
                                        context.deleteRecord(record.id, () => {
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
    },
    {
        title: '合作方公司名称',
        dataIndex: 'taxNum',
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
        dataIndex: 'status',
        width:'150px',
        render: text => {
            //1:可用2:禁用3:删除
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t=<span style={{color:'#b7eb8f'}}>可用</span>;
                    break;
                case 2:
                    t=<span style={{color: '#f5222d'}}>禁用</span>;
                    break;
                case 3:
                    t=<span style={{color: "#f50"}}>删除</span>;
                    break;
                default:
                //no default
            }
            return t
        },
    }
];
export default class partnersTaxReturn extends Component{
    state={
        updateKey:Date.now(),
        visible: false,
        modalConfig: {
            type: ''
        },
        filters:{},

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
    deleteRecord = (id, cb) => {
        request
            .delete(`/account/notInvoiceUnSale/realty/delete/${id}`)
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
    componentDidMount(){
        this.refreshTable()
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {updateKey,filters,visible,modalConfig} = this.state;
        return(
            <Card title='合作方的纳税申报信息'
                  bordered={false}
                  extra={
                      <div>
                          {
                              composeBotton([{
                                  type:'add',
                                  icon:'plus',
                                  onClick:()=>this.showModal('add',{})
                              }])
                          }
                      </div>
                  }
                  style={{marginTop:10}}>
                    <AsyncTable url="/taxsubject/list"
                            updateKey={updateKey}
                            filters={filters}
                            tableProps={{
                                rowKey:record=>record.id,
                                pagination:true,
                                size:'small',
                                columns:getColumns(this),
                                onDataChange:(dataSource)=>{
                                    this.setState({
                                        dataSource
                                    })
                                },
                            }} />

                <PopModal
                    visible={visible}
                    modalConfig={modalConfig}
                    id={modalConfig.id}
                    refreshTable={this.refreshTable}
                    toggleModalVisible={this.toggleModalVisible}
                />
            </Card>
        )
    }
}
