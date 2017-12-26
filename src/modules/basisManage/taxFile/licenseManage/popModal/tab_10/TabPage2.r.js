/**
 * Created by liurunbin on 2017/12/23.
 */
/** 大产证明细*/
import React, { Component } from 'react'
import {Layout,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable} from '../../../../../../compoments'
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '栋号 ',
    dataIndex: 'building',
}, {
    title: '单元号',
    dataIndex: 'unitNumber',
},{
    title: '户号',
    dataIndex: 'accountNumber',
},{
    title: '建筑面积(m²)',
    dataIndex: 'bulidArea',
},{
    title: '分摊面积(m²)',
    dataIndex: 'shareArea'
},{
    title: '设计用途',
    dataIndex: 'landUse',
},{
    title: '坐落',
    dataIndex: 'position',
}];

class TabPage extends Component {
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
        visible:false,
        expand:true,

        modalConfig:{
            type:''
        }
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    handleSubmit = e => {
        e.preventDefault();
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
        this.setState({
            selectedRowKeys
        })
    }
    showModal=()=>{
        this.toggleModalVisible(true)
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps.titleCertificateId)
        if(this.props.titleCertificateId !== nextProps.titleCertificateId){
            setTimeout(()=>{
                this.setState({
                    tableUpDateKey:Date.now()
                })
            },100)
        }

    }
    render() {
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,expand} = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
            <Layout style={{background:'transparent',marginTop:15}} >
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            <Col span={24} style={{textAlign:'right',marginBottom:15}}>
                                    <Button onClick={()=>this.showModal('add')} style={buttonStyle}>
                                        <Icon type="file-add" />
                                        新增
                                    </Button>
                                    <Button onClick={()=>this.showModal('edit')} disabled={!selectedRowKeys} style={buttonStyle}>
                                        <Icon type="edit" />
                                        编辑
                                    </Button>
                                    <Button onClick={()=>this.showModal('view')} disabled={!selectedRowKeys} style={buttonStyle}>
                                        <Icon type="search" />
                                        查看
                                    </Button>
                                    <Button
                                        onClick={()=>{
                                            confirm({
                                                title: '友情提醒',
                                                content: '该删除后将不可恢复，是否删除？',
                                                okText: '确定',
                                                okType: 'danger',
                                                cancelText: '取消',
                                                onOk() {
                                                    console.log('OK');
                                                },
                                                onCancel() {
                                                    console.log('Cancel');
                                                },
                                            });
                                        }}
                                        disabled={!selectedRowKeys}
                                        type='danger'>
                                        <Icon type="delete" />
                                        删除
                                    </Button>
                            </Col>
                        </Row>
                    </Form>

                    <AsyncTable url={`/card/house/ownership/detail/list/${this.props.titleCertificateId}`}
                                updateKey={tableUpDateKey}
                                filters={filters}
                                tableProps={{
                                    rowKey:record=>record.id,
                                    pagination:true,
                                    size:'middle',
                                    columns:columns,
                                    rowSelection:rowSelection
                                }} />
                <PopModal visible={visible} modalConfig={modalConfig} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(TabPage)