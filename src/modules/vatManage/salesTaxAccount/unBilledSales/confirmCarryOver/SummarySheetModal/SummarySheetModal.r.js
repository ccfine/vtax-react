/**
 * Created by liurunbin on 2018/1/15.
 */
import React,{Component} from 'react';
import {Modal,Table,message} from 'antd';
import {request,fMoney} from '../../../../../../utils'
const columns = [
    {
        title:'计税方式',
        dataIndex:'taxMethod',
        className:'text-right',
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            text = parseInt(text,0);
            if(text===1){
                return '一般计税方法'
            }else if(text ===2){
                return '简易计税方法'
            }else{
                return ''
            }

        }
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
    },
    {
        title:'本期应申报的未开票发票销售额',
        dataIndex:'totalAmount',
        className:'text-right',
        render:text=>fMoney(text)
    },
    {
        title:'本期应申报的未开票发票销项税额',
        dataIndex:'taxAmount',
        className:'text-right',
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
    fetchData = month =>{
        request.get('/account/output/notInvoiceSale/sumList',{
            params:{
                month
            }
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataSource:data.data
                    })
                }else{
                    message.error(`汇总表数据获取失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && nextProps.month){
            this.fetchData(nextProps.month)
        }
        if(!nextProps.visible){
            this.setState({
                dataSource:[]
            })
        }
    }
    render(){
        const props = this.props;
        const {title} = this.props;
        const {dataSource} = this.state;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={600}
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