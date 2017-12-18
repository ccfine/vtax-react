/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const TaxStructureAnalysis =()=><div>纳税结构分析</div>
const TaxTrendsAnalysis =()=><div>纳税趋势分析</div>
const TaxAnalysis =()=><div>税负分析</div>

const PATH = `/web/reportManage/manageAnalysisReport`;

const OtherAccount_Routes = [
    {
        path:`${PATH}/taxStructureAnalysis`,
        component:wrapPage('纳税结构分析',TaxStructureAnalysis),
        name:'纳税结构分析',
        exact:true,
    },{
        path:`${PATH}/taxTrendsAnalysis`,
        component:wrapPage('纳税趋势分析',TaxTrendsAnalysis),
        name:'纳税趋势分析',
        exact:true,
    },{
        path:`${PATH}/taxAnalysis`,
        component:wrapPage('税负分析',TaxAnalysis),
        name:'税负分析',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/taxStructureAnalysis`,
    }
]

export default OtherAccount_Routes