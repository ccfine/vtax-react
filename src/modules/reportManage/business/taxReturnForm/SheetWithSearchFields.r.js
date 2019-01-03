/**
 * Created by liurunbin on 2018/2/1.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Row, Col, Button,Card,message,notification } from 'antd'
import {getFields,listMainResultStatus,composeBotton,requestResultStatus,request} from 'utils'
import { withRouter } from 'react-router'
import moment from 'moment'
import Sheet from './Sheet.r'
import PopModal from './popModal.r'

const openNotificationWithIcon = (type,msg) => {
    notification[type]({
        placement: 'bottomRight',
        bottom: 50,
        duration: 0,
        message: '提示',
        description: msg,
    });
  };

const searchFields = (context,disabled,declare,defaultParams={},tabIndex,isProjectNum)=> (getFieldValue) => {
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
                    if (context.props.tabIndex === 6) {
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
    if (isProjectNum && tabIndex === 6) {
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
        action:PropTypes.bool,
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
        saveLoding:false,
        popModalVisible:false,
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            updateKey:Date.now()
        },()=>{
            this.fetchResultStatus()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/tax/decConduct/main/listMain',{...this.state.params,authMonth:this.state.params.taxMonth},result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const { declare, defaultParams } = this.props;
    
        if (this.props.tabIndex === 6) {
            this.props.fetchTaxSubjectConfig(!!declare ? declare.mainId : defaultParams.mainId)
        }
        if (!!declare) {
            this.mounted && this.setState({
                params:{
                    mainId:declare.mainId || undefined,
                    taxMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        } else if(defaultParams.hasOwnProperty('mainId') && defaultParams.hasOwnProperty('taxMonth')) { // 解决从报表管理-业务报表页进入后，切换tab首次不请求接口
            this.mounted && this.setState({
                params:{
                    mainId:defaultParams.mainId || undefined,
                    taxMonth:moment(defaultParams.taxMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
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
                values.taxMonth = values.taxMonth.format('YYYY-MM');
                if(values.main){
                    values.mainId = values.main.key
                    delete values.main
                }
                if (values.map) {
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
                if(values.main){
                    values.mainId = values.main.key
                    delete values.main
                }
                this.mounted && this.setState({saveLoding:true})
                request.post(this.props.saveUrl,{...values})
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
    handelGenerateTax=()=>{
        const { declare } = this.props;
        request.post('/tax/decConduct/main/create',{
            mainId:declare && declare.mainId,
            authMonth:declare && moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM'),
        })
        .then(({data})=>{
            this.mounted && this.setState({saveLoding:false})
            message.warning('系统正在生成法人公司纳税申报表，请稍候查询!');
            if(data.code===200){
                openNotificationWithIcon('success','生成纳税申报表成功!')
                //message.success('保存成功!');
                this.onSubmit();
            }else{
                openNotificationWithIcon('error',`生成纳税申报表失败:${data.msg}`)
                //message.error(`保存失败:${data.msg}`)
            }
        })
        .catch(err => {
            message.error(err.message)
            this.mounted && this.setState({saveLoding:false})
        })
    }
    
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    togglesPopModalVisible = (popModalVisible,isrefresh) => {
        this.setState({
            popModalVisible
        },()=>{
            if(isrefresh){
                this.refreshTable()
            }
        });
    };
    render(){
        const { tab, grid, url, form, composeGrid,scroll,defaultParams,declare,action,saveUrl,taxEdit,tabIndex,isProjectNum} = this.props;
        let disabled = !!declare;
        const { params,updateKey,statusParam,saveLoding,popModalVisible } = this.state;
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
                                getFields(form, searchFields(this,disabled,declare,defaultParams,tabIndex,isProjectNum))
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
                            {
                                action ? (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'consistent',
                                    text:'生成纳税申报表',
                                    userPermissions:['1915015'],
                                    onClick:()=>{
                                        this.handelGenerateTax();
                                    }
                                }], statusParam) : null
                            }
                            {
                                taxEdit ? (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'consistent',
                                    text:'本期实际抵减税额调整',
                                    onClick:()=>{
                                        this.togglesPopModalVisible(true);
                                    },
                                    userPermissions:['1911004'],
                                }]) : null
                            }
                            {
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
                            }
                            {
                                action ? (disabled && declare.decAction==='edit') && composeBotton([{
                                    type:'submit',
                                    url:'/tax/decConduct/main/submit',
                                    params:params,
                                    userPermissions:['1911010'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/tax/decConduct/main/revoke',
                                    params:params,
                                    userPermissions:['1911011'],
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                                : null
                            }
                            {
                                saveUrl && !readOnly && composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    userPermissions:['1911003'],
                                    onClick:this.save,
                                    loading:saveLoding
                                }])
                            }
                        </div>
                    }
                    title={<span><label className="tab-breadcrumb">法人公司纳税申报表 / </label>{tab}</span>}
                    bodyStyle={{
                        padding:10
                    }}
                >
                    <Sheet readOnly={readOnly} scroll={scroll} grid={grid} url={url} params={params} composeGrid={composeGrid} updateKey={updateKey} form={this.props.form}/>
                </Card>
                <PopModal
                    visible={popModalVisible}
                    title='本期实际抵减税额调整'
                    toggleModalVisible={this.togglesPopModalVisible}
                    declare={declare}
                />
            </div>
        

        </Form>
        )
    }
}
export default Form.create()(withRouter(SheetWithSearchFields))
