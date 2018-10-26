/**
 * Created by liuliyuan on 2018/10/23.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import 'modules/reportManage/businessReport/taxReturnForm/sheet.css'
import { Tabs } from 'antd';
import sheet_0 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet0'
import sheet_1 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet1'
import sheet_2 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet2'
import sheet_3 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet3'
import sheet_4 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet4'
import sheet_5 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet5'
import {sheet_8,composeGrid_8} from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet8'
import sheet_10 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet10'
import SheetWithSearchFields from './SheetWithSearchFields.r'
import TaxCalculation from './taxCalculation'
const TabPane = Tabs.TabPane;

const url = '/TaxDecConductPc/find',
    saveUrl='/TaxDecConductPc/update';

const sheetData = [
    {
        tab:'主表',
        grid:sheet_0,
        url,
        saveUrl,
        action:true
    }, {
        tab:'附表一',
        grid:sheet_1,
        url,
        scroll:{
            x:1800
        }
    }, {
        tab:'附表二',
        grid:sheet_2,
        url,
    }, {
        tab:'附表三',
        grid:sheet_3,
        url,
        saveUrl,
    }, {
        tab:'附表四',
        grid:sheet_4,
        url,
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
        composeGrid:composeGrid_8
    },{
        tab:'税款计算表',
        Component:TaxCalculation,
    },
]
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
        const {activeKey,params} = this.state;
        return (
            <Tabs tabBarStyle={{marginBottom:0,backgroundColor:'#FFF'}} onChange={this.onChange} activeKey={activeKey}  type={'line'}>
                {
                    sheetData.map((item,i)=>(
                        <TabPane tab={item.tab} key={i}>
                            {
                                parseInt(activeKey,0) === i ? (
                                item.Component?<item.Component onParamsChange={this.onParamsChange} defaultParams={params}  />:
                                <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} reportType={i} />
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

