/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Card,Form,Button,Row,Col,Modal,message} from 'antd'
import {AsyncTable} from '../../../../../compoments'
import {getFields,htmlDecode,request,accDiv} from '../../../../../utils'
import {List} from 'immutable'
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
                                span:20
                            },
                            wrapperCol:{
                                span:20
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
        text:'手工录入',
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
            width:80,
            render:text=><div dangerouslySetInnerHTML={{  __html: htmlDecode(text) }}></div>,
        },{
            title: '项目分期编码',
            dataIndex: 'stagesNum',
            width:80,
        },{
            title: '项目分期名称',
            dataIndex: 'stagesName',
            width:80,
        }, {
            title: '建筑面积数据来源',
            dataIndex: 'sourceType',
            width:100,
            render: (text, record) =>this.renderColumns(text, record, `data[${record.key}].sourceType`,'select',options)
        },{
            title: '建筑面积(m²)',
            width:60,
            dataIndex: 'buildingArea',
        },{
            title: '税务分摊比例',
            width:60,
            dataIndex: 'taxScale',
        }
    ];
    handleChange=(value,record)=>{
        const params = {
            stagesId:record.stagesId,
            source:value,
        }
        let sum  = 0;
        request.get('/account/income/taxContract/proportion/source',{
            params:params
        }).then(({data}) => {
            if (data.code === 200) {

                //修改 建筑面积 的数据
                this.setState(prevState=>({
                    $$dataSource:prevState.$$dataSource.set(record.key, {
                        ...record,
                        buildingArea: data.data.buildingArea === '' ? 0 : data.data.buildingArea
                    })
                }),()=>{
                    //计算总和
                    this.state.$$dataSource.forEach(element=>{
                        sum += parseFloat(element.buildingArea);
                    })

                    const thisTaxScale = accDiv(data.data.buildingArea,sum);
                    const taxSale = parseFloat(thisTaxScale.toString().substring(0,4));

                    this.setState(prevState=>{
                        return {
                            $$dataSource:prevState.$$dataSource.set(record.key, {
                                ...record,
                                buildingArea: data.data.buildingArea === '' ? 0 : data.data.buildingArea,
                                taxScale: taxSale
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
            },200)

        }
    }

    render(){
        const {$$dataSource,footerDate,updateKey,isShowDataSource} = this.state;
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
                                        scroll:{x: '100%', y: 400 },
                                        dataSource: (isShowDataSource && $$dataSource.toArray()) || undefined,
                                        footerDate: (isShowDataSource && footerDate) || undefined,
                                        onDataChange:(dataSource)=>{
                                            this.setState({
                                                $$dataSource:List(dataSource)
                                            })
                                        },
                                        renderFooter:data=>{
                                            return (
                                                <div>
                                                    <div style={{marginBottom:10}}>
                                                        <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                        建筑面积(m²)：<span style={code}>{data.allBuildingArea}</span>
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