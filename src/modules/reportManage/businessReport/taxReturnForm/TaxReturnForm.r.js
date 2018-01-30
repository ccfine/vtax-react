/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import { Tabs } from 'antd';
import sheet_1 from './sheetData/sheet1'
import Sheet from './Sheet.r'
const TabPane = Tabs.TabPane;

const sheetData = [
    {
        tab:'附表一',
        grid:sheet_1,
        url:'s'
    },
    {
        tab:'附表一',
        grid:sheet_1,
        url:'s'
    }
]
class TaxReturnForm extends Component{
    state={
        activeKey:'0'
    }
    onChange = activeKey =>{
        this.setState({activeKey})
    }
    render () {
        const {activeKey} = this.state;
        return (
            <Tabs tabBarStyle={{marginBottom:0}} onChange={this.onChange} activeKey={activeKey} type="card">
                {
                    sheetData.map((item,i)=>(
                        <TabPane tab={item.tab} key={i}>
                            {
                                parseInt(activeKey,0) === i ? <Sheet grid={item.grid} url={item.url} /> : ''
                            }

                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}

export default TaxReturnForm

