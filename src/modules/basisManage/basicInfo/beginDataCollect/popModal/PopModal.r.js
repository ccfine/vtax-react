/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react';
import {Form,Drawer} from 'antd';
import TabPage from './tabs.r'

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true,
    }

    state = {
        pageTabsKey:Date.now(),
    }
    refreshTable = ()=>{
        this.mounted && this.setState({
            tableKey:Date.now(),
            pageTabsKey:Date.now(),
        })
    }
    toggleModalVisible=visible=>{
        this.mounted && this.setState({
            visible
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && this.props.visible !== nextProps.visible){
            //传进来的是要求打开并且当前是关闭状态的时候，一打开就初始化
            this.refreshTable()
        }
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null
    }
    render(){
        const {pageTabsKey} = this.state;
        const {visible,modalConfig:{type,record}} = this.props;
        const params = {
            mainId:record && record.mainId,
            profitCenterId: (record && record.profitCenterId) || undefined,
        }
        let title='';
        let disabled = false;
        switch (type){
            case 'modify':
                title = '编辑';
                break;
            case 'look':
                title = '查看';
                disabled = true;
                break;
            default :
            //no default
        }
        return(
            <Drawer
                title={title}
                placement="top"
                //closable={false}
                visible={visible}
                width={'100%'}
                height={'100%'}
                onClose={()=>{
                    this.props.toggleModalVisible(false)
                    this.refreshTable();
                    disabled || this.props.refreshTable();
                }}
                maskClosable={false}
                destroyOnClose={true}
                style={{
                    height: 'calc(100% - 55px)',
                    minHeight: '100vh',

                }}
            >
                <TabPage key={pageTabsKey} filters={params} record={record} type={type} disabled={disabled} beginType={this.props.tab} />
            </Drawer>
        )
    }
}

export default Form.create()(PopModal)