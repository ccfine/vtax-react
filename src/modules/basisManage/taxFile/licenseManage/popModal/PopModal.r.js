/**
 * Created by liurunbin on 2017/12/21.
 */
import React,{Component} from 'react';
import {Modal,Card} from 'antd';
import Tab1 from './tab_1';
import Tab2 from './tab_2';
import Tab3 from './tab_3';
import Tab4 from './tab_4';
import Tab5 from './tab_5';
import Tab10 from './tab_10';
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
}];

const contentList = {
    tab1: <Tab1 />,
    tab2: <Tab2 />,
    tab3: <Tab3 />,
    tab4: <Tab4 />,
    tab5: <Tab5 />,
};
class PopModal extends Component{
    state = {
        key: 'tab1',
        noTitleKey: 'article',
    }
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
    }
    render(){
        const props = this.props;
        return(
            <Modal
                title="查看"
                maskClosable={false}
                onCancel={()=>props.toggleModalVisible(false)}
                footer={false}
                width={1920}
                bodyStyle={{
                    padding:0
                }}
                style={{
                    maxWidth:'90%',
                    maxHeight:'90%'
                }}
                visible={props.visible}>
                <Card
                    style={{ width: '100%',border:'none' }}
                    tabList={tabList}
                    onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                >
                    {contentList[this.state.key]}
                </Card>
            </Modal>
        )
    }
}

export default PopModal