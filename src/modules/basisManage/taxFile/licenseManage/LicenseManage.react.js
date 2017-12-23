/** 证照管理*/
import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Icon} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../compoments'
import PopModal from './popModal'
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '纳税主体',
    dataIndex: 'mainName',
}, {
    title: '项目编码',
    dataIndex: 'taxType',
},{
    title: '项目名称',
    dataIndex: 'type',
},{
    title: '土地出让合同编号',
    dataIndex: 'documentNum1',
},{
    title: '合同建筑面积(m²)',
    dataIndex: 'documentNum2',
},{
    title: '调整后建筑面积(m²)',
    dataIndex: 'documentNum3',
},{
    title: '可抵扣地价款',
    dataIndex: 'documentNum4',
},{
    title: '实际已扣除土地价款',
    dataIndex: 'documentNum5',
},{
    title: '已售建筑面积(m²)',
    dataIndex: 'documentNum6',
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
        visible:true,
        expand:true
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
                <Card title="查询条件"
                      bodyStyle={{
                          padding:expand?'12px 16px':'0 16px'
                      }}
                      extra={
                          <Icon
                              style={{fontSize:24,color:'#ccc',cursor:'pointer'}}
                              onClick={()=>{this.setState(prevState=>({expand:!prevState.expand}))}}
                              type={`${expand?'up':'down'}-circle-o`} />
                      }>
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.TaxMain fieldName="mainId" formItemStyle={formItemStyle} form={this.props.form} />
                            </Col>
                            <Col span={8}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="查询结果"
                      extra={<div>
                          <Button onClick={()=>this.showModal()} disabled={!selectedRowKeys} style={buttonStyle}>
                              <Icon type="search" />
                              查看
                          </Button>
                      </div>}
                      style={{marginTop:10}}>

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
                </Card>
                <PopModal visible={visible} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(LicenseManage)