/**
 * Created by liuliyuan on 2018/5/12.
 */
import React,{Component} from 'react';
import {Button,Modal,Form,Row,Col,Spin,message} from 'antd';
import {request,getFields} from 'utils'
class PopModal extends Component{
    static defaultProps={
        visible:true
    }
    state={
        loaded:false
    }

    toggleLoaded = loaded => this.setState({loaded})

    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                initData:{}
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible){
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            this.setState({
                loaded:true
            })
        }
    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.toggleLoaded(false)
                const props = this.props;
                const params = {
                    ...props.searchFieldsValues,
                    ...values,
                    mainIds:props.selectedRowKeys
                }
                request.put('/account/incomeSimpleOut/controller/commonlyFlag',params)
                    .then(({data})=>{
                        this.toggleLoaded(true)
                        if(data.code===200){
                            const props = this.props;
                            message.success('标记类型成功!');
                            props.hideModal();
                            props.refreshTable()
                        }else{
                            message.error(`标记类型失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.toggleLoaded(true)
                    })

            }
        });

    }

    render(){
        const props = this.props;
        const {loaded} = this.state;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.hideModal()}
                width={400}
                style={{
                    maxWidth:'90%'
                }}
                visible={props.visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button type="primary" loading={!loaded} onClick={this.handleSubmit}>确定</Button>
                            <Button onClick={()=>props.hideModal()}>取消</Button>
                        </Col>
                    </Row>
                }
                title='标记类型'>
                <Spin spinning={!loaded}>
                    <Form>
                        <Row>
                            {
                                getFields(props.form,[
                                    {
                                        label:'简易计税标记',
                                        fieldName:'commonlyFlag',
                                        type:'select',
                                        notShowAll:true,
                                        span:'24',
                                        options:[  //简易计税标记：一般计税标记为简易计税（1标记，0不标记） ,
                                            {
                                                text:'标记',
                                                value:'1'
                                            },{
                                                text:'不标记',
                                                value:'0'
                                            }
                                        ],
                                    }
                                ])
                            }
                        </Row>
                    </Form>
                </Spin>

            </Modal>
        )
    }
}

export default Form.create()(PopModal)
