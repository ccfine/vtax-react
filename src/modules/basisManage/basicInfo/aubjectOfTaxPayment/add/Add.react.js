/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:05
 * description  :
 */
import React, { Component } from 'react'
import {Modal,Tabs,Form,Button,Row,Col,message} from 'antd'
import BasicInfo from './BasicInfo.react'
import TaxIdentification from './TaxIdentification.react'
import Shareholding from './Shareholding.react'
import EquityRelation from './EquityRelation.react'
import {request} from '../../../../../utils'
const TabPane = Tabs.TabPane;

class Add extends Component {
    static defaultProps={
        type:'edit',
        visible:true
    }

    state = {
        modalKey:Date.now()+1,
        submitLoading:false,

        gdjcg:[],
        gqgx:[],
        jbxx:{},
        szjd: null,

    }

    callback=(key)=>{
        //console.log(key);
        //this.props.setSelectedRowKeysAndselectedRows(null,{});
    }


    setGdjcgDate = gdjcg =>{
        this.mounted && this.setState({
            gdjcg
        })
    }

    //给其它组件传数据
    setGqgxDate=gqgx=>{
        this.mounted && this.setState({
            gqgx
        })
    }

    handleOk = (e) => {
        this.handleSubmit()
    }

    handleCancel = (e) => {
        this.props.changeVisable(false);
        this.props.refreshCurdTable();
    }

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            debugger
            const data = {
                ...values,
                jbxx:{
                    ...values.jbxx,
                    id:this.props.selectedRowKeys[0],
                    synergy:values.jbxx.synergy === true ? '1' : '0',
                    operatingProvince:values.jbxx.operatingProvince[0],
                    operatingCity:values.jbxx.operatingProvince[1],
                    operatingArea:values.jbxx.operatingProvince[2],

                    nationalTaxProvince:values.jbxx.nationalTaxProvince[0],
                    nationalTaxCity:values.jbxx.nationalTaxProvince[1],
                    nationalTaxArea:values.jbxx.nationalTaxProvince[2],

                    localTaxProvince:values.jbxx.localTaxProvince[0],
                    localTaxCity:values.jbxx.localTaxProvince[1],
                    localTaxArea:values.jbxx.localTaxProvince[2],
                    registrationDate:values.jbxx.registrationDate.format('YYYY-MM-DD'),
                    openingDate:values.jbxx.openingDate.format('YYYY-MM-DD'),
                },
                gdjcg:[...this.state.gdjcg],
                gqgx:[...this.state.gqgx],
            }
            console.log(data);
            debugger


            if (!err) {

                this.mounted && this.setState({
                    submitLoading: true
                })
                const type = this.props.modalConfig.type;
                if (type === 'add') {
                    request.post('/taxsubject/save', {
                        params: {...data}
                    })
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('新增成功！', 4)
                                //新增成功，关闭当前窗口,刷新父级组件
                                this.props.toggleModalVisible(false);
                                this.props.refreshCurdTable();
                            } else {
                                message.error(data.msg, 4)
                                this.mounted && this.setState({
                                    submitLoading: false
                                })
                            }
                        })
                        .catch(err => {
                            message.error(err.message)
                            this.mounted && this.setState({
                                submitLoading: false
                            })
                        })
                }

                if (type === 'edit') {
                    console.log(data);
                    debugger
                    request.put('/taxsubject/update', data
                    )
                        .then(({data}) => {
                            if (data.code === 200) {
                                message.success('编辑成功！', 4);

                                //编辑成功，关闭当前窗口,刷新父级组件
                                this.props.toggleModalVisible(false);
                                this.props.refreshCurdTable();

                            } else {
                                message.error(data.msg, 4)
                                this.mounted && this.setState({
                                    submitLoading: false
                                })
                            }
                        })
                        .catch(err => {
                            debugger
                            message.error(err.message)
                            this.mounted && this.setState({
                                submitLoading: false
                            })
                        })
                }
            }
        })
    }

    fetch = (id)=> {
        request.get(`/taxsubject/get/${id}`,{
        })
            .then(({data}) => {
                if(data.code===200){
                    this.setState({
                        gdjcg:[...data.data.gdjcg],
                        gqgx:[...data.data.gqgx],
                        jbxx:{...data.data.jbxx} || this.props.selectedRows[0],
                        szjd: data.data.szjd,
                    })
                }else{
                    message.error(data.msg, 4)
                }
            });
    }

    componentDidMount() {


    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.modalConfig.type !== '' && nextProps.modalConfig.type !== 'add' && nextProps.visible === true){
            if(nextProps.selectedRowKeys.length>0){
                this.fetch(nextProps.selectedRowKeys[0])
            }
        }
    }

    render() {
        const {modalConfig,visible,form,selectedRowKeys} = this.props;

        const {jbxx,szjd,gdjcg,gqgx} = this.state;

        let title='';
        let disibled = false;
        const type = modalConfig.type;
        switch (type){
            case 'add':
                title = '添加';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                disibled=true;
                break;
        }

        return (
            <div>
                <Modal
                    maskClosable={false}
                    onCancel={()=>this.props.toggleModalVisible(false)}
                    width={900}
                    visible={visible}
                    confirmLoading={this.state.submitLoading}
                    footer={
                        type !== 'view' && <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                                <Button onClick={()=>this.props.toggleModalVisible(false)}>取消</Button>
                            </Col>
                        </Row>
                    }
                    title={title}
                >
                    <Form onSubmit={this.handleSubmit} className="vtax-from">

                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="基本信息" key="1">
                                <BasicInfo
                                    form={form}
                                    type={type}
                                    visible={visible}
                                    defaultData={jbxx}
                                    selectedRowKeys={selectedRowKeys}
                                />
                            </TabPane>
                            <TabPane tab="税种鉴定" key="2" forceRender={true}>
                                <TaxIdentification
                                    form={form}
                                    type={type}
                                    defaultData={szjd}
                                    selectedRowKeys={selectedRowKeys}
                                />
                            </TabPane>
                            <TabPane tab="股东持股" key="3">
                                <Shareholding
                                    type={type}
                                    defaultData={gdjcg}
                                    selectedRowKeys={selectedRowKeys}
                                    setGdjcgDate={this.setGdjcgDate.bind(this)}
                                />
                            </TabPane>
                            <TabPane tab="股权关系" key="4">
                                <EquityRelation
                                    type={type}
                                    defaultData={gqgx}
                                    selectedRowKeys={selectedRowKeys}
                                    setGqgxDate={this.setGqgxDate.bind(this)}
                                />
                            </TabPane>
                        </Tabs>

                    </Form>
                </Modal>
            </div>
        )
    }
}
export default  Form.create()(Add)