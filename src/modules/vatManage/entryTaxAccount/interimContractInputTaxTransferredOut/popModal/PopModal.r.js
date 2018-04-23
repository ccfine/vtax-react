/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Card,Form,Button,Row,Col,Modal,message} from 'antd'
import {AsyncTable} from 'compoments'
import {getFields,htmlDecode,request,accDiv} from 'utils'
import {List} from 'immutable'
// style={{width:'160px',overflow:'hidden',margin:'0 auto'}}
const EditableCell = ({record, form, column, type,options,componentProps,fieldDecoratorOptions}) => {
    return (
        <div>
            {
                getFields(form,[
                    {
                        label:'建筑面积数据来源',
                        fieldName:`${column}`,
                        type:type,
                        span:24,
                        notLabel:true,
                        whetherShowAll:true,
                        /*
                        formItemStyle:{
                            labelCol:{
                                span:0
                            },
                            wrapperCol:{
                                span:24
                            }
                        },*/
                        options:options,
                        componentProps:{
                            ...componentProps,
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
        text:'建设工程规划许可证',
        value:'0'
    },{
        text:'施工许可证',
        value:'1'
    },{
        text:'预售许可证',
        value:'2'
    }
]

class PopModal extends Component{

    state={
        $$dataSource:List([]),
        footerDate:{},
        updateKey:Date.now(),
        isShowDataSource:false,
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
            render: (text, record) =>this.renderColumns(text, record, `data[${record.key}].sourceType`,'select',options),
            width:160,
        },{
            title: '建筑面积(m²)',
            width:80,
            dataIndex: 'buildingArea',
        },{
            title: '税务分摊比例',
            width:80,
            dataIndex: 'taxScale',
        }
    ];
    handleChange=(value,record)=>{
        request.get('/account/income/taxContract/proportion/source',{
            params:{
                stagesId:record.stagesId,
                source:!value ? value=5 : value,
            }
        }).then(({data}) => {
            if (data.code === 200) {

                let sum  = 0;
                //修改 建筑面积 的数据
                this.setState(prevState=>({
                    $$dataSource:prevState.$$dataSource.set(record.key, {
                        ...record,
                        buildingArea: data.data.buildingArea === '' ? 0 : data.data.buildingArea,
                        sourceType:value,
                    })
                }),()=>{
                    //计算总和
                    this.state.$$dataSource.forEach(element=>{
                        sum += parseFloat(element.buildingArea);
                    })

                    //计算当前值
                    this.setState(prevState=>{
                        return {
                            $$dataSource:prevState.$$dataSource.map(item=>{
                                if(record.stagesId !== item.stagesId){
                                    const thisTaxScale2 = accDiv(item.buildingArea,sum);
                                    const taxSale2 = parseFloat(thisTaxScale2.toString()).toFixed(4);
                                    return{
                                        ...item,
                                        taxScale:taxSale2
                                    }
                                }else{
                                    const thisTaxScale = accDiv(data.data.buildingArea,sum);
                                    const taxSale = parseFloat(thisTaxScale.toString()).toFixed(4);
                                    return {
                                        ...item,
                                        buildingArea: data.data.buildingArea === '' ? 0 : data.data.buildingArea,
                                        taxScale: taxSale
                                    }
                                }
                            }),
                            footerDate:{
                                allBuildingArea:sum //赋值总和
                            },
                            isShowDataSource:true,
                        }
                    })
                })
            }
        });
    }

    renderColumns(text, record, column,type,options=[],fieldDecoratorOptions={initialValue:`${text}`}) {

        return parseInt(record.status, 0) === 1 ? <EditableCell
                record={record}
                value={text}
                form={this.props.form}
                column={column}
                type={type}
                options={options}
                fieldDecoratorOptions={fieldDecoratorOptions}
                componentProps={
                    {
                        onChange:(value)=>this.handleChange(value,record)
                    }
                }
                //onChange={value => this.handleChange(value, record.key, column)}
            />
            : text
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //console.log(this.state.$$dataSource.toArray(), values)
            if (!err) {
                request.post('/account/income/taxContract/proportion/determine',{list:this.state.$$dataSource.toArray()})
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('保存成功!');
                            this.props.refreshTable();
                            this.props.form.resetFields();
                            this.props.toggleModalVisible(false);
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
            },100)

        }
    }

    render(){
        const {$$dataSource,footerDate,updateKey,isShowDataSource} = this.state;
        const props = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                width={900}
                style={{ top: 50 }}//,maxWidth:'80%'
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
                                    updateKey={updateKey}
                                    filters={{
                                        contractNum: props.selectedRows.length >0 && props.selectedRows[0].contractNum,
                                        authMonth: props.filters.authMonth,
                                    }}
                                    tableProps={{
                                        rowKey:record=>record.id,
                                        pagination:false,
                                        size:'small',
                                        columns:this.columns,
                                        scroll:{y: 400 },
                                        dataSource: (isShowDataSource && $$dataSource.toArray()) || undefined,
                                        footerDate: (isShowDataSource && footerDate) || undefined,
                                        onDataChange:(dataSource)=>{
                                            this.setState({
                                                $$dataSource:List(dataSource)
                                            })
                                        },
                                        renderFooter:data=>{
                                            return (
                                                <div className="footer-total">
                                                    <div className="footer-total-meta">
                                                        <div className="footer-total-meta-title">
                                                            <label>合计：</label>
                                                        </div>
                                                        <div className="footer-total-meta-detail">
                                                            建筑面积(m²)：<span className="amount-code">{data.allBuildingArea}</span>
                                                        </div>
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