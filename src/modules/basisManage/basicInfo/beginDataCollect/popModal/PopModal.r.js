/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react';
import {Form,Drawer,Row} from 'antd';
import {AsyncTable} from 'compoments'
import {getFields} from 'utils'
import TabPage from './tabs.r'

const getColumns = context =>[
    {
        title: '利润中心',
        dataIndex: 'mainName',//profitCenterName
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
        creditSubject:'',
        selectedRowKeys:[],
        selectedRows:[],
        filters:{
            creditSubject:'',
        }
    }

    state = {
        pageTabsKey:Date.now(),
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            tableKey:Date.now()
        })
    }
    toggleModalVisible=visible=>{
        this.mounted && this.setState({
            visible
        })
    }
    changeState = (value) =>{
        this.setState({
            filters:{
                creditSubject:value
            },
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
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && this.props.visible !== nextProps.visible){
            //传进来的是要求打开并且当前是关闭状态的时候，一打开就初始化
            this.changeState(nextProps.modalConfig.record.finish)
        }
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {tableKey,pageTabsKey,filters,selectedRows} = this.state;
        const {form,visible,modalConfig:{type,record}} = this.props;
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
                onClose={()=>{
                    this.props.toggleModalVisible(false)
                    disabled || this.props.refreshTable();
                }}
                maskClosable={false}
                destroyOnClose={true}
                style={{
                    height:window.screen.availHeight-150,
                    overflowY:'auto'

                }}
            >
                <Form>
                    <Row>
                        {
                            getFields(form,[
                                {
                                    label: "期初数据采集维度",
                                    fieldName: "creditSubject",
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
                                            this.changeState(value)
                                        }
                                    },
                                    fieldDecoratorOptions: {
                                        initialValue: (record && record.finish) || undefined,
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
                {
                    (filters && filters.creditSubject === '2') && <AsyncTable url='/dataCollection/list'
                                                                        updateKey={tableKey}
                                                                        filters={{
                                                                            ...this.state.filters,
                                                                        }}
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
                    ((selectedRows && selectedRows.length>0) && (filters && filters.creditSubject === '2')) && <TabPage key={pageTabsKey} selectedRows={selectedRows} mainId={record.mainId} filters={filters} type={type} disabled={disabled} />
                }
                {
                    (filters && filters.creditSubject === '1') && <TabPage key={pageTabsKey} mainId={record.mainId} filters={filters} type={type} disabled={disabled} />
                }
            </Drawer>
        )
    }
}

export default Form.create()(PopModal)