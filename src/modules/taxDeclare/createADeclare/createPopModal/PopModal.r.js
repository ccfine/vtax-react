/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 10:40
 * description  :
 */
import React,{Component} from 'react';
import moment from 'moment';
import {connect} from 'react-redux'
import {Button,Modal,Form,Row,Col,Card,message} from 'antd';
import {SearchTable} from 'compoments'
import {request,requestDict,getFields,setFormat} from 'utils'

const searchFields = [
    {
        label: '纳税主体',
        fieldName: 'mainId',
        type: 'taxMain',
        span: 12,
        componentProps:{
        },
        fieldDecoratorOptions: {
        },
    },
]
const getColumns = context=> [
    {
        title: '纳税主体',
        dataIndex: 'name',
        width: '500px',
    }, {
        title: '税（费）种',
        dataIndex: 'taxType',
        width: '260px',
        render:text=>{
            /*//1增值税、2企业所得税
            let t = '';
            switch (parseInt(text,0)){
                case 1:
                    t='增值税';
                    break;
                case 2:
                    t='企业所得税';
                    break;
                default:
                    t='增值税';
                    break;
            }
            return t*/
            return '增值税'
        },
    }
];

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={
        tableKey:Date.now(),
        taxDeclaration:[],
        taxModality:[],
        isProcess:[],
        initData:{},
        filters:{},
        selectedRowKeys:undefined,
        selectedRows:[],
        searchTableLoading:false,
    }
    componentDidMount(){
        //获取纳税申报对应的数据字典
        requestDict('NSSB',result=>{
            this.setState({
                taxDeclaration :setFormat(result)
            })
        });
        //获取纳税形式对应的数据字典
        requestDict('NSXS',result=>{
            this.setState({
                taxModality :setFormat(result)
            })
        });
        //获取所属流程对应的数据字典
        requestDict('SSLC',result=>{
            this.setState({
                isProcess :setFormat(result)
            })
        });

        this.refreshTable()
    }
    toggleLoading=b=>{
        this.setState({
            searchTableLoading:b
        })
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(this.state.selectedRows.length<1){
                    return message.error('请选择要创建申报的纳税主体！')
                }
                if(values.subordinatePeriod && values.subordinatePeriod.length!==0){
                    values.subordinatePeriodStart = values.subordinatePeriod[0].format('YYYY-MM-DD')
                    values.subordinatePeriodEnd= values.subordinatePeriod[1].format('YYYY-MM-DD')
                    values.subordinatePeriod = undefined;
                }
                values.declarationDate = values.declarationDate && values.declarationDate.format('YYYY-MM-DD');  //YYYY-MM-DD HH:mm

                const data = this.state.selectedRows.map(item=>{
                    return {
                        ...item,
                        mainName:item.name,
                        mainId:item.id,
                        taxType:1,
                        id:null,
                        ...values,
                    }
                })

                const type = this.props.modalConfig.type;
                this.toggleLoading(true)
                if(type === 'add') {
                    request.post('/tax/declaration/add',{
                            list:data
                        }
                    )
                        .then(({data}) => {
                            this.toggleLoading(false)
                            if (data.code === 200) {
                                message.success('提交成功', 4)
                                this.props.form.resetFields();
                                this.setState({
                                    initData: {}
                                })
                                this.props.toggleModalVisible(false);
                                this.props.refreshTable();
                            } else {
                                message.error(data.msg, 4)
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.props.toggleModalVisible(false)

                        })
                }


            }
        });

    }
    fetchDeclarationById = id=>{
        request.get(`/tax/declaration/find/${id}`)
            .then(({data})=>{
                this.setState({
                    initData:data.data,
                })
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData: {},
            })
        }
        if (this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add') {
            /**
             * 弹出的时候如果类型不为添加，则异步请求数据
             * */
            this.fetchDeclarationById(nextProps.modalConfig.id)
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {initData,taxDeclaration,taxModality,isProcess,tableKey,searchTableLoading} = this.state;
        const formItemStyle={
            labelCol:{
                span:8
            },
            wrapperCol:{
                span:14
            }
        }
        const props = this.props;
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '创建';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                disabled=true;
                break;
            default :
            //no default
        }
        const dateFormat = 'YYYY/MM/DD';
        let shouldShowDefaultData = false;
        if(type==='edit' || type==='view'){
            shouldShowDefaultData = true;
        }
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{top:'5%'}}
                bodyStyle={{maxHeight:450,overflowY:'auto'}}
                visible={props.visible}
                footer={
                    type !== 'view' && <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.toggleModalVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={`${title}申报`}>
                {
                    type !== 'view' && <SearchTable
                        spinning={searchTableLoading}
                        searchOption={{
                            fields:searchFields,
                            cardProps:{
                                style:{
                                    borderTop:0
                                }
                            },
                            onFieldsChange:values=>{
                                this.setState({
                                    filters:values
                                })
                            }
                        }}
                        tableOption={{
                            key:tableKey,
                            pageSize:10,
                            columns:getColumns(this),
                            scroll:{ y: 240 },
                            onRowSelect:(selectedRowKeys,selectedRows)=>{
                                this.setState({
                                    selectedRowKeys:selectedRowKeys[0],
                                    selectedRows,
                                })
                            },
                            url: '/tax/declaration/add/list',
                        }}
                    >
                    </SearchTable>
                }


                <Card
                    style={{
                        marginTop: type !== 'view' && 10
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税申报',
                                        fieldName:'taxDeclarationId',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        options:taxDeclaration,
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxDeclarationId'],
                                            rules: [
                                                {
                                                    required:true,
                                                    message:'请选择纳税申报'
                                                }
                                            ],
                                        }
                                    },{
                                        label:'纳税形式',
                                        fieldName:'taxModalityId',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        options:taxModality,
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['taxModalityId'],
                                            rules: [
                                                {
                                                    required:true,
                                                    message:'请选择纳税形式'
                                                }
                                            ],
                                        }
                                    },{
                                        label:'所属期起止',
                                        fieldName:'subordinatePeriod',
                                        type:'rangePicker',  //月份 monthRangePicker
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled,
                                            //showTime:{ format: 'HH:mm' },
                                            //format:"YYYY-MM-DD HH:mm",
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:shouldShowDefaultData ? [moment(initData.subordinatePeriodStart, dateFormat), moment(initData.subordinatePeriodEnd, dateFormat)] : [],
                                            rules: [
                                                {
                                                    required:true,
                                                    message:'请选择所属期起止'
                                                }
                                            ],
                                        }
                                    },{
                                        label:'所属流程',
                                        fieldName:'isProcessId',
                                        type:'select',
                                        span:12,
                                        formItemStyle,
                                        options:isProcess,
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['isProcessId'],
                                            rules: [
                                                {
                                                    required:true,
                                                    message:'请选择所属流程'
                                                }
                                            ],
                                        }
                                    },{
                                        label:'事项说明',
                                        fieldName:'remark',
                                        type:'textArea',
                                        span:24,
                                        formItemStyle:{
                                            labelCol:{
                                                span:4
                                            },
                                            wrapperCol:{
                                                span:19
                                            }
                                        },
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:initData['remark'],
                                        }
                                    },{
                                        label:'申报人',
                                        fieldName:'declareBy',
                                        type:'input',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled,
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:shouldShowDefaultData?initData['declareBy']:this.props.userName,
                                        }
                                    },{
                                        label:'申报日期',
                                        fieldName:'declarationDate',
                                        type:'datePicker',
                                        span:12,
                                        formItemStyle,
                                        componentProps:{
                                            disabled,
                                            //showTime:{ format: 'HH:mm' },
                                            //format:"YYYY-MM-DD HH:mm",
                                        },
                                        fieldDecoratorOptions:{
                                            initialValue:shouldShowDefaultData ? moment(initData['declarationDate'], dateFormat) : moment(moment(), dateFormat),
                                        }
                                    },
                                ])
                            }
                        </Row>
                    </Form>
                </Card>
            </Modal>
        )
    }
}
export default Form.create()(connect(state=>{
    return {
        userName:state.user.getIn(['personal','username'])
    }
})(PopModal))