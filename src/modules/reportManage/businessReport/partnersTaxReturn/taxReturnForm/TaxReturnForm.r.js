/**
 * Created by liuliyuan on 2018/10/11.
 */
import React,{Component} from 'react'
import { Icon } from "antd";
import 'react-datasheet/lib/react-datasheet.css';
import './sheet.css'
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
        url:'/parnter/taxDeclarationReportPartner/list/0',
        action:true
    }, {
        tab:'附表一',
        grid:sheet_1,
        url:'/parnter/taxDeclarationReportPartner/list/1',
        scroll:{
            x:1800
        }
    }, {
        tab:'附表二',
        grid:sheet_2,
        url:'/parnter/taxDeclarationReportPartner/list/2',
    }, {
        tab:'附表三',
        grid:sheet_3,
        url:'/parnter/taxDeclarationReportPartner/list/3',
        saveUrl:'/tax/declaration/addendum/three/save',
    }, {
        tab:'附表四',
        grid:sheet_4,
        url:'/parnter/taxDeclarationReportPartner/list/4',
        //saveUrl:'/tax/declaration/addendum/four/save',
    }, {
        tab:'附表五',
        grid:sheet_5,
        url:'/parnter/taxDeclarationReportPartner/list/5',
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
        url:'/parnter/taxDeclarationReportPartner/list/6',
        saveUrl:'/tax/decConduct/prepayTax/save',
    }, {
        tab:'增值税减免税申报明细表',
        grid:sheet_8,
        url:'/parnter/taxDeclarationReportPartner/list/7',
        composeGrid:composeGrid_8
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
                                    parseInt(activeKey,0) === i ?
                                        <SheetWithSearchFields {...item} onParamsChange={this.onParamsChange} defaultParams={params} declare={declare} type={type}/>
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

