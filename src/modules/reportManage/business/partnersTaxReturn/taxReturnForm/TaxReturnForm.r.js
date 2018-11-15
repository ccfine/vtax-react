/**
 * Created by liuliyuan on 2018/10/11.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import 'modules/reportManage/business/taxReturnForm/sheet.css'
import { Tabs } from 'antd';
import sheet_0 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet0'
import sheet_1 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet1'
import sheet_2 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet2'
import sheet_3 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet3'
import sheet_4 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet4'
import sheet_5 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet5'
import {sheet_8,composeGrid_8} from 'modules/reportManage/business/taxReturnForm/sheetData/sheet8'
import sheet_10 from 'modules/reportManage/business/taxReturnForm/sheetData/sheet10'
import SheetWithSearchFields from '../taxReturnForm/SheetWithSearchFields.r'
const TabPane = Tabs.TabPane;

const url = '/taxDeclarationReport/partner/find',
    saveUrl='/taxDeclarationReport/partner/update';

const sheetData = [
    {
        tab:'主表',
        grid:sheet_0,
        url,
        saveUrl,
        action:true,
        scroll:{
            x:'100%',
            y:window.screen.availHeight-350,
        }
    }, {
        tab:'附表一',
        grid:sheet_1,
        url,
        saveUrl,
        scroll:{
            x:window.screen.availWidth > 1800 ? '100%' : 1800,
            y:window.screen.availHeight-350,
        }
    }, {
        tab:'附表二',
        grid:sheet_2,
        url,
        saveUrl,
        scroll:{
            //x:1800,
            y:window.screen.availHeight-320,
        }
    }, {
        tab:'附表三',
        grid:sheet_3,
        url,
        saveUrl,
        scroll:{
            //x:1800,
            y:window.screen.availHeight-320,
        }
    }, {
        tab:'附表四',
        grid:sheet_4,
        url,
        saveUrl,
    }, {
        tab:'附表五',
        grid:sheet_5,
        url,
        saveUrl,
    },{
        tab:'增值税预缴税款表',
        grid:sheet_10,
        url,
        saveUrl,
    }, {
        tab:'增值税减免税申报明细表',
        grid:sheet_8,
        url,
        saveUrl,
        composeGrid:composeGrid_8,
    },
]

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
            {declare,drawerConfig} = this.props;
        return (
            <React.Fragment>
                <Tabs tabBarStyle={{marginBottom:0,backgroundColor:'#FFF'}}
                      onChange={this.onChange}
                      activeKey={activeKey}
                      tabBarExtraContent={
                          <button aria-label="Close" className="ant-drawer-close" onClose={()=>this.props.togglesDrawerVisible(false)}>
                          </button>
                      }
                >
                    {
                        sheetData.map((item,i)=>(
                            <TabPane tab={item.tab} key={i}>
                                {
                                    parseInt(activeKey,0) === i ?
                                        <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} declare={declare} drawerConfig={drawerConfig} reportType={i} />
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

