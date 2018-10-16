/**
 * Created by liuliyuan on 2018/10/11.
 */
import React, { Component } from 'react'
import {message,Modal,Icon,Drawer} from 'antd'
import {withRouter} from 'react-router-dom';
import {SearchTable,AsyncComponent} from 'compoments'
import {request,composeBotton,requestResultStatus,parseJsonToParams} from 'utils'
import PopModal from './popModal'
import moment from "moment";
const PartnersTaxReturnForm = AsyncComponent(() => import('./taxReturnForm'), '合作方的纳税申报-纳税申报表')
const pointerStyle = {
    cursor:'pointer',
    color:'#1890ff',
    margin:'0px 5px'
}
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
    let operates = (hasOperate && parseInt(context.state.statusParam.status, 0) === 1)?[{
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
    }]:[];
    return [
        ...operates
        ,
        {
            title: '纳税申报操作',
            key: 'vTaxActions',
            width: '160px',
            render: (text, record) => {
                return (
                    <div>
                        {
                            (hasOperate && parseInt(context.state.statusParam.status, 0) === 1) ? composeBotton([{
                                type: 'action',
                                icon: 'edit',
                                title: '编辑',
                                onSuccess: () => {
                                    context.togglesDrawerVisible(true,record.id)
                                }
                            }, {
                                type: 'action',
                                icon: 'delete',
                                title: '删除',
                                style: {
                                    cursor: 'pointer',
                                    color: 'red',
                                    marginRight: 10
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
                                            const params = {
                                                mainId:record.mainId,
                                                taxMonth:context.props.declare.authMonth,
                                                partnerId:record.id
                                            }
                                            context.deleteRecord(`/taxDeclarationReport/partner/delete?${parseJsonToParams(params)}`,() => {
                                                modalRef && modalRef.destroy();
                                                context.refreshTable();
                                            });
                                        },
                                        onCancel() {
                                            modalRef.destroy();
                                        }
                                    })
                                }
                            }]) :
                                <span
                                    title="查看纳税申报详情"
                                    style={{
                                        ...pointerStyle,
                                        marginLeft: 5
                                    }}
                                    onClick={() => context.togglesDrawerVisible(true) }
                                >
                                    <Icon type="search" theme="outlined" style={{fontSize: 16}}/>
                                </span>
                        }
                    </div>
                );
            },
    },
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
class PartnersTaxReturn extends Component{
    state={
        updateKey:Date.now(),
        visible: false,
        drawerVisible: false,
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
    togglesDrawerVisible = (drawerVisible,partnerId) => {
        this.mounted && this.setState({
            drawerVisible,
            partnerId
        });
    };
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
    componentDidMount(){

    }
    render(){
        const {updateKey,statusParam = {},visible,drawerVisible,modalConfig,partnerId,filters} = this.state;
        const { declare,type } = this.props;
        let disabled = !!declare;

        return(
            <div className="oneLine">
                <SearchTable
                    doNotFetchDidMount={!disabled}
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
                        columns:getColumns(this,disabled && declare.decAction==='edit'),
                        cardProps:{
                            title:'合作方纳税申报信息表',
                            extra:<div>
                                {
                                    composeBotton([{ //(disabled && declare.decAction==='edit') &&
                                        type:'add',
                                        icon:'plus',
                                        //userPermissions:['1381003'],
                                        onClick:()=>this.showModal('add',{})
                                    }],statusParam)
                                }
                                {
                                    (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'submit',
                                            url:'/taxDeclarationReport/partner/submit',
                                            params:filters,
                                            userPermissions:['1911010'],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            url:'/taxDeclarationReport/partner/revoke',
                                            params:filters,
                                            userPermissions:['1911011'],
                                            onSuccess:this.refreshTable,
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
                <Drawer
                    //title="Basic Drawer"
                    placement="top"
                    //closable={true}
                    visible={drawerVisible}
                    width={'100%'}
                    //height={'100vh'}
                    //getContainer={document.getElementsByClassName("ant-layout-content")[0]}
                    onClose={()=>this.togglesDrawerVisible(false)}
                    maskClosable={false}
                    destroyOnClose={true}
                    style={{
                        height: 'calc(100% - 55px)',
                        minHeight: '100vh',

                    }}
                >
                    { drawerVisible ? <PartnersTaxReturnForm declare={declare} togglesDrawerVisible={this.togglesDrawerVisible} type={type} partnerId={partnerId} /> : ''}
                </Drawer>
            </div>
        )
    }
}

export default withRouter(PartnersTaxReturn)