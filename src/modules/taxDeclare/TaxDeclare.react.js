/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:13
 * description  :
 */
import React, { Component } from 'react'
import {Layout,Tabs} from 'antd'
import {CountTable} from '../../compoments'

const TabPane = Tabs.TabPane;

class TaxDeclare extends Component {

    callback=(key)=>{
        console.log(key);
    }

    componentWillMount() {

    }

    componentDidMount(){

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps){

    }

    render() {

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            fixed: 'left',
            filters: [{
                text: 'Joe',
                value: 'Joe',
            }, {
                text: 'John',
                value: 'John',
            }],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        }, {
            title: 'Other',
            children: [{
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: 200,
                sorter: (a, b) => a.age - b.age,
            }, {
                title: 'Address',
                children: [{
                    title: 'Street',
                    dataIndex: 'street',
                    key: 'street',
                    width: 200,
                }, {
                    title: 'Block',
                    children: [{
                        title: 'Building',
                        dataIndex: 'building',
                        key: 'building',
                        width: 100,
                    }, {
                        title: 'Door No.',
                        dataIndex: 'number',
                        key: 'number',
                        width: 100,
                    }],
                }],
            }],
        }, {
            title: 'Company',
            children: [{
                title: 'Company Address',
                dataIndex: 'companyAddress',
                key: 'companyAddress',
            }, {
                title: 'Company Name',
                dataIndex: 'companyName',
                key: 'companyName',
            }],
        }, {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 60,
            fixed: 'right',
        }];

        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                name: 'John Brown',
                age: i + 1,
                street: 'Lake Park',
                building: 'C',
                number: 2035,
                companyAddress: 'Lake Street 42',
                companyName: 'SoftLake Co',
                gender: 'M',
            });
        }

        const footerDate = [{
            key: 'total',
            name: 'total',
            age: null,
            street: null,
            building: null,
            number: 2035,
            companyAddress: null,
            companyName: null,
            gender: null,
        },{
            key: 'price',
            name: 'price',
            age: null,
            street: null,
            building: null,
            number: 2035,
            companyAddress: null,
            companyName: null,
            gender: null,
        }];


        const setting = {
            columns:columns,
            bordered:false,
            dataSource:data,
            scroll:{x: '130%', y: 240}
        }
        const setting2 = {
            columns:columns,
            bordered:false,
            showHeader:false,
            pagination:false,
            dataSource:footerDate,
            scroll:{x: '130%', y: 240}
        }

        return (
            <Layout style={{background:'transparent'}} >
                <div style={{ padding: 24}}>

                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="Tab 1" key="1">
                            <CountTable
                                id='table1'
                                setting={setting}
                                setting2={setting2}
                            />
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            <CountTable
                                id='table2'
                                setting={setting}
                                setting2={setting2}
                            />
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            <CountTable
                                id='table3'
                                setting={setting}
                                setting2={setting2}
                            />
                        </TabPane>
                    </Tabs>

                </div>
            </Layout>
        )
    }
}
export default TaxDeclare