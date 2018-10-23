/**
 * Created by liuliyuan on 2018/10/11.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Row, Col, Button,Card,message} from 'antd'
import {getFields,listMainResultStatus,composeBotton,requestResultStatus,request} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'
import Sheet from './Sheet.r'

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
        searchFields:(disabled,declare,defaultParams={})=>[
            {
                label:'纳税主体',
                fieldName:'main',
                type:'taxMain',
                span:8,
                componentProps:{
                    labelInValue:true,
                    disabled,
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && declare.mainId) ? {key:declare.mainId,label:declare.mainName} : JSON.stringify(defaultParams) !== "{}" ? (defaultParams && {key:defaultParams.mainId,label:''}) : undefined ,
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
                span:8 ,
                type:'monthPicker',
                componentProps:{
                    disabled,
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || (defaultParams.taxMonth && moment(defaultParams.taxMonth)),
                    rules:[
                        {
                            required:true,
                            message:'请选择月份'
                        }
                    ]
                }
            },
        ]
    }
    state={
        params:{},
        updateKey:Date.now(),
        /**
         *修改状态和时间
         * */
        statusParam:'',
        saveLoding:false,
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        },()=>{
            this.fetchResultStatus()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/taxDeclarationReport/partner/listMain',{...this.state.params,authMonth:this.state.params.taxMonth},result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const { declare,drawerConfig:{partnerId},reportType } = this.props;
        if (!!declare) {
            this.mounted && this.setState({
                params:{
                    mainId:declare.mainId || undefined,
                    taxMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                    partnerId:partnerId,
                    reportType:reportType
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    onSubmit = e =>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){

                values.reportType = this.props.reportType;
                values.partnerId = this.props.drawerConfig.partnerId;
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
                values.reportType = this.props.reportType;
                values.partnerId = this.props.drawerConfig.partnerId;
                for(let key in values.map){
                    if(values.map[key] !== 0){
                        values.map[key] = values.map[key].replace(/\$\s?|(,*)/g, '')
                    }
                }
                values.taxMonth = values.taxMonth.format('YYYY-MM');
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
        const { tab, grid, url , searchFields, form, composeGrid,scroll,defaultParams,declare,action,saveUrl,drawerConfig} = this.props;
        let disabled = !!declare;
        const { params,updateKey,statusParam,saveLoding } = this.state;
        const readOnly = !(disabled && declare.decAction==='edit') || !(drawerConfig && drawerConfig.type==='edit') || parseInt(statusParam.status,10)===2;
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
                                getFields(form, searchFields(disabled,declare,defaultParams))
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
                                    listMainResultStatus(statusParam)
                                }
                                {/*{
                                    JSON.stringify(params)!=='{}' && composeBotton([{
                                        type:'fileExport',
                                        url:'report/tax/declare/export',
                                        params:{...params,authMonth:params.taxMonth},
                                        title:'导出',
                                        userPermissions:['1911007'],
                                    }])
                                }
                                {
                                    composeBotton([{
                                        type:'fileExport',
                                        url:'tax/decConduct/main/download',
                                        title:'下载附件',
                                        onSuccess:this.refreshTable
                                    }])
                                }*/}

                                {
                                    saveUrl && !readOnly && composeBotton([{
                                        type:'save',
                                        text:'保存',
                                        icon:'save',
                                        userPermissions:['2131004'],
                                        onClick:this.save,
                                        loading:saveLoding,
                                        style:{
                                            marginLeft:action ? 10 : 0
                                        }
                                    }])
                                }
                            </div>
                        }
                        title={<span><label className="tab-breadcrumb">合作方的纳税申报-纳税申报表 / </label>{tab}</span>}
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
