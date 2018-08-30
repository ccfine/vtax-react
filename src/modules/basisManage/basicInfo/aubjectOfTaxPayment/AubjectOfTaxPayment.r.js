/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Form } from 'antd'
import {SearchTable} from 'compoments'
import ProjectInformationManagement from './projectInformationManagement'
import {composeBotton} from 'utils'
import AddEditModal from './add'

const searchFields = ()=> {
    return [
        {
            label:'纳税主体',
            fieldName:'id',
            type:'taxMain',
            span:8,
            fieldDecoratorOptions:{
            },
        },
    ]
}
const getColumns = context=>[
    {
      title: "操作",
      render(text, record, index) {
        return composeBotton([{
            type:'action',
            title:'项目信息管理',
            icon:'file-add',
            userPermissions:['1055000'], //计税方法维护
            onSuccess:()=>{
                context.props.history.push(`/web/basisManage/basicInfo/aubjectOfTaxPayment/${record.id}`)
            }
            //onSuccess:()=>context.showModal('project',record)
        },{
            type:'action',
            title:'编辑',
            icon:'edit',
            userPermissions:['1051004'],
            onSuccess:()=>context.showModal('edit',record)
        }]);
      },
      fixed: "left",
      width: 75,
      className:'text-center',
      dataIndex: "action"
    },{
    title: '编码',
    dataIndex: 'code',
}, {
    title: '纳税主体',
    dataIndex: 'name',
    render:(text,record)=>{
        return parseInt(record.status,10) < 3 ? <a title="查看详情" onClick={()=>context.showModal('view',record)}>{text}</a>:undefined;
    }
},{
    title: '社会信用代码',
    dataIndex: 'taxNum',
},{
    title: '开业日期',
    dataIndex: 'openingDate',
},{
    title: '税务经办人',
    dataIndex: 'operater',
},{
    title: '经办人电话',
    dataIndex: 'operaterPhone',
},{
    title: '营业状态',
    dataIndex: 'operatingStatus',
    render:text=>{
        if(text==='01'){
            return <span style={{color: "#87d068"}}>营业</span>;
        }
        if(text==='02'){
            return <span style={{color: '#f5222d'}}>停业</span>
        }
        return ''
    }
/*},{
    title: '更新人',
    dataIndex: 'lastModifiedBy',
},{
    title: '更新时间',
    dataIndex: 'lastModifiedDate',*/
}/*,{
    title: '当前状态',
    dataIndex: 'status',
    render:text=>{
        //0:删除;1:保存;2:提交; ,
        let t = '';
        switch (parseInt(text,0)){
            case 0:
                t=<span style={{color: '#f5222d'}}>删除</span>;
                break;
            case 1:
                t=<span style={{color: "#2db7f5"}}>保存</span>;
                break;
            case 2:
                t=<span style={{color: "#108ee9"}}>提交</span>;
                break;
            default:
            //no default
        }
        return t
    },
}*/];
class AubjectOfTaxPayment extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        selectedRowKeys:null,
        selectedRows:[],
        visible:false,
        modalConfig:{
            type:''
        },
        projectVisible:false,
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    selectedRowKeys:null,
                    selectedRows:[],
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });
    }

    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    toggleProjectVisible=visible=>{
        this.setState({
            projectVisible:visible
        })
    }
    showModal=(type,record={})=>{
        type === 'project' ? this.toggleProjectVisible(true) : this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id: record.id
            },
            selectedRowKeys:record.id ? [record.id] : [],
            selectedRows:record.id ? [record] : [],
        })
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig,projectVisible} = this.state;
        return (
            <SearchTable
                searchOption={{
                    fields:searchFields,
                }}
                doNotFetchDidMount={true}
                tableOption={{
                    key: tableUpDateKey,
                    pageSize:100,
                    columns:getColumns(this),
                    onSuccess:()=>{
                        this.setState({
                            selectedRowKeys:null,
                            selectedRows:[],
                        })
                    },
                    url:'/taxsubject/list',
                    cardProps:{
                        title:'纳税主体',
                    },
                    extra:<div>
                        {
                          window.isShow && composeBotton([{
                                type:'add',
                                icon:'plus',
                                onClick:()=>this.showModal('add')
                            }])
                        }
                        {/* <Button size="small"
                                disabled={!disabled}
                                style={buttonStyle}
                                onClick={()=>{
                                    const ref = Modal.warning({
                                        content: '研发中...',
                                        okText: '关闭',
                                        onOk:()=>{
                                            ref.destroy();
                                        }
                                    });
                                }}
                        >
                            <Icon type="search" />
                            查看历史版本
                        </Button> */}
                        <ProjectInformationManagement visible={projectVisible} taxSubjectId={selectedRowKeys} toggleModal={this.toggleProjectVisible} />
                    </div>,
                }}
            >

                <AddEditModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    toggleModalVisible={this.toggleModalVisible}
                    updateTable={this.updateTable}
                    // setSelectedRowKeysAndselectedRowssetSelectedRowKeysAndselectedRows={this.setSelectedRowKeysAndselectedRows}
                />
            </SearchTable>
        )
    }
}
export default Form.create()(AubjectOfTaxPayment)