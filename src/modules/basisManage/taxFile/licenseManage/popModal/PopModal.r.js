/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Modal,Tabs} from 'antd';
import Tab1 from './tab_1';
import Tab2 from './tab_2';
import Tab3 from './tab_3';
import Tab4 from './tab_4';
import Tab5 from './tab_5';
import Tab6 from './tab_6';
import Tab7 from './tab_7';
import Tab8 from './tab_8';
import Tab9 from './tab_9';
import Tab10 from './tab_10';
const TabPane = Tabs.TabPane;
const tabList = [{
    key: 'tab1',
    tab: '国有土地使用权出让合同'
}, {
    key: 'tab2',
    tab: '分期对应土地出让合同',
}, {
    key: 'tab3',
    tab: '项目立项批复',
}, {
    key: 'tab4',
    tab: '建设用地规划许可证',
}, {
    key: 'tab5',
    tab: '国有土地使用证',
}, {
    key: 'tab6',
    tab: '建设工程规划许可证',
}, {
    key: 'tab7',
    tab: '建设工程施工许可证',
}, {
    key: 'tab8',
    tab: '商品房预售许可证',
}, {
    key: 'tab9',
    tab: '竣工验收备案表',
}, {
    key: 'tab10',
    tab: '房屋所有权证',
}];

const getContent = (key,projectId,updateKey) => {
    const contentList = {
        tab1: <Tab1 projectId={projectId} updateKey={updateKey}/>,
        tab2: <Tab2 projectId={projectId} updateKey={updateKey}/>,
        tab3: <Tab3 projectId={projectId} updateKey={updateKey}/>,
        tab4: <Tab4 projectId={projectId} updateKey={updateKey} />,
        tab5: <Tab5 projectId={projectId} updateKey={updateKey} />,
        tab6: <Tab6 projectId={projectId} updateKey={updateKey} />,
        tab7: <Tab7 projectId={projectId} updateKey={updateKey} />,
        tab8: <Tab8 projectId={projectId}  updateKey={updateKey}/>,
        tab9: <Tab9 projectId={projectId}  updateKey={updateKey}/>,
        tab10: <Tab10 projectId={projectId} updateKey={updateKey} />,
    };
    return contentList[key]
}

class PopModal extends Component{
    state = {
        key: 'tab1',
        updateKey:Date.now()
    }
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
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
        return(
            <Modal
                title="查看"
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
                                getContent(ele.key, this.props.projectId, this.state.updateKey)
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