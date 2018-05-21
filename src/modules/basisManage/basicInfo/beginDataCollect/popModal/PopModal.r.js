/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react';
import {Modal,Tabs} from 'antd';
import Tab1 from './tab_1';
import Tab2 from './tab_2';
import Tab3 from './tab_3';
import Tab4 from './tab_4';

const TabPane = Tabs.TabPane;
const tabList = [{
    key: 'tab1',
    tab: '其他项目期初数据'
}, {
    key: 'tab2',
    tab: '税额抵减项目期初数据',
}, {
    key: 'tab3',
    tab: '减税项目期初数据',
}, {
    key: 'tab4',
    tab: '其他应税项目扣除（不含土地价款扣除）期初数据',
}];

const getContent = (key,mainId,disabled,updateKey) => {
    const contentList = {
        tab1: <Tab1 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab2: <Tab2 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab3: <Tab3 mainId={mainId} disabled={disabled} updateKey={updateKey}/>,
        tab4: <Tab4 mainId={mainId} disabled={disabled} updateKey={updateKey} />,
    };
    return contentList[key]
}

class PopModal extends Component{
    static defaultProps={
        type:'edit',
        visible:true
    }

    state = {
        key: 'tab1',
        updateKey:Date.now(),
        tabPosition: 'top',
    }
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    }
    handleSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                /*this.props.toggleModalVisible(false);
                this.props.refreshTable()*/
            }
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible && this.props.visible !== nextProps.visible){
            //传进来的是要求打开并且当前是关闭状态的时候，一打开就初始化
            this.setState({
                updateKey:Date.now()
            })
        }
    }
    render(){
        const props = this.props;
        let title='';
        let disabled = false;
        const type = props.modalConfig.type;
        switch (type){
            case 'add':
                title = '新增';
                break;
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
            <Modal
                title={title}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>props.toggleModalVisible(false)}
                footer={false}
                width={1920}
                bodyStyle={{
                    padding:0,
                    height:500,
                    overflowY:'auto'
                }}
                style={{
                    width:'90%',
                    maxWidth:'900px',
                    top:'5%'
                }}
                visible={props.visible}>
                    <Tabs tabPosition={this.state.tabPosition} size="small">
                        {
                            tabList.map(ele=>(
                                <TabPane tab={ele.tab} key={ele.key} forceRender={false} style={{marginRight:"0px"}}>
                                    {
                                        getContent(ele.key, this.props.modalConfig.mainId, disabled, this.state.updateKey)
                                    }
                                </TabPane>
                            ))
                        }
                    </Tabs>
            </Modal>
        )
    }
}

export default PopModal