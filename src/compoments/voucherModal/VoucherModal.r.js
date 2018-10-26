/**
 * Created by liuliyuan on 2018/10/26.
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal } from 'antd'
import {SearchTable} from 'compoments'

export default class VoucherModal extends Component{
    state={
        tableKey:Date.now(),
        totalSource:{},
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
            },200)
        }
    }
    render(){
        const {searchTableLoading,tableKey} = this.state;
        const { title,visible,fields,columns,toggleModalVoucherVisible,url,scroll } = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVoucherVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVoucherVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <div className='oneLine'>
                    <SearchTable
                        searchOption={{
                            fields:fields
                        }}
                        doNotFetchDidMount={true}
                        spinning={searchTableLoading}
                        tableOption={{
                            key:tableKey,
                            cardProps: {
                                title: "凭证信息列表",
                            },
                            pageSize:100,
                            columns:columns,
                            url:url,
                            scroll:scroll || { x: '140%',y:'250px'},
                        }}
                    />
                </div>
            </Modal>
        )
    }
}
