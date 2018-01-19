/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Card,Form,Button,Row,Col,Modal,message} from 'antd'
import {AsyncTable} from '../../../../../compoments'
import {getFields,htmlDecode,request} from '../../../../../utils'
const spanPaddingRight={
    paddingRight:30
}
const code = {
    margin:' 0 1px',
    background: '#f2f4f5',
    borderRadius: '3px',
    fontSize: '.9em',
    border:'1px solid #eee',
    marginRight:30,
    padding: '2px 4px'
}

const EditableCell = ({record, form, column, type,options,componentProps,fieldDecoratorOptions}) => {
    return (
        <div>
            {
                getFields(form,[
                        {
                            fieldName:`${column}`,
                            type:type,
                            span:24,
                            options:options,
                            formItemStyle:{
                                labelCol:{
                                    span:24
                                },
                                wrapperCol:{
                                    span:24
                                }
                            },
                            componentProps:{
                                ...componentProps
                            },
                            fieldDecoratorOptions:{
                                ...fieldDecoratorOptions
                            }
                        }
                    ])
            }
        </div>
    );
}
const options = [
    {
        text:'施工许可证',
        value:'0'
    },
    {
        text:'预售许可证',
        value:'1'
    }
]
class PopModal extends Component{

    state={
        initData:[],
        updateKey:Date.now()
    }

    static defaultProps={
        visible:true,
    }

    columns = [
        {
            title: '合同名称',
            dataIndex: 'contractNum',
            width:100,
            render:text=><div dangerouslySetInnerHTML={{  __html: htmlDecode(text) }}></div>,
        },{
            title: '项目分期编码',
            dataIndex: 'stagesNum',
            width:100,
        },{
            title: '项目分期名称',
            dataIndex: 'stagesName',
            width:100,
        }, {
            title: '建筑面积数据来源',
            dataIndex: 'sourceType',
            width:100,
            render: (text, record) =>this.renderColumns(text, record, `data[${record.key}].sourceType`,'select',options)
        },{
            title: '建筑面积(m²)',
            width:100,
            dataIndex: 'buildingArea',
            render: (text, record) =>this.renderColumns(text, record, `data[${record.key}].buildingArea`,'numeric')
        },{
            title: '税务分摊比例',
            width:200,
            dataIndex: 'taxScale',
        }
    ];
    renderColumns(text, record, column,type,options=[],fieldDecoratorOptions={initialValue:text},TextAreaAutoSize={}) {
        return  parseInt(this.porps.selectedRows[0].status, 0) === 1 ? <EditableCell
                record={record}
                value={text}
                form={this.props.form}
                column={column}
                type={type}
                options={options}
                fieldDecoratorOptions={fieldDecoratorOptions}
                componentProps={TextAreaAutoSize}
                //onChange={value => this.handleChange(value, record.key, column)}
            />
            :
            text
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            const newData = [...this.state.initData];
            let arrList = newData.map((item,i)=>{
                return {
                    ...item,
                    ...values.data[i+1],
                }
            });

            console.log(arrList);

            if (!err) {
                request.post('/account/income/taxContract/proportion/determine',{list:arrList})
                    .then(({data})=>{
                        if(data.code===200){
                            const props = this.props;
                            message.success('保存成功!');
                            props.refreshTable();
                            this.props.form.resetFields()
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })

            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.toggleModalVisible(false)
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
        }
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.setState({
                    updateKey:Date.now()
                });
            },200)

        }

        /*if(nextProps.tableUpDateKey !== this.props.tableUpDateKey){
            console.log(nextProps.tableUpDateKey, this.props.tableUpDateKey)
            setTimeout(()=>{
                this.setState({
                    updateKey:Date.now()
                });
            },200)
        }*/
    }

    render(){
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={this.handleReset}>取消</Button>
                        </Col>
                    </Row>
                }
                title={props.title}>

                <Card style={{marginTop:10}}>
                    <Form onSubmit={this.handleSubmit}>
                        <AsyncTable url="/account/income/taxContract/proportion/list"
                                    updateKey={this.state.updateKey}
                                    filters={{
                                        contractNum: props.selectedRows.length >0 && props.selectedRows[0].contractNum,
                                        authMonth: props.filters.authMonth,
                                    }}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:false,
                                        size:'small',
                                        columns:this.columns,
                                        renderFooter:data=>{
                                            return (
                                                <div>
                                                    <div style={{marginBottom:10}}>
                                                        <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                        建筑面积(m²)：<span style={code}>{data.totalAdjustAmount}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }} />

                    </Form>
                </Card>
            </Modal>
        )
    }
}
export default Form.create()(PopModal)