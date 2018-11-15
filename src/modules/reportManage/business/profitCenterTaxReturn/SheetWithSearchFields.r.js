/**
 * Created by liuliyuan on 2018/10/23.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Row, Col, Button,Card,message} from 'antd'
import {getFields,composeBotton,request} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'
import Sheet from 'modules/reportManage/business/taxReturnForm/Sheet.r'
class SheetWithSearchFields extends Component{
    static propTypes={
        tab:PropTypes.string,
        grid:PropTypes.array,
        url:PropTypes.string,
        composeGrid:PropTypes.func,
        action:PropTypes.bool,
    }
    static defaultProps = {
        grid:[],
        searchFields:(defaultParams={})=>(getFieldValue)=>[
            {
                label:'纳税主体',
                fieldName:'main',
                type:'taxMain',
                span:6,
                componentProps:{
                    labelInValue:true,
                },
                fieldDecoratorOptions:{
                    initialValue: JSON.stringify(defaultParams) !== "{}" ? (defaultParams && {key:defaultParams.mainId,label:''}) : undefined ,
                    rules:[
                        {
                            required:true,
                            message:'请选择纳税主体'
                        }
                    ]
                },
            },
            {
                label:'月份',
                fieldName:'taxMonth',
                span:6,
                type:'monthPicker',
                fieldDecoratorOptions:{
                    initialValue: (defaultParams.taxMonth && moment(defaultParams.taxMonth)) || undefined,
                    rules:[
                        {
                            required:true,
                            message:'请选择月份'
                        }
                    ]
                }
            },
            {
                label: '利润中心',
                fieldName: 'profitCenterId',
                type: 'asyncSelect',
                span: 6,
                fieldDecoratorOptions: {
                    initialValue: JSON.stringify(defaultParams) !== "{}" ? (defaultParams && defaultParams.profitCenterId) : undefined ,
                    rules: [
                        {
                            required: true,
                            message: '请选择利润中心'
                        }
                    ]
                },
                componentProps: {
                    fieldTextName: 'profitName',
                    fieldValueName: 'id',
                    doNotFetchDidMount: false,
                    fetchAble: (getFieldValue('main') && getFieldValue('main').key) || (JSON.stringify(defaultParams) !== "{}" && (defaultParams && defaultParams.mainId)) || false,
                    url: `/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key) || (JSON.stringify(defaultParams) !== "{}" && (defaultParams && defaultParams.mainId))}`,
                }
            }
        ]
    }
    state={
        params:{},
        updateKey:Date.now(),
        saveLoding:false,
        /**
         *修改状态和时间
         * */
        statusParam:'',
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        })
    }
    onSubmit = e =>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.reportType = this.props.reportType;
                values.taxMonth = values.taxMonth.format('YYYY-MM');
                if(values.main){
                    values.mainId = values.main.key
                    delete values.main
                }
                if(values.map){
                    delete values.map
                }
                this.mounted && this.setState({
                    params: values,
                    updateKey:Date.now()
                })
                this.props.onParamsChange && this.props.onParamsChange(values); //{taxMonth:values.taxMonth,main:values.main}
            }
        })
    }
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                for(let key in values.map){
                    values.map[key] = values.map[key].replace(/\$\s?|(,*)/g, '')
                }
                values.taxMonth = values.taxMonth.format('YYYY-MM');
                values.reportType = this.props.reportType;
                if(values.main){
                    values.mainId = values.main.key
                    delete values.main
                }
                this.mounted && this.setState({saveLoding:true})
                request.post(this.props.saveUrl,values)
                    .then(({data})=>{
                        this.mounted && this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.onSubmit();
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.mounted && this.setState({saveLoding:false})
                    })
            }
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { tab, grid, url , searchFields, form, composeGrid,scroll,action,saveUrl,defaultParams} = this.props;
        const { params,updateKey,saveLoding } = this.state;
        const readOnly = false; //TODO: 设置页面默认是否可输入
        return(
            <Form onSubmit={this.onSubmit}>
            <div>
                <div style={{
                    backgroundColor:'#fff',
                    padding:'10px 10px 0 0',
                    marginBottom:10
                }}>
                        <Row>
                            {
                                getFields(form, searchFields(defaultParams))
                            }
                            <Col style={{width:'100%',textAlign:'right'}}>
                                <Button size='small' style={{marginTop:5,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button size='small' style={{marginTop:5,marginLeft:10}} onClick={()=>{
                                    form.resetFields();
                                    this.setState({
                                        params:{}
                                    })
                                    this.props.onParamsChange && this.props.onParamsChange({});
                                }}>重置</Button>
                            </Col>
                        </Row>
                </div>
                <Card
                    bordered={false}
                    extra={
                        <div>
                            {
                                JSON.stringify(params)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'TaxDecConductPc/export',
                                    params:{...params,authMonth:params.taxMonth},
                                    title:'导出',
                                    userPermissions:['2161007'],
                                }])
                            }
                            {/*{
                                composeBotton([{
                                    type:'fileExport',
                                    url:'tax/decConduct/main/download',
                                    title:'下载附件',
                                    onSuccess:this.refreshTable
                                }])
                            }*/}
                            {
                                JSON.stringify(params)!=='{}' && saveUrl && !readOnly && composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    userPermissions:['2161003'],
                                    onClick:this.save,
                                    loading:saveLoding,
                                    style:{
                                        marginLeft:action ? 10 : 0
                                    }
                                }])
                            }
                        </div>
                    }
                    title={<span><label className="tab-breadcrumb">利润中心纳税申报表 / </label>{tab}</span>}
                    bodyStyle={{
                        padding:10
                    }}
                >
                    <Sheet readOnly={readOnly} scroll={scroll} grid={grid} url={url} params={params} composeGrid={composeGrid} updateKey={updateKey} form={this.props.form}/>
                </Card>
            </div>


        </Form>
        )
    }
}
export default Form.create()(withRouter(SheetWithSearchFields))
