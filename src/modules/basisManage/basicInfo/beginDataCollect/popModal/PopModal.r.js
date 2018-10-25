/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react';
import {Form,Drawer,Row,Modal,message} from 'antd';
import {AsyncTable} from 'compoments'
import {getFields,request} from 'utils'
import TabPage from './tabs.r'

const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'profitCenterName',
    },{
        title: '是否已采集',
        dataIndex: 'finish',
        width:'200px',
        render:text=>{
            //是否处理1:已采集 0:未采集 ,
            let t = '';
            switch (parseInt(text,0)){
                case 0:
                    t=<span style={{ color: '#44b973' }}>未采集</span>;
                    break;
                case 1:
                    t=<span style={{ color: '#1795f6' }}>已采集</span>;
                    break;
                default:
                //no default
            }
            return t
        }
    }
];

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
        beginType:'',
        selectedRowKeys:[],
        selectedRows:[],
    }

    state = {
        pageTabsKey:Date.now(),
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            tableKey:Date.now(),
            pageTabsKey:Date.now(),
        })
    }
    toggleModalVisible=visible=>{
        this.mounted && this.setState({
            visible
        })
    }
    changeState = (value) =>{
        this.setState({
            beginType:value
        },()=>{
            value === '1' ?
                this.setState({
                    pageTabsKey:Date.now(),
                })
                :
                this.setState({
                    selectedRows:[],
                },()=>{
                    this.refreshTable()
                });
        })
    }
    deleteRecord = (type) =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '更改采集维度后，以前的数据将会清除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                request.delete(`/dataCollection/delete/${this.props.modalConfig.record.mainId}/${type}`)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('删除成功！');
                            this.changeState(type)
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });

    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && this.props.visible !== nextProps.visible){
            //传进来的是要求打开并且当前是关闭状态的时候，一打开就初始化
            this.changeState(nextProps.modalConfig.record.type)
        }
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {tableKey,pageTabsKey,beginType,selectedRows} = this.state;
        const {form,visible,modalConfig:{type,record}} = this.props;
        const params = {
            mainId:record && record.mainId,
            profitCenterId: (beginType === '2' && this.state.selectedRows && this.state.selectedRows.length>0) ? this.state.selectedRows[0].profitCenterId : undefined,
            //profitCenterName:this.state.selectedRows && this.state.selectedRows.length>0 ? this.state.selectedRows[0].profitCenterName : undefined
        }
        let title='';
        let disabled = false;
        switch (type){
            case 'modify':
                title = '编辑';
                break;
            case 'look':
                title = '查看';
                disabled = true;
                break;
            default :
            //no default
        }
        return(
            <Drawer
                title={title}
                placement="top"
                //closable={false}
                visible={visible}
                width={'100%'}
                height={'100%'}
                onClose={()=>{
                    this.props.toggleModalVisible(false)
                    this.refreshTable();
                    disabled || this.props.refreshTable();
                }}
                maskClosable={false}
                destroyOnClose={true}
                style={{
                    height: 'calc(100% - 55px)',
                    minHeight: '100vh',

                }}
            >
                <Form>
                    <Row>
                        {
                            getFields(form,[
                                {
                                    label: "期初数据采集维度",
                                    fieldName: "type",
                                    type: "select",
                                    options: [
                                        {
                                            text: "纳税主体",
                                            value: '1'
                                        },
                                        {
                                            text: "利润中心",
                                            value: '2'
                                        }
                                    ],
                                    span: "8",
                                    componentProps: {
                                        disabled,
                                        onChange:value=>{
                                            this.deleteRecord(value)
                                        }
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: (record && record.type) || undefined,
                                        rules: [
                                             {
                                                 required: true,
                                                 message: '请选择期初数据采集维度'
                                             }
                                         ]
                                     },
                                }
                            ])
                        }
                    </Row>
                </Form>
                <div style={{
                    height:window.screen.availHeight-250,
                    overflowY:'auto',
                }}>
                {
                    (beginType && beginType === '2') && <AsyncTable url={`/dataCollection/pc/list/${record && record.mainId}`}
                                                                        updateKey={tableKey}
                                                                        tableProps={{
                                                                            rowKey:record=>record.id,
                                                                            pageSize:100,
                                                                            columns:getColumns(this),
                                                                            rowSelection:{
                                                                                type: 'radio',
                                                                            },
                                                                            onRowSelect:(selectedRowKeys,selectedRows)=>{
                                                                                this.setState({
                                                                                    selectedRowKeys,
                                                                                    selectedRows,
                                                                                    pageTabsKey:Date.now(),
                                                                                })
                                                                            },
                                                                            scroll:{
                                                                                y:150,
                                                                            },
                                                                            style:{marginBottom:'20px'}
                                                                    }} />
                }
                {
                    ((selectedRows && selectedRows.length>0) && (beginType && beginType === '2')) && <TabPage key={pageTabsKey} filters={params} type={type} disabled={disabled} beginType={beginType} />
                }
                {
                    (beginType && beginType === '1') && <TabPage key={pageTabsKey} filters={params} type={type} disabled={disabled} beginType={beginType} />
                }
                </div>
            </Drawer>
        )
    }
}

export default Form.create()(PopModal)