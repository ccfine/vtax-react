/**
 * Created by liurunbin on 2018/1/11.
 */
import React,{Component} from 'react';
import {Button,Modal,Row,Col,message,Card,Input} from 'antd';
import {request,fMoney} from '../../../../../../utils'
import {SearchTable} from 'compoments'
const searchFields = selectedData=> (getFieldValue,setFieldsValue)=> {
    return [
        {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:selectedData['mainId'] || false,
                url:`/project/list/${selectedData['mainId']}`,
            }
        },
        {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        },
        {
            label:'楼栋名称',
            fieldName:'buildingName',
            type:'input',
            span:6
        },
        {
            label:'单元',
            fieldName:'element',
            type:'element',
            span:6
        },
        {
            label:'房号',
            fieldName:'roomNumber',
            type:'input',
            span:6
        },
        {
            label:'客户名称',
            fieldName:'customerName',
            type:'input',
            span:6
        },
        {
            label:'纳税识别号',
            fieldName:'taxIdentificationCode',
            type:'input',
            span:6
        }
    ]
}
const getColumns = context => [
    {
        title: '操作',
        key: 'actions',
        fixed:true,
        width:'60px',
        className:'text-center',
        render: (text, record) => (
            <span style={{
                color:'#1890ff',
                cursor:'pointer'
            }} onClick={()=>{
                const modalRef = Modal.confirm({
                    title: '友情提醒',
                    content: '是否要匹配该条数据？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk:()=>{
                        modalRef && modalRef.destroy();
                        context.matchData(context.props.selectedData['id'],record.id)
                    },
                    onCancel() {
                        modalRef.destroy()
                    },
                });
            }}>
                匹配
            </span>
        )
    },
    {
        title:'楼栋名称',
        dataIndex:'buildingName',
    },
    {
        title:'单元',
        dataIndex:'element'
    },
    {
        title:'房号',
        dataIndex:'roomNumber'
    },
    {
        title:'客户名称',
        dataIndex:'customerName'
    },
    {
        title:'身份证号/纳税识别号',
        dataIndex:'taxIdentificationCode',
    },
    {
        title:'房间编码',
        dataIndex:'roomCode'
    },
    {
        title:'成交总价',
        dataIndex:'totalPrice',
        render:text=>fMoney(text),
        className:'table-money'
    }
]

class ManualMatchRoomModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        matching:false,
        tableKey:Date.now()
    }

    toggleLoaded = loaded => this.setState({loaded})

    componentWillReceiveProps(nextProps){
        if(nextProps.visible && this.props.selectedData['id']){
            this.setState({
                tableKey:Date.now()
            })
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    toggleMatching = matching =>{
        this.setState({
            matching
        })
    }
    matchData = (collectionId,roomId,cb) =>{
        this.toggleMatching(true)
        request.get('/output/invoice/marry/manual/determine',{
            params:{
                collectionId,
                roomId
            }
        })
            .then(({data})=>{
                this.toggleMatching(false)
                if(data.code===200){
                    message.success('手动匹配成功!');
                    this.props.toggleModalVisible(false);
                    this.props.refreshTable();
                }else{
                    message.error(`手动匹配失败:${data.msg}`)
                }
            })
            .catch(err=>{
                this.toggleMatching(false)
            })
    }
    putDataWithoutMatch = ids =>{
        this.toggleMatching(true)
        request.put(`/output/invoice/marry/append/determine`,[ids])
            .then(({data})=>{
                this.toggleMatching(false)
                if(data.code===200){
                    message.success('操作成功!');
                    this.props.toggleModalVisible(false);
                    this.props.refreshTable();
                }else{
                    message.error(`操作失败:${data.msg}`)
                }
            })
            .catch(err=>{
                this.toggleMatching(false)
            })
    }
    renderCheckedFields = ()=>{
        let children = [];
        const {selectedData} = this.props;
        const checkedData = [
            {
                label:'发票代码',
                initialValue:selectedData['invoiceCode']
            },
            {
                label:'发票号码',
                initialValue:selectedData['invoiceNum']
            },
            {
                label:'税率',
                initialValue:selectedData['taxRate']
            },
            {
                label:'价税合计',
                initialValue:selectedData['totalAmount']
            },
            {
                label:'开票日期',
                initialValue:selectedData['billingDate']
            },
            {
                label:'货物名称',
                initialValue:selectedData['commodityName']
            },
            {
                label:'规格型号',
                initialValue:selectedData['specificationModel']
            }
        ]
        checkedData.map((item,i)=>{

            children.push(
                <Col key={i} span={6}>
                    <Row style={{height:35,lineHeight:'35px'}}>
                        <Col span={6} style={{textAlign:'right'}}>
                            {item.label}:
                        </Col>
                        <Col span={18}>
                            <Input value={item.initialValue} disabled/>
                        </Col>
                    </Row>
                </Col>
            )

            return item;
        })

        return children
    }
    render(){
        const props = this.props;
        const {title} = this.props;
        const {tableKey,matching} = this.state;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={1000}
                destroyOnClose={true}
                bodyStyle={{
                    backgroundColor:'#fafafa'
                }}
                style={{
                    maxWidth:'90%'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={24}>
                            <Button
                                onClick={()=>{
                                    const modalRef = Modal.confirm({
                                        title: '友情提醒',
                                        content: '确认该条数据无需匹配？',
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk:()=>{
                                            modalRef && modalRef.destroy();
                                            this.putDataWithoutMatch(props.selectedData['id'])
                                        },
                                        onCancel() {
                                            modalRef.destroy()
                                        },
                                    });
                                }}
                                type="primary">无需匹配</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <Card title="对照信息" style={{
                    marginBottom:10
                }} className="search-card" bodyStyle={{
                    padding:'12px 16px'
                }}>
                    <Row>
                        {
                            this.renderCheckedFields()
                        }
                    </Row>
                </Card>
                <SearchTable
                    key={tableKey}
                    spinning={matching}
                    searchOption={{
                        fields:searchFields(this.props.selectedData),
                        cardProps:{
                            title:'查询条件'
                        }
                    }}
                    tableOption={{
                        pageSize:10,
                        columns:getColumns(this),
                        url:'/output/invoice/marry/manual/list',
                    }}
                >
                </SearchTable>
            </Modal>
        )
    }
}

export default ManualMatchRoomModal