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
        searchFields:(params={},disabled,declare)=>[
            {
                label:'纳税主体',
                fieldName:'mainId',
                type:'taxMain',
                span:8,
                componentProps:{
                    disabled,
                },
                fieldDecoratorOptions:{
                    initialValue: (disabled && declare.mainId) || params.mainId,
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

                    initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || (params.taxMonth && moment(params.taxMonth)),
                    //initialValue: moment(getUrlParam('authMonth'), 'YYYY-MM') || undefined,
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
                for(let key in values){
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }
                    if(moment.isMoment(values[key])){
                        //格式化一下时间 YYYY-MM类型
                        if(moment(values[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                            values[key] = values[key].format('YYYY-MM');
                        }
                    }
                }
                this.setState({
                    params:{taxMonth:values.taxMonth,mainId:values.mainId},
                    updateKey:Date.now()
                })
                this.props.onParamsChange && this.props.onParamsChange(values);
            }
        })
    }
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                let url=''
                this.setState({saveLoding:true})
                request.put(url,{...values})
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
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
        const { tab, grid, url , searchFields, form, composeGrid,scroll,defaultParams,declare,action,saveUrl} = this.props;
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
                                getFields(form, searchFields(defaultParams,disabled,declare))
                            }
                            <Col style={{width:'100%',textAlign:'right'}}>
                                <Button size='small' style={{marginTop:5,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button size='small' style={{marginTop:5,marginLeft:10}} onClick={()=>{
                                    form.resetFields();
                                    this.setState({
                                        params:{}
                                    })
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
                                    onClick:this.save
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
