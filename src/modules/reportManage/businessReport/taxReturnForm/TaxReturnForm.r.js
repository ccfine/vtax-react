/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import './sheet.css'
import { Tabs } from 'antd';
import SheetWithSearchFields from './SheetWithSearchFields.r'
import sheetData from 'config/sheet.config'

const TabPane = Tabs.TabPane;

class TaxReturnForm extends Component{
    state={
        activeKey:'0',
        params:{}
    }
    onChange = activeKey =>{
        this.setState({activeKey})
    }
    onParamsChange = values=>{
        this.setState({
            params:values
        })
    }
    render () {
        const {activeKey,params} = this.state,
            {declare} = this.props;
        return (
            <Tabs tabBarStyle={{marginBottom:0,backgroundColor:!!declare?'#FFF':'transparent'}} onChange={this.onChange} activeKey={activeKey}  type={!!declare?'line':"card"}>
                {
                    sheetData.map((item,i)=>(
                        <TabPane tab={item.tab} key={i}>
                            {
                                parseInt(activeKey,0) === i ? (
                                item.Component?<item.Component onParamsChange={this.onParamsChange} defaultParams={params}  declare={declare}/>:
                                <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} declare={declare}/>
                                )
                                 : ''
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}

export default TaxReturnForm

