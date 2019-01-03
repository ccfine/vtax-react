/**
 * Created by liurunbin on 2018/2/1.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Row, Col, Button,Card} from 'antd'
import {getFields,composeBotton,requestResultStatus} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'
import Sheet from 'modules/reportManage/business/taxReturnForm/Sheet.r'

const searchFields = (context,disabled,declare,defaultParams={},reportType,isProjectNum) => (getFieldValue) => {
    const arr = [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:8,
            componentProps:{
                labelInValue:true,
                disabled,
                onSelect: (value) => {
                    if (context.props.reportType === 6) {
                        context.props.fetchTaxSubjectConfig(value.key)
                    }
                }
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
            span:8,
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
    if (isProjectNum && reportType === 6) {
        arr.push({
            label:'项目',
            fieldName:'projectNum',
            span:8,
            type:'asyncSelect',
            componentProps:{
                disabled: false,
                fieldTextName:'itemName',
                fieldValueName:'itemNum',
                // doNotFetchDidMount: !declare,
                fetchAble:getFieldValue('main') || getFieldValue('main') || false,
                url: `/project/list/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
            },
            fieldDecoratorOptions:{
                initialValue: (!!declare && declare.projectNum) || (JSON.stringify(defaultParams) !== "{}" && defaultParams.projectNum) || ''
            }
        })
    }
    return arr;
}

class SheetWithSearchFields extends Component{
    static propTypes={
        tab:PropTypes.string,
        grid:PropTypes.array,
        url:PropTypes.string,
        composeGrid:PropTypes.func,
    }
    static defaultProps = {
        grid:[],
    }
    state={
        params:{},
        updateKey:Date.now(),
        /**
         *修改状态和时间
         * */
        statusParam:'',
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        },()=>{
            this.fetchResultStatus()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/taxDeclarationReport/merge/listMain',{...this.state.params,authMonth:this.state.params.taxMonth},result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const { declare, defaultParams, reportType } = this.props;
        if (this.props.reportType === 6) {
            this.props.fetchTaxSubjectConfig(!!declare ? declare.mainId : defaultParams.mainId)
        }
        if (!!declare) {
            this.mounted && this.setState({
                params:{
                    mainId:declare.mainId || undefined,
                    taxMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                    reportType
                }
            },()=>{
                this.refreshTable()
            });
        } else if(defaultParams.hasOwnProperty('mainId')) { // 解决从报表管理-业务报表页进入后，切换tab首次不请求接口
            this.mounted && this.setState({
                params:{
                    mainId:defaultParams.mainId || undefined,
                    taxMonth:moment(defaultParams.taxMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                    reportType
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
                values.taxMonth = values.taxMonth.format('YYYY-MM');
                if(values.main){
                    values.mainId = values.main.key
                    delete values.main
                }
                this.mounted && this.setState({
                    params: values,
                    updateKey:Date.now()
                })
                this.props.onParamsChange && this.props.onParamsChange(values); //{taxMonth:values.taxMonth,main:values.main}
            }
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { tab, grid, url , form, composeGrid,scroll,defaultParams,declare,action,reportType,isProjectNum} = this.props;
        let disabled = !!declare;
        const { params,updateKey,statusParam } = this.state;
        const readOnly = !(disabled && declare.decAction==='edit') || parseInt(statusParam.status,10)===2;
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
                                getFields(form, searchFields(this,disabled,declare,defaultParams,reportType,isProjectNum))
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
                                        url:'taxDeclarationReport/merge/export',
                                        params:{...params,authMonth:params.taxMonth},
                                        title:'导出',
                                        userPermissions:['2141007'],
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
                                    action ? (disabled && declare.decAction==='edit') && composeBotton([{
                                            type:'submit',
                                            url:'/taxDeclarationReport/merge/submit',
                                            params:params,
                                            userPermissions:['2141010'],
                                            onSuccess:this.refreshTable
                                        },{
                                            type:'revoke',
                                            url:'/taxDeclarationReport/merge/revoke',
                                            params:params,
                                            userPermissions:['2141011'],
                                            onSuccess:this.refreshTable,
                                        }],statusParam)
                                        : null
                                }
                            </div>
                        }
                        title={<span><label className="tab-breadcrumb">纳税申报合并计算表 / </label>{tab}</span>}
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
