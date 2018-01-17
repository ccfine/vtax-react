/**
 * author       : liuliyuan
 * createTime   : 2018/1/10 14:39
 * description  :
 */
import React,{Component} from 'react'
import {Card,Form,Button,Row,Col,Modal} from 'antd'
import {SynchronizeTable} from '../../../../../compoments'
import {getFields,htmlDecode} from '../../../../../utils'
/*const spanPaddingRight={
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
}*/

const EditableCell = ({ editable, value, form, column, type,options,componentProps,fieldDecoratorOptions}) => {
    return (
        <div>
            {
                editable
                    ? getFields(form,[
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
                    : value
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

const dataSource = [
    {
        id:'1',
        contractTitle:'HT001',
        projectStagingCode :'001',
        projectStagingName:'项目分期名称41',
        constructionAreaDataSource:'1',
        constructionArea:'',
        taxAssessmentRatio:'16.67%',
        summary:true,
    },{
        id:'2',
        contractTitle:'HT001',
        projectStagingCode :'002',
        projectStagingName:'项目分期名称2',
        constructionAreaDataSource:'0',
        constructionArea:'',
        taxAssessmentRatio:'16.67%',
        summary:true,
    },{
        id:'3',
        contractTitle:'HT001',
        projectStagingCode :'003',
        projectStagingName:'项目分期名称3',
        constructionAreaDataSource:'1',
        constructionArea:'',
        taxAssessmentRatio:'16.67%',
        summary:true,
    }
]
class PopModal extends Component{
    static defaultProps={
        visible:true,
    }

    columns = [
        {
            title: '合同名称',
            dataIndex: 'contractTitle',
            width:100,
            render:text=><div dangerouslySetInnerHTML={{  __html: htmlDecode(text) }}></div>,
        },{
            title: '项目分期编码',
            dataIndex: 'projectStagingCode',
            width:100,
        },{
            title: '项目分期名称',
            dataIndex: 'projectStagingName',
            width:100,
        }, {
            title: '建筑面积数据来源',
            dataIndex: 'constructionAreaDataSource',
            width:100,
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].constructionAreaDataSource`,'select',options)
        },{
            title: '建筑面积(m²)',
            width:100,
            dataIndex: 'constructionArea',
            render: (text, record) =>this.renderColumns(text, record, `data[${record.id}].constructionArea`,'numeric')
        },{
            title: '税务分摊比例',
            width:200,
            dataIndex: 'taxAssessmentRatio',
        }
    ];
    renderColumns(text, record, column,type,options=[],fieldDecoratorOptions={initialValue:text},TextAreaAutoSize={}) {
        return  <EditableCell
                editable={record.summary}
                value={text}
                form={this.props.form}
                column={column}
                type={type}
                options={options}
                fieldDecoratorOptions={fieldDecoratorOptions}
                componentProps={TextAreaAutoSize}
                //onChange={value => this.handleChange(value, record.key, column)}
            />
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {

            const newData = [...dataSource];
            let arrList = newData.map((item,i)=>{
                return {
                    ...item,
                    ...values.data[i+1],
                }
            });

            console.log(arrList);

            /*if (!err) {
                request.post('/account/income/taxstructure/save',{list:arrList})
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

            }*/
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.toggleModalVisible(false)
    }
    componentWillReceiveProps(nextProps){
        //console.log(nextProps.tableUpDateKey, this.props.tableUpDateKey)
        /*if(nextProps.tableUpDateKey !== this.props.tableUpDateKey){
            request.get('/account/income/taxstructure/list',{
                params:{
                    ...nextProps.filters
                }
            })
                .then(({data}) => {
                    console.log(data.data.page.records[0].status)
                    if(data.code===200){
                        this.setState({
                            initData:data.data.page.records,
                        })
                    }
                });
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
                        <SynchronizeTable data={dataSource}
                                          updateKey={props.tableUpDateKey}
                                          tableProps={{
                                              rowKey:record=>record.id,
                                              pagination:false,
                                              size:'small',
                                              columns:this.columns,
                                              /*renderFooter:data=>{
                                                  return (
                                                      <div>
                                                          <div style={{marginBottom:10}}>
                                                              <span style={{width:100, display:'inline-block',textAlign: 'right',...spanPaddingRight}}>合计：</span>
                                                              建筑面积(m²)：<span style={code}>{data.totalAdjustAmount}</span>
                                                          </div>
                                                      </div>
                                                  )
                                              }*/
                                          }} />

                        {/*<AsyncTable url="/account/income/taxstructure/list"
                                    updateKey={props.tableUpDateKey}
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
                                    }} />*/}

                    </Form>
                </Card>
            </Modal>
        )
    }
}
export default Form.create()(PopModal)