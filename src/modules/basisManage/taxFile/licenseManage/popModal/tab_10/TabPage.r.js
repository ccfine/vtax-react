/**
 * Created by liurunbin on 2017/12/23.
 */
/** 房屋所有权证*/
import React, { Component } from 'react'
import {Layout,Row,Col,Form,Button,Icon,Modal} from 'antd'
import {AsyncTable,CusFormItem} from '../../../../../../compoments'
import PopModal from './popModal'
import PartTwo from './TabPage2.r'
const confirm = Modal.confirm;
const buttonStyle={
    marginRight:5
}
const columns = [{
    title: '权证名称 ',
    dataIndex: 'warrantName',
}, {
    title: '权证号',
    dataIndex: 'warrantNum',
},{
    title: '权利人',
    dataIndex: 'warrantUser',
},{
    title: '坐落',
    dataIndex: 'position',
},{
    title: '取得方式',
    dataIndex: 'acquireWay'
},{
    title: '用途',
    dataIndex: 'landUse',
},{
    title: '宗地面积(m²)',
    dataIndex: 'landArea',
},{
    title: '建筑面积(m²)',
    dataIndex: 'buildingArea',
},{
    title: '地号',
    dataIndex: 'num',
},{
    title: '使用期限',
    dataIndex: 'limitDate',
},{
    title: '登记时间',
    dataIndex: 'boardingTime',
},{
    title: '项目分期',
    dataIndex: 'stagesId',
},{
    title: '清算分期',
    dataIndex: 'liquidationStage',
},{
    title: '套数',
    dataIndex: 'rooms',
},{
    title: '发证日期',
    dataIndex: 'issuingDate',
},{
    title: '备注',
    dataIndex: 'remark',
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
        },
        titleCertificateId:undefined
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
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
        this.setState({
            selectedRowKeys,
            titleCertificateId:selectedRows[0].id
        })
    }
    showModal=()=>{
        this.toggleModalVisible(true)
    }
    updateTable=()=>{
        this.handleSubmit()
    }
    componentDidMount(){
        this.updateTable()
    }
    componentWillReceiveProps(nextProps){
        if(this.props.projectId !== nextProps.projectId){
            //项目id改变则重新更新
            this.updateTable()
        }
    }
    render() {
        const {tableUpDateKey,filters,selectedRowKeys,visible,modalConfig,expand,titleCertificateId} = this.state;
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
        const {projectId} = this.props;
        return (
            <Layout style={{background:'transparent'}} >
                    <Form onSubmit={this.handleSubmit} style={{display:expand?'block':'none'}}>
                        <Row>
                            <Col span={8}>
                                <CusFormItem.AsyncSelect
                                    formItemStyle={formItemStyle}
                                    label="项目分期"
                                    fieldName="stagesId"
                                    fieldTextName="itemName"
                                    fieldValueName="id"
                                    url={`/project/stages/${projectId}`}
                                    form={this.props.form} />
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

                    <AsyncTable url={`/card/house/ownership/list/${this.props.projectId}`}
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
                <PartTwo titleCertificateId={titleCertificateId} />
            </Layout>
        )
    }
}
export default Form.create()(TabPage)