/**
 * Created by liuliyuan on 2018/5/12.
 */
import React,{Component} from 'react';
import {Modal,Row,Col,Spin,Card,message} from 'antd';
import {SynchronizeTable} from 'compoments'
import {request,fMoney} from 'utils'

const columns = [{
    title: '摘要',
    dataIndex: 'voucherAbstract',
    width:200
}, {
    title: '科目名称',
    dataIndex: 'debitProjectName',
    width:150
}, {
    title: '科目代码',
    dataIndex: 'debitProjectNum',
    width:150
},{
    title: '借方金额',
    dataIndex: 'debitAmount',
    render: text => fMoney(text),
    className: "table-money",
    width:120
},{
    title: '贷方金额',
    dataIndex: 'creditAmount',
    render: text => fMoney(text),
    className: "table-money",
    width:120
}];

export default class ViewDocumentDetails extends Component{
    static defaultProps={
        visible:true
    }
    state={
        loaded:false,
        /**
         * params条件，给table用的
         * */
        filters:{},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        record:{},
        dataSource:[],
    }

    toggleLoaded = loaded => this.setState({loaded})


    fetchReportByVoucherNum = (voucherNum) =>{
        this.toggleLoaded(false)
        request.get('/inter/financial/voucher/listByVoucher',{params:{voucherNum}})
            .then(({ data }) => {
                if (data.code === 200) {
                    this.toggleLoaded(true)
                    this.setState({
                        record: data.data,
                        dataSource:data.data.page.records,
                        tableUpDateKey:Date.now(),
                    });
                }
            })
            .catch(err => {
                this.toggleLoaded(true)
                message.error(err.message);
            });
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            this.setState({
                record:{},
                dataSource:[]
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.fetchReportByVoucherNum(nextProps.voucherNum)
        }
    }

    render(){
        const props = this.props;
        const {loaded,tableUpDateKey,record,dataSource} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleViewModalVisible(false)}
                width={900}
                style={{
                    maxWidth:'90%',
                    top:'5%',
                }}
                bodyStyle={{
                    maxHeight:480,
                    overflowY:'auto',
                }}
                visible={props.visible}
                footer={null}
                title={props.title}>
                <Spin spinning={!loaded}>
                    <Row gutter={24} style={{marginBottom: 10}}>
                        <Col span={8}>
                            纳税主体：{record.mainName}
                        </Col>
                        <Col span={8}>
                            纳税申报期：{record.authMonth}
                        </Col>
                        <Col span={8}>
                            项目分期：{record.stagesName}
                        </Col>
                    </Row>
                    <Row gutter={24} style={{marginBottom: 20}}>
                        <Col span={8}>
                            凭证日期：{record.voucherDate}
                        </Col>
                        <Col span={8}>
                            凭证类型：{record.voucherType}
                        </Col>
                        <Col span={8}>
                            凭证号：{record.voucherNum}
                        </Col>
                    </Row>

                    <Card title={`${props.title}列表`} style={{marginTop:10}}>
                        <SynchronizeTable data={dataSource}
                                          updateKey={tableUpDateKey}
                                          tableProps={{
                                              rowKey:record=>record.id,
                                              pagination:false,
                                              bordered:true,
                                              size:'small',
                                              columns:columns,
                                            //   scroll:{ x: 800, y: 300 }
                                          }} />

                        {/*<AsyncTable url="/inter/financial/voucher/listByVoucher"
                                    updateKey={tableUpDateKey}
                                    filters={{voucherNum:props.voucherNum}}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:true,
                                        size:'small',
                                        columns:columns,
                                        onDataChange:(dataSource)=>{
                                            console.log(dataSource)
                                            this.setState({
                                                record:dataSource[0]
                                            })
                                        },
                                    }}
                        />*/}
                    </Card>

                </Spin>

            </Modal>
        )
    }
}
