/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 17:47
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable} from '../../../../compoments'
import {getFields} from '../../../../utils'
import ProjectInformationManagement from './projectInformationManagement'
import AddEditModal from './add'

const buttonStyle={
    marginRight:5
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
            return <span style={{color: "red"}}>停业</span>
        }
        return ''
    }
},{
    title: '更新人',
    dataIndex: 'lastModifiedBy',
},{
    title: '更新时间',
    dataIndex: 'lastModifiedDate',
},{
    title: '当前状态',
    dataIndex: 'status',
    render:text=>{
        //0:删除;1:保存;2:提交; ,
        let t = '';
        switch (parseInt(text,0)){
            case 0:
                t=<span style={{color: "red"}}>删除</span>;
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
        selectedRows:null,
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
                    filters:values
                },()=>{
                    this.setState({
                        tableUpDateKey:Date.now()
                    })
                });
            }
        });

    }
    onChange=(selectedRowKeys, selectedRows) => {
        this.setSelectedRowKeysAndselectedRows(selectedRowKeys,selectedRows);
    }

    setSelectedRowKeysAndselectedRows=(selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
        })
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
        const {tableUpDateKey,filters, selectedRowKeys,selectedRows,visible,modalConfig} = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'id',
                                        type:'taxMain',
                                        span:8,
                                        fieldDecoratorOptions:{
                                        },
                                    },
                                ])
                            }

                            <Col span={16} style={{textAlign:'right'}}>
                                <Form.Item>
                                <Button style={{marginLeft:20}} size='small' type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginLeft:10}} size='small' onClick={()=>this.props.form.resetFields()}>重置</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card
                    extra={<div>
                        <Button size="small" onClick={()=>this.showModal('add')} style={buttonStyle}>
                            <Icon type="plus-circle" />
                            新增
                        </Button>
                        <Button size="small" onClick={()=>this.showModal('edit')} disabled={!(selectedRows && parseInt(selectedRows[0].status,0) !== 2)} style={buttonStyle}>
                            <Icon type="edit" />
                            编辑
                        </Button>
                        <Button size="small" onClick={()=>this.showModal('view')} disabled={!(selectedRows && parseInt(selectedRows[0].status,0) !== 1) && !(selectedRows && parseInt(selectedRows[0].status,0) !== 2)} style={buttonStyle}>
                            <Icon type="search" />
                            查看
                        </Button>
                        <Button size="small"
                                disabled={!selectedRowKeys}
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
                        <ProjectInformationManagement disabled={!selectedRowKeys} taxSubjectId={selectedRowKeys} />
                    </div>}
                    style={{marginTop:10}}>
                    <AsyncTable url="/taxsubject/list"
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>`${record.id}`,
                                    pagination:true,
                                    size:'small',
                                    columns:columns,
                                    rowSelection:rowSelection
                                }} />
                </Card>

                <AddEditModal
                    visible={visible}
                    modalConfig={modalConfig}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    toggleModalVisible={this.toggleModalVisible}
                    updateTable={this.updateTable.bind(this)}
                    setSelectedRowKeysAndselectedRows={this.setSelectedRowKeysAndselectedRows}
                />
            </Layout>
        )
    }
}
export default Form.create()(AubjectOfTaxPayment)