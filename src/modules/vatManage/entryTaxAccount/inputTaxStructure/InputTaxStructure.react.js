/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 10:48
 * description  :
 */
import React,{Component} from 'react'
import {Layout,Card,Row,Col,Form,Button,message} from 'antd'
import {getFields,request} from '../../../../utils'
import TableTaxStructure from './TableTaxStructure.react'
class InputTaxStructure extends Component {
    state={
        /**
         * params条件，给table用的
         * */
        filters:{
            pageSize:20
        },

        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),
        visible:false,
    }
    handleSubmit = (e,type) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    ...values,
                    authMonth: values.authMonth && values.authMonth.format('YYYY-MM')
                }
                let url= null;
                if(type==='提交'){
                    url = `/account/income/taxstructure/submit/${data.mainId}/${data.authMonth}`;
                    this.requestPost(url,type);
                }else if(type === '撤回') {
                    url = `/account/income/taxstructure/restore/${data.mainId}/${data.authMonth}`;
                    this.requestPost(url,type);
                }else if(type==='重算'){
                    url = '/account/income/taxstructure/reset';
                    this.fetch(url,data);
                }
                this.setState({
                    filters:data,
                },()=>{
                    this.refreshTable()
                });
            }
        });
    }
    requestPost=(url,type)=>{
        request.post(url)
            .then(({data})=>{
                if(data.code===200){
                    message.success(`${type}成功!`);
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    fetch=(url,params = {})=>{
        request.get(url,{
            params:{
                ...params
            }
        })
            .then(({data}) => {
                if(data.code===200){
                    message.success('重算成功!');
                }else{
                    message.error(`重算失败:${data.msg}`)
                }
            });
    }
    toggleModalVisible=visible=>{
        this.setState({
            visible
        })
    }
    refreshTable=()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    render(){
        return(
            <Layout style={{background:'transparent'}} >
                <Card
                    style={{
                        borderTop:'none'
                    }}
                    className="search-card"
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            {
                                getFields(this.props.form,[
                                    {
                                        label:'纳税主体',
                                        fieldName:'mainId',
                                        type:'taxMain',
                                        span:6,
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择纳税主体'
                                                }
                                            ]
                                        },
                                    },{
                                        label:'认证月份',
                                        fieldName:'authMonth',
                                        type:'monthPicker',
                                        span:6,
                                        componentProps:{
                                        },
                                        fieldDecoratorOptions:{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择认证月份'
                                                }
                                            ]
                                        },
                                    },
                                ])
                            }

                            <Col span={6}>
                                <Button style={{marginTop:3,marginLeft:20}} type="primary" onClick={(e)=>this.handleSubmit(e,'查询')}>查询</Button>
                                <Button style={{marginTop:3,marginLeft:10}} onClick={()=>this.props.form.resetFields()}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <TableTaxStructure
                        tableUpDateKey={this.state.tableUpDateKey}
                        filters={this.state.filters}
                        refreshTable={this.refreshTable}
                        handleRefer={(e)=>this.handleSubmit(e,'提交')}
                        handleWithdraw={(e)=>this.handleSubmit(e,'撤回')}
                        handleRecalculate={(e)=>this.handleSubmit(e,'重算')}
                    />
                </Card>
            </Layout>
        )
    }
}
export default Form.create()(InputTaxStructure)


