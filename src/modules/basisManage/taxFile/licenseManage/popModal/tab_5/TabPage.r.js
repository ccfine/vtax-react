/**
 * Created by liurunbin on 2017/12/23.
 */
/** 国有土地使用证*/
import React, { Component } from 'react'
import {Layout,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../../../compoments'
import PopModal from './popModal'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '土地证编号 ',
    dataIndex: 'licenseKey',
}, {
    title: '用地单位',
    dataIndex: 'organization',
},{
    title: '地块位置',
    dataIndex: 'position',
},{
    title: '土地用途',
    dataIndex: 'landUse',
},{
    title: '取得方式',
    dataIndex: 'acquireWay',
},{
    title: '土地年限',
    dataIndex: 'ageLimit',
},{
    title: '使用权面积(m²)',
    dataIndex: 'rightArea',
},{
    title: '其中:分摊面积(m²)',
    dataIndex: 'shareArea',
},{
    title: '其中:独有面积(m²)',
    dataIndex: 'ownArea',
},{
    title: '备注',
    dataIndex: 'remark',
}];

class LicenseManage extends Component {
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
    render() {
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,expand} = this.state;
        const formItemStyle={
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        }
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
            <Layout style={{background:'transparent'}} >
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="mainId" formItemStyle={formItemStyle} form={this.props.form} />
                            </Col>
                            <Col span={8}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                            </Col>
                            <Col span={8} style={{textAlign:'right'}}>
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

                    <AsyncTable url="/tax/preferences/list"
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
export default Form.create()(LicenseManage)