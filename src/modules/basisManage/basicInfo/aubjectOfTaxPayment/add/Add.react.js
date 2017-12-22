/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:05
 * description  :
 */
import React, { Component } from 'react'
import {Modal,Tabs,Form} from 'antd'
import BasicInfo from './BasicInfo.react'
import TaxIdentification from './TaxIdentification.react'
import Shareholding from './Shareholding.react'
import EquityRelation from './EquityRelation.react'

const TabPane = Tabs.TabPane;
class Add extends Component {

    state = {
        modalKey:Date.now()+'1',
        submitLoading:false,
    }

    static defaultProps={
        modalType:'create'
    }

    callback = (key) => {
        //console.log(key);
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
        const {modalType,visible, form, defaultDate} = this.props;
        return (
                <div>
                    <Modal
                        key={this.state.modalKey}
                        title={modalType ==='create' ? '添加' : '修改' }
                        maskClosable={false}
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        confirmLoading={this.state.submitLoading}
                        okText="确定"
                        cancelText="取消"
                        width="900px"
                    >
                        <Form onSubmit={this.handleSubmit} className="vtax-from">

                            <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="基本信息" key="1">
                                    <BasicInfo
                                        form={form}
                                        defaultDate={defaultDate}
                                    />
                                </TabPane>
                                <TabPane tab="税种鉴定" key="2">
                                    <TaxIdentification form={form} />
                                </TabPane>
                                <TabPane tab="股东持股" key="3">
                                    <Shareholding form={form} />
                                </TabPane>
                                <TabPane tab="股权关系" key="4">
                                    <EquityRelation form={form} />
                                </TabPane>
                            </Tabs>

                        </Form>
                    </Modal>
                </div>
        )
    }
}
export default  Form.create()(Add)