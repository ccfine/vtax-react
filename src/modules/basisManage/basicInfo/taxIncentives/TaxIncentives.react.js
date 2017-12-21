import React, { Component } from 'react'
import {Layout,Card,Row,Col,Form,Button,Select,Table,Icon,Modal} from 'antd'
import {request} from '../../../../utils'
import EditModal from './editModal'
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const showDeleteConfirm = ()=>{
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
}
const columns = [{
    title: '纳税主体',
    dataIndex: 'code',
}, {
    title: '涉及税种',
    dataIndex: 'name',
},{
    title: '税收优惠分类',
    dataIndex: 'taxNum',
},{
    title: '文号',
    dataIndex: 'openingDate',
},{
    title: '有效期起',
    dataIndex: 'operater',
},{
    title: '有效期止',
    dataIndex: 'operaterPhone',
},{
    title: '是否有附件',
    dataIndex: 'operatingStatus',
    render:text=>parseInt(text,0) ===1?'营业':'停业'
},{
    title:'操作',
    key:'action',
    render:()=>(
        <div>
            <Button size='small' style={{marginRight:10}}>编辑</Button>
            <Button
                size="small"
                type="danger"
                onClick={showDeleteConfirm}
            >
                删除
            </Button>
        </div>
    )
}];
let timeout;
let currentValue;
function fetchTaxMain(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const fetch = ()=> {
        request.get(`/taxsubject/listByName`,{
            params:{
                name:value
            }
        })
            .then(({data}) => {
                if(data.code===200 && currentValue === value){

                    const result = data.data.records;
                    const newData = [];
                    result.forEach((r) => {
                        newData.push({
                            value: `${r.id}`,
                            text: r.name,
                        });
                    });
                    callback(newData);
                }
            });
    }

    timeout = setTimeout(fetch, 300);
}
class TaxIncentives extends Component {
    state={
        modalVisible:true,
        mainTaxItems:[
        ],
        selectedId:undefined,


        dataSource : [],
        pagination: {
            showTotal:total => `总共 ${total} 条`
        },
        tableLoading: false,
    }
    toggleModalVisible=visible=>{
        this.setState({
            modalVisible:visible
        })
    }
    fetch = (params = {}) => {
        this.setState({ tableLoading: true });
        console.log(this.state.selectedId)
        request.get('/tax/incentive/list',{
            params:{
                results: 10,
                id:this.state.selectedId,
                ...params,
            }
        }).then(({data}) => {
            if(data.code===200){
                const pagination = { ...this.state.pagination };
                pagination.total = data.data.total;
                this.setState({
                    tableLoading: false,
                    dataSource: data.data.records,
                    pagination,
                });
            }

        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            current: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    onSearch = (value) => {
        fetchTaxMain(value, data => this.setState({ mainTaxItems:data }));
    }
    onSelect = (value,option)=>{
        this.setState({
            selectedId:value.key
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
            const {mainTaxItems,dataSource,tableLoading,pagination,modalVisible} = this.state;
        const formItemStyle={
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        }
        return (
            <Layout style={{background:'transparent'}} >
                <Card title="查询条件">
                    <Row>
                        <Col span={8}>
                            <FormItem label='纳税主体' {...formItemStyle}>
                                {getFieldDecorator(`aa`,{
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        labelInValue
                                        onSelect={this.onSelect}
                                        onSearch={this.onSearch}
                                    >
                                        {
                                            mainTaxItems.map((item,i)=>(
                                                <Option key={i} value={item.value}>{item.text}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} offset={1}>
                            <Button style={{marginTop:3}} type='primary' onClick={()=>this.fetch()}>查询</Button>
                        </Col>
                    </Row>
                </Card>
                <Card title="查询结果"
                      extra={<div>
                          <Button>
                              <Icon type="plus-circle" />
                              新增
                          </Button>
                      </div>}
                      style={{marginTop:20}}>
                    <Table
                        loading={tableLoading}
                        rowKey={record=>record.id}
                        dataSource={dataSource}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        columns={columns} />
                </Card>
                <EditModal visible={modalVisible} toggleModalVisible={this.toggleModalVisible} />
            </Layout>
        )
    }
}
export default Form.create()(TaxIncentives)