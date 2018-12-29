/**
 * Created by zhouzhe on 2018/12/27.
 */
import React,{Component} from 'react'
import {Modal,Card,Spin,message} from 'antd'
import {AsyncTable} from 'compoments'
import {request,composeBotton} from 'utils'
const columns = [
    {
        title: '申报表类型',
        dataIndex: 'declareType',
        width: '20%',
    }, {
        title: '税局审批结果',
        dataIndex: 'approvalStatusInfo',
        width: '20%',
    }, {
        title: '扣款状态',
        dataIndex: 'deductionStatusInfo',
        width: '20%',
    }, {
        title: '扣款金额',
        dataIndex: 'taxAmount',
        className: "table-money",
        width: '20%',
    }, {
        title: '失败结果说明',
        dataIndex: 'errorMessage',
        width: '20%',
    }
];

const messageInfo = {
    getResult: {
        text: '查询审批状态',
        info: '请确认是否要查询最新审批状态？',
    },
    submit: {
        text: '提交审批',
        info: '请确认申报数据无误，是否现在提交审批？',
    },
    deductions: {
        text: '扣款申请',
        info: '请确认是否提交扣款申请？',
    },
}

export default class PopDetailsModal extends Component{
    static defaultProps = {
        tableOption:{
            title:"申报进度详情"
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            tableKey:Date.now(),
            totalSource:{},
            dataSource: []
        };
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
            },200)
        }
    }
    handelArchiving=(record,url,type)=>{
        const params = {
            mainId: record.mainId,
            authMonth: record.month
        };
        const m = messageInfo[type];
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: m.info,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.put(`${url}`,{...params})
                    .then(({data})=>{
                        if (data.code === 200) {
                            message.success(`${m.text}成功!`);
                            this.refreshTable();
                        } else {
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    render(){
        const {tableKey} = this.state;
        const { visible, toggleModalVisible, record } = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={visible}
                footer={null}
                title={'申报进度详情'}>
                    <div className='oneLine'>
                        <Spin spinning={false}>
                            <Card
                                extra={<div>
                                    <span style={{marginRight:'50px'}}>{`纳税主体:${record.mainName}`}</span>
                                    <span style={{marginRight:'50px'}}>{`纳税申报期: ${record.month}`}</span>
                                    {
                                        composeBotton([{
                                            type:'consistent',
                                            text:'查询审批状态',
                                            btnType: '',
                                            userPermissions:['1935003'],
                                            onClick:()=>{
                                                this.handelArchiving(record,'/tax/decConduct/query/getResult', 'getResult')
                                            }
                                        },{
                                            type:'consistent',
                                            text:'提交审批',
                                            btnType: '',
                                            userPermissions:['1935002'],
                                            onClick: () => {
                                                this.handelArchiving(record,'/tax/decConduct/query/submit', 'submit')
                                            }
                                        
                                        },{
                                            type:'consistent',
                                            text:'扣款',
                                            btnType: '',
                                            userPermissions:['1935005'],
                                            onClick: () => {
                                                const { dataSource } = this.state;
                                                let arr = dataSource.filter(item => item.deductionStatus === '7' || item.deductionStatus === '9' || item.deductionStatus === '11')
                                                if (arr.length === 0) {
                                                    this.handelArchiving(record,'/tax/decConduct/query/deductions', 'deductions')
                                                } else {
                                                    const modalRef = Modal.success({
                                                        title: '友情提醒',
                                                        content: '已扣款成功，无需重复提交扣款申请',
                                                        okText: '确定',
                                                        onOk:()=>{
                                                            modalRef && modalRef.destroy();
                                                        },
                                                    });
                                                }
                                            }
                                        
                                        }])
                                    }
                                </div>}
                                style={{marginTop:6}}
                                bordered={false}
                            >
                                <AsyncTable url={`/tax/decConduct/query/scheduleList?mainId=${record.mainId}&authMonth=${record.month}`}
                                            updateKey={tableKey}
                                            tableProps={{
                                                rowKey:record=>record.id,
                                                size:'small',
                                                columns:columns,
                                                scroll:{ x: 500,y:'250px'},
                                                onDataChange: (dataSource) => {
                                                    this.setState({dataSource})
                                                }
                                            }}
                            />
                            </Card>
                        </Spin>
                    </div>
            </Modal>
        )
    }
}
