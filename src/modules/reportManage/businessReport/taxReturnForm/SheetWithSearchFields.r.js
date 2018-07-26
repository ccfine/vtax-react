/**
 * Created by liurunbin on 2018/2/1.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
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
        searchFields:(defaultParams={},disabled,declare)=>[
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
                    initialValue: (disabled && {key:declare.mainId,label:declare.mainName})  || ((defaultParams.main && defaultParams.main.key && defaultParams.main) || undefined),
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
        this.setState({
            updateKey:Date.now()
        },()=>{
            this.fetchResultStatus()
        })
    }
    fetchResultStatus = ()=>{
        requestResultStatus('/tax/decConduct/main/listMain',{...this.state.params,authMonth:this.state.params.taxMonth},result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    componentDidMount(){
        const { declare } = this.props;
        if (!!declare) {
            this.setState({
                params:{
                    mainId:declare.mainId || undefined,
                    taxMonth:moment(declare.authMonth, 'YYYY-MM').format('YYYY-MM') || undefined,
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
                this.setState({
                    params:{taxMonth:values.taxMonth,mainId:values.main.key},
                    updateKey:Date.now()
                })
                this.props.onParamsChange && this.props.onParamsChange({taxMonth:values.taxMonth,main:values.main});
            }
        })
    }
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.taxMonth = values.taxMonth.format('YYYY-MM');
                this.setState({saveLoding:true})
                request.post(this.props.saveUrl,{...values})
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.onSubmit();
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({saveLoding:false})
                    })
            }
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { tab, grid, url , searchFields, form, composeGrid,scroll,defaultParams,declare,action,saveUrl,savePermission} = this.props;
        console.log(defaultParams);

        let disabled = !!declare;
        const { params,updateKey,statusParam,saveLoding } = this.state;
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
                                getFields(form, searchFields(defaultParams,disabled,declare))
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
                    extra={
                        <div>
                            {
                                listMainResultStatus(statusParam)
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
                                    userPermissions:savePermission,
                                    onClick:this.save,
                                    loading:saveLoding
                                }])
                            }
                        </div>
                    }
                    title={<span><label className="tab-breadcrumb">纳税申报表 / </label>{tab}</span>}
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
export default Form.create()(withRouter(connect(state=>({
    declare:state.user.get('declare')
}))(SheetWithSearchFields)))
