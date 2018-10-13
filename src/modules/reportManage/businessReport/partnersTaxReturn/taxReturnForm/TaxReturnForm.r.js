/**
 * Created by liuliyuan on 2018/10/11.
 */
import React,{Component} from 'react'
import { Icon } from "antd";
import 'react-datasheet/lib/react-datasheet.css';
import './sheet.css'
import { Tabs } from 'antd';
import SheetWithSearchFields from './SheetWithSearchFields.r'
import sheetData from 'config/sheet.config'

const TabPane = Tabs.TabPane;

export default class TaxReturnForm extends Component{
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
            {declare,type} = this.props;
        return (
            <React.Fragment>
                <div style={{ margin: "0px 0 6px 6px" }}>
                    <span style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12,cursor: 'pointer'}}
                          onClick={() => {
                              this.props.history.goBack();
                          }}
                    >
                        <Icon type="left" /><span>返回</span>
                    </span>
                </div>
                <Tabs tabBarStyle={{marginBottom:0,backgroundColor:'#FFF'}} onChange={this.onChange} activeKey={activeKey}>
                    {
                        sheetData.map((item,i)=>(
                            <TabPane tab={item.tab} key={i}>
                                {
                                    parseInt(activeKey,0) === i ? (
                                        item.Component?<item.Component onParamsChange={this.onParamsChange} defaultParams={params}  declare={declare} type={type}/>:
                                            <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} declare={declare} type={type}/>
                                    )
                                        : ''
                                }
                            </TabPane>
                        ))
                    }
                </Tabs>
            </React.Fragment>
        )
    }
}

