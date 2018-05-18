/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Form,Button,Icon,Modal} from 'antd'
import {SearchTable} from 'compoments'
import ProjectInformationManagement from './projectInformationManagement'
import AddEditModal from './add'

const buttonStyle={
    marginRight:5
}
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
const columns = [{
    title: '编码',
    dataIndex: 'code',
}, {
    title: '纳税主体',
    dataIndex: 'name',
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
},{
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
}];
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
    showModal=type=>{
        this.toggleModalVisible(true)
        this.setState({
            modalConfig:{
                type,
                id:this.state.selectedRowKeys
            }
        })
        /*if(type === 'add') {
         this.setSelectedRowKeysAndselectedRows(null, {});
         }*/

    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    render() {
        const {tableUpDateKey,selectedRowKeys,selectedRows,visible,modalConfig} = this.state;
        const disabled = selectedRows && selectedRows.length > 0;
        return (
            <SearchTable
                searchOption={{
                    fields:searchFields,
                }}
                doNotFetchDidMount={true}
                tableOption={{
                    key: tableUpDateKey,
                    pageSize:10,
                    columns:columns,
                    rowSelection:{
                        type: 'radio',
                    } ,
                    onRowSelect:(selectedRowKeys,selectedRows)=>{
                        this.setState({
                            selectedRowKeys,
                            selectedRows,
                        })
                    },
                    onSuccess:()=>{
                        this.setState({
                            selectedRowKeys:null,
                            selectedRows:[],
                        })
                    },
                    url:'/taxsubject/list',
                    extra:<div>
                        <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                            <Icon type="plus" />
                            新增
                        </Button>
                        <Button size="small" onClick={()=>this.showModal('edit')} disabled={!(disabled && parseInt(selectedRows[0].status,0) !== 2)} style={buttonStyle}>
                            <Icon type="edit" />
                            编辑
                        </Button>
                        <Button size="small" onClick={()=>this.showModal('view')} disabled={!(disabled && parseInt(selectedRows[0].status,0) < 3)} style={buttonStyle}>
                            <Icon type="search" />
                            查看
                        </Button>
                        <Button size="small"
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
                        </Button>
                        <ProjectInformationManagement disabled={!disabled} taxSubjectId={selectedRowKeys} />
                    </div>,
                }}
            >

                <AddEditModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    toggleModalVisible={this.toggleModalVisible}
                    updateTable={this.updateTable.bind(this)}
                    setSelectedRowKeysAndselectedRows={this.setSelectedRowKeysAndselectedRows}
                />
            </SearchTable>
        )
    }
}
export default Form.create()(AubjectOfTaxPayment)