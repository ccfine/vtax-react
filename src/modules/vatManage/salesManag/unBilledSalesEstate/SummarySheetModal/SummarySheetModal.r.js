/**
 * Created by liurunbin on 2018/1/15.
 */
import React,{Component} from 'react';
import {Modal,Table,message,Spin} from 'antd';
import {request,fMoney} from 'utils'
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

        },
        width:90,
    },
    {
        title:'税率',
        dataIndex:'taxRate',
        className:'text-right',
        render:text=>text? `${text}%`: text,
        width:50,
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
    },
    {
        title:'未开具发票销售额',
        dataIndex:'totalNoInvoiceSales',
        className:'text-right',
        render:text=>fMoney(text)
    },
];

class SummarySheetModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
        loading:false,
    }
    state={

    }
    mounted=true
    componentWillUnmount(){
        this.mounted=null
    }
    fetchData = params =>{
        this.setState({loading:true})
        request.get('/account/output/notInvoiceSale/realty/sumList',{
            params
        })
            .then(({data})=>{
                if(data.code===200){
                    this.setState({
                        dataSource:data.data
                    })
                }else{
                    message.error(`汇总表数据获取失败:${data.msg}`)
                }
                this.setState({loading:false})
            })
            .catch(err => {
                this.setState({loading:false})
                message.error(err.message)
            })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && nextProps.params){
            this.fetchData(nextProps.params)
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
        const {dataSource,loading} = this.state;
        return(
            <Modal
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                width={700}
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
                <Spin spinning={loading}>
                    <Table dataSource={dataSource} columns={columns} rowKey={(record)=>record.id}/>
                </Spin>
            </Modal>
        )
    }
}

export default SummarySheetModal