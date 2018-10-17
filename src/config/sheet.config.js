/**
 * Created by liuliyuan on 2018/10/13.
 */

import sheet_0 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet0'
import sheet_1 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet1'
import sheet_2 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet2'
import sheet_3 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet3'
import sheet_4 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet4'
import sheet_5 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet5'
/*
 import sheet_6 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet6'
 import sheet_7 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet7'*/
import {sheet_8,composeGrid_8} from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet8'

// import sheet_9 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet9'
import sheet_10 from '../modules/reportManage/businessReport/taxReturnForm/sheetData/sheet10'
import TaxCalculation from '../modules/reportManage/businessReport/taxReturnForm/taxCalculation'

// 纳税申报表
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

export default sheetData;