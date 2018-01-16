/**
 * Created by liurunbin on 2018/1/15.
 */
import React,{Component} from 'react';
import {Modal,Table} from 'antd';
import {request,fMoney} from '../../../../../../utils'
const columns = [
    {
        title:'计税方式',
        dataIndex:'mainName'
    },
    {
        title:'税率',
        dataIndex:'purchaseTaxNum'
    },
    {
        title:'本期应申报的未开票发票销售额',
        dataIndex:'purchaseName',
        render:text=>fMoney(text)
    },
    {
        title:'本期应申报的未开票发票销项税额',
        dataIndex:'invoiceCode',
        render:text=>fMoney(text)
    }
];

class SummarySheetModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }
    state={

    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const props = this.props;
        const {title} = this.props;
        const dataSource = [];
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={1000}
                destroyOnClose={true}
                bodyStyle={{
                    backgroundColor:'#fafafa'
                }}
                style={{
                    maxWidth:'90%'
                }}
                footer={null}
                visible={props.visible}
                title={title}>
                <Table dataSource={dataSource} columns={columns} />
            </Modal>
        )
    }
}

export default SummarySheetModal