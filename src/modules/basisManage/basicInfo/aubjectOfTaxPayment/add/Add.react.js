/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:05
 * description  :
 */
import React, { Component } from 'react'
import {Modal,Tabs,Form,Button,Row,Col} from 'antd'
import BasicInfo from './BasicInfo.react'
import TaxIdentification from './TaxIdentification.react'
import Shareholding from './Shareholding.react'
import EquityRelation from './EquityRelation.react'
import {remove} from '../../../../../utils'
const TabPane = Tabs.TabPane;

class Add extends Component {
    static defaultProps={
        type:'edit',
        visible:true
    }

    state = {
        modalKey:Date.now()+1,
        submitLoading:false,

        gdjcg:[
            {
                lcapitalRemark: undefined,
                collectionCapitalAmount: undefined,
                collectionCapitalCurrency: undefined,
                id: 0,
                propertyRemark: undefined,
                realStockholder: "",
                registeredCapitalAmount: "",
                registeredCapitalCurrency: "",
                registeredStockholder: "",
                situation: undefined,
                stockRight: 1,
                stockholderType: "2",
                term: "",
            },{
                lcapitalRemark: undefined,
                collectionCapitalAmount: undefined,
                collectionCapitalCurrency: undefined,
                id: 1,
                propertyRemark: undefined,
                realStockholder: "",
                registeredCapitalAmount: "",
                registeredCapitalCurrency: "",
                registeredStockholder: "",
                situation: undefined,
                stockRight: 0,
                stockholderType: "2",
                term: "",
            },{
                lcapitalRemark: undefined,
                collectionCapitalAmount: undefined,
                collectionCapitalCurrency: undefined,
                id: 2,
                propertyRemark: undefined,
                realStockholder: "",
                registeredCapitalAmount: "",
                registeredCapitalCurrency: "",
                registeredStockholder: "",
                situation: undefined,
                stockRight: 0,
                stockholderType: "2",
                term: "",
            }
        ],
        gqgx:[
            {
                stockholderType: 0,
                stockholder: 'wwwww',
                stockRightRatio: undefined,
                id: 0,
                rightsRatio: undefined,
                remark: "",
            },{
                stockholderType: 1,
                stockholder: 'wwwww',
                stockRightRatio: undefined,
                id: 1,
                rightsRatio: undefined,
                remark: "",
            }
        ],
    }

    callback=(key)=>{
        console.log(key);
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
            /*if (!err) {
                console.log('Received values of form: ', values);
            }*/
        });
    }

    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        const {modalConfig,visible,form,initData,selectedRowKeys,selectedRows} = this.props;
        const {gdjcg,gqgx} = this.state;

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
                                        initData={initData}
                                        selectedRowKeys={selectedRowKeys}
                                        selectedRows={selectedRows}
                                    />
                                </TabPane>
                                <TabPane tab="税种鉴定" key="2">
                                    <TaxIdentification
                                        form={form}
                                        type={type}
                                    />
                                </TabPane>
                                <TabPane tab="股东持股" key="3">
                                    <Shareholding
                                        data={gdjcg}
                                        type={type}
                                        setGdjcgDate={this.setGdjcgDate.bind(this)}
                                    />
                                </TabPane>
                                <TabPane tab="股权关系" key="4">
                                    <EquityRelation
                                        data={gqgx}
                                        type={type}
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