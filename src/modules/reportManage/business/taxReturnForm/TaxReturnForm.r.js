/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import './sheet.css'
import { Tabs } from 'antd';
import sheet_0 from './sheetData/sheet0'
import sheet_1 from './sheetData/sheet1'
import sheet_2 from './sheetData/sheet2'
import sheet_3 from './sheetData/sheet3'
import sheet_4 from './sheetData/sheet4'
import sheet_5 from './sheetData/sheet5'
/*
import sheet_6 from './sheetData/sheet6'
import sheet_7 from './sheetData/sheet7'*/
import {sheet_8,composeGrid_8} from './sheetData/sheet8'

// import sheet_9 from './sheetData/sheet9'
import sheet_10 from './sheetData/sheet10'
import SheetWithSearchFields from './SheetWithSearchFields.r'
import TaxCalculation from './taxCalculation'
const TabPane = Tabs.TabPane;

const sheetData = [
    {
        tab:'主表',
        grid:sheet_0,
        url:'/tax/decConduct/main/list',
        action:true
    }, {
        tab:'附表一',
        grid:sheet_1,
        url:'/tax/declaration/addendum/one/list',
        scroll:{
            x:1800
        }
    }, {
        tab:'附表二',
        grid:sheet_2,
        url:'/tax/declaration/addendum/two/list',
    }, {
        tab:'附表三',
        grid:sheet_3,
        url:'/tax/declaration/addendum/three/list',
        saveUrl:'/tax/declaration/addendum/three/save',
    }, {
        tab:'附表四',
        grid:sheet_4,
        url:'/tax/declaration/addendum/four/list',
        //saveUrl:'/tax/declaration/addendum/four/save',
    }, {
        tab:'附表五',
        grid:sheet_5,
        url:'/tax/declaration/addendum/five/list',
        saveUrl:'/tax/declaration/addendum/five/save',
    /*}, {
        tab:'固定资产表',
        grid:sheet_6,
        url:'/tax/decConduct/fixedAssets/list'
    }, {
        tab:'进项结构明细',
        grid:sheet_7,
        url:'/tax/declaration/tax/structure/list'*/
    },{
        tab:'增值税预缴税款表',
        grid:sheet_10,
        url:'/tax/decConduct/prepayTax/list',
        saveUrl:'/tax/decConduct/prepayTax/save',
    }, {
        tab:'增值税减免税申报明细表',
        grid:sheet_8,
        url:'/tax/declaration/reduce/list',
        composeGrid:composeGrid_8
    },{
        tab:'税款计算表',
        Component:TaxCalculation,
    },
    // {
    //     tab:'营改增税负分析测算明细表',
    //     grid:sheet_9,
    //     url:'/tax/decConduct/camping/list',
    //     scroll:{
    //         x:'200%'
    //     }
    // }
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
        const {activeKey,params} = this.state,
            {declare} = this.props;
        return (
            <Tabs tabBarStyle={{marginBottom:0,backgroundColor:'#FFF'}} onChange={this.onChange} activeKey={activeKey}  type={'line'}>
                {
                    sheetData.map((item,i)=>(
                        <TabPane tab={item.tab} key={i}>
                            {
                                parseInt(activeKey,0) === i ? (
                                item.Component?<item.Component onParamsChange={this.onParamsChange} defaultParams={params}  declare={declare} title="法人公司纳税申报表"/>:
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

