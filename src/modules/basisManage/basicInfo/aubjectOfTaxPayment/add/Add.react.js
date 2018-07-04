/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:05
 * description  :
 */
import React, { Component } from 'react'
import {Modal,Tabs,Form,Button,Row,Col,message,Spin} from 'antd'
import BasicInfo from './BasicInfo.react'
import TaxIdentification from './TaxIdentification.react'
import Shareholding from './Shareholding.react'
import EquityRelation from './EquityRelation.react'
import {request} from 'utils'
const TabPane = Tabs.TabPane;

class Add extends Component {
    static defaultProps={
        modalConfig:{
            type:'edit',
        },
        visible:true
    }

    state = {
        modalKey:Date.now()+1,
        activeKey:'1',
        submitLoading:false,

        gdjcg:[],
        gqgx:[],
        jbxx:{},
        szjd: null,
        status:1,
        id:null,
    }

    onChange = (activeKey) => {
        this.setState({ activeKey });
        //this.props.setSelectedRowKeysAndselectedRows(null,{});
    }

    //给前台做展示
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
    setStatus = status=>{
        this.mounted && this.setState({
            status:status
        })
    }
    handleOk = (e) => {
        this.handleSubmit()
    }

    checkeGqgxId = (data)=>{
        return data.map((item)=>{
            return {
                ...item,
                id: (item.id.indexOf('t') > -1) ? null : item.id
            }
        })
    }

    checkeGdjcgId = (data)=> {
        return data.map((item) => {
            return {
                ...item,
                id: (item.id.indexOf('t') > -1) ? null : item.id
            }
        })
    }

    handleSubmit = (e) => {
        e && e && e.preventDefault();//编辑成功，关闭当前窗口,刷新父级组件
         this.props.form.validateFieldsAndScroll((err, values) => {
         if (!err) {
             if(values.jbxx.industry && values.jbxx.industry.label && values.jbxx.industry.key){
                 values.jbxx.industry = values.jbxx.industry.key
             }

             const type = this.props.modalConfig.type;
             const gdjcg = this.checkeGdjcgId(this.state.gdjcg);
             const gqgx = this.checkeGqgxId(this.state.gqgx);
             const szjd = type === 'add' ? {...values.szjd} : {...values.szjd,id:this.state.szjd.id,parentId:this.state.szjd.parentId}
             const data = {
                ...values,
                jbxx:{
                   ...values.jbxx,
                   status:this.state.status,
                   id:  type=== 'add' ? null : this.props.selectedRowKeys[0],
                   operatingProvince: values.jbxx.operatingProvince[0],
                   operatingCity:values.jbxx.operatingProvince[1],
                   operatingArea:values.jbxx.operatingProvince[2],
                   nationalTaxProvince:values.jbxx.nationalTaxProvince[0],
                   nationalTaxCity:values.jbxx.nationalTaxProvince[1],
                   nationalTaxArea:values.jbxx.nationalTaxProvince[2],

                   localTaxProvince:values.jbxx.localTaxProvince[0],
                   localTaxCity:values.jbxx.localTaxProvince[1],
                   localTaxArea:values.jbxx.localTaxProvince[2],
                   registrationDate:values.jbxx.registrationDate && values.jbxx.registrationDate.format('YYYY-MM-DD'),
                   openingDate:values.jbxx.openingDate && values.jbxx.openingDate.format('YYYY-MM-DD'),
                },
                gdjcg:gdjcg ,
                gqgx:gqgx,
                szjd:szjd,
             }

            //console.log(data);

            this.mounted && this.setState({
               submitLoading: true
            })
            if (type === 'add') {
               request.post('/taxsubject/save', data
               )
                   .then(({data}) => {
                       if (data.code === 200) {
                           message.success('新增成功！', 4)

                           //编辑成功，关闭当前窗口,刷新父级组件
                           this.props.toggleModalVisible(false);
                           this.props.updateTable();

                           this.mounted && this.setState({
                               submitLoading: false,
                               id:data.data,
                           })
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

                   request.put('/taxsubject/update', data
                   )
                       .then(({data}) => {

                           if (data.code === 200) {
                               message.success('编辑成功！', 4);
                               //编辑成功，关闭当前窗口,刷新父级组件
                               this.props.toggleModalVisible(false);
                               this.props.updateTable();
                               this.mounted && this.setState({
                                   submitLoading: false
                               })
                           } else {
                               message.error(data.msg, 4);
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
            }else{
                if(err.jbxx){
                    this.setState({ activeKey:'1' });
                }
            }
        })
    }
    /*handleDelete=()=>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                request.delete(`/taxsubject/delete/${this.props.selectedRowKeys[0]}`)
                    .then(({data})=>{
                        if(data.code===200){
                            message.success('删除成功!');
                            this.props.toggleModalVisible(false);
                            this.props.updateTable();
                        }else{
                            message.error(data.msg)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                    })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }*/

    handleSetStatus=(mes,status)=>{
        request.put(`/taxsubject/update/${(this.props.selectedRowKeys && this.props.selectedRowKeys[0]) || this.state.id}/${status}`
        )
            .then(({data}) => {
                if (data.code === 200) {
                    message.success(`${mes}成功！`, 4);
                    //编辑成功，关闭当前窗口,刷新父级组件
                    this.props.toggleModalVisible(false);
                    this.props.updateTable();
                } else {
                    message.error(data.msg, 4);
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
    fetch = (id)=> {
        this.setState({
            submitLoading: true
        })
        request.get(`/taxsubject/get/${id}`,{
        })
            .then(({data}) => {
                if(data.code===200){
                    this.setState({
                        gdjcg:[...data.data.gdjcg],
                        gqgx:[...data.data.gqgx],
                        jbxx:{...data.data.jbxx},
                        szjd: data.data.szjd,
                        submitLoading: false
                    })
                }else{
                    message.error(data.msg, 4);
                    this.setState({
                        submitLoading: false
                    })
                }
            })
            .catch(err => {
                this.setState({
                    submitLoading: false
                })
                message.error(err.message)
            });
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    componentWillReceiveProps(nextProps){
        if(!nextProps.visible){
            /**
             * 关闭的时候清空表单
             * */
            nextProps.form.resetFields();
            this.setState({
                gdjcg:[],
                gqgx:[],
                jbxx:{},
                szjd: null,
                activeKey:'1',
            })
        }
        if(this.props.visible !== nextProps.visible && !this.props.visible && nextProps.modalConfig.type !== 'add'){

            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            if(nextProps.selectedRowKeys && nextProps.selectedRowKeys.length>0){
                this.fetch(nextProps.selectedRowKeys[0])
                this.setStatus(parseInt(nextProps.selectedRows[0].status, 0));
            }

        }

    }

    render() {
        const {modalConfig,visible,form,selectedRowKeys} = this.props;

        const {jbxx,szjd,gdjcg,gqgx} = this.state;

        let title='';
        const type = modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
                break;
            case 'edit':
                title = '编辑';
                break;
            case 'view':
                title = '查看';
                break;
            default :
                //no default
        }

        return (
            <div>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    onCancel={()=>this.props.toggleModalVisible(false)}
                    width={900}
                    style={{ top: '5%' }}
                    visible={visible}
                    footer={
                        <Row>
                            <Col span={12}></Col>

                            <Col span={12}>
                                {
                                    (type ==='add' || type ==='edit') && <span>
                                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                                        {/* {
                                            (type ==='edit') && parseInt(status,0) === 1 &&
                                            <Button type="danger" onClick={this.handleDelete}>删除</Button>
                                        } */}
                                        <Button onClick={()=>this.props.toggleModalVisible(false)}>取消</Button>
                                    </span>
                                }
                                {/* {
                                    type === 'view'  && <span>
                                        {
                                            parseInt(status,0) === 1
                                                ?
                                                <Button type="primary" onClick={()=>this.handleSetStatus('提交',2)}>提交</Button>
                                                :
                                                <Button type="primary" onClick={()=>this.handleSetStatus('撤销',1)}>撤销</Button>
                                        }
                                    </span>
                                } */}
                            </Col>
                        </Row>
                    }
                    title={title}
                >
                    <Spin spinning={this.state.submitLoading}>
                        <Form onSubmit={this.handleSubmit}>

                            <Tabs activeKey={this.state.activeKey} onChange={this.onChange}>
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
                                <TabPane tab="股东及持股" key="3">
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
                    </Spin>
                </Modal>
            </div>
        )
    }
}
export default  Form.create()(Add)