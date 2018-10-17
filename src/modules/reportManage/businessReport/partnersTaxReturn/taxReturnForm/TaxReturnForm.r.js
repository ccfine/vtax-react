/**
 * Created by liuliyuan on 2018/10/11.
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
/*
 import sheet_6 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet6'
 import sheet_7 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet7'*/
import {sheet_8,composeGrid_8} from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet8'

// import sheet_9 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet9'
import sheet_10 from 'modules/reportManage/businessReport/taxReturnForm/sheetData/sheet10'
import SheetWithSearchFields from '../taxReturnForm/SheetWithSearchFields.r'
const TabPane = Tabs.TabPane;

const sheetData = [
    {
        tab:'主表',
        grid:sheet_0,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
        action:true,
        scroll:{
            x:'100%',
            y:window.screen.availHeight-350,
        }
    }, {
        tab:'附表一',
        grid:sheet_1,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
        scroll:{
            x:1800,
            y:window.screen.availHeight-320,
        }
    }, {
        tab:'附表二',
        grid:sheet_2,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
        scroll:{
            //x:1800,
            y:window.screen.availHeight-320,
        }
    }, {
        tab:'附表三',
        grid:sheet_3,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
        scroll:{
            //x:1800,
            y:window.screen.availHeight-320,
        }
    }, {
        tab:'附表四',
        grid:sheet_4,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
    }, {
        tab:'附表五',
        grid:sheet_5,
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
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
        url:'/taxDeclarationReport/partner/find',
        saveUrl:'/taxDeclarationReport/partner/update',
    }, {
        tab:'增值税减免税申报明细表',
        grid:sheet_8,
        url:'/taxDeclarationReport/partner/find',
        composeGrid:composeGrid_8,
        saveUrl:'/taxDeclarationReport/partner/update',
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
            {declare,type,partnerId} = this.props;
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
                                        <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} declare={declare} type={type} reportType={i} partnerId={partnerId}/>
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

