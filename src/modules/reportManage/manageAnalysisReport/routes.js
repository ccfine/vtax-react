/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from 'compoments'
import strategies from 'config/routingAuthority.config'

const TaxStructureAnalysis =()=><div>纳税结构分析</div>
const TaxTrendsAnalysis =()=><div>纳税趋势分析</div>
const TaxAnalysis =()=><div>税负分析</div>

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/manageAnalysisReport`
const manageAnalysisReport = strategies['reportManage']['manageAnalysisReport'];

const OtherAccount_Routes = [
    {
        path:`${PATH}/taxStructureAnalysis`,
        component:wrapPage('纳税结构分析',TaxStructureAnalysis),
        name:'纳税结构分析',
        icon:{
            url:`${ICON_URL_PATH}taxStructureAnalysis.svg`,
            backgroundColor:'#57C6F4'
        },
        authorityInfo:manageAnalysisReport['taxStructureAnalysis'].options,
        exact:true,
    },{
        path:`${PATH}/taxTrendsAnalysis`,
        component:wrapPage('纳税趋势分析',TaxTrendsAnalysis),
        name:'纳税趋势分析',
        icon:{
            url:`${ICON_URL_PATH}taxTrendsAnalysis.svg`,
            backgroundColor:'#7ED530'
        },
        authorityInfo:manageAnalysisReport['taxTrendsAnalysis'].options,
        exact:true,
    },{
        path:`${PATH}/taxAnalysis`,
        component:wrapPage('税负分析',TaxAnalysis),
        name:'税负分析',
        icon:{
            url:`${ICON_URL_PATH}taxAnalysis.svg`,
            backgroundColor:'#FD6A60'
        },
        authorityInfo:manageAnalysisReport['taxAnalysis'].options,
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/taxStructureAnalysis`,
    }
]

export default OtherAccount_Routes