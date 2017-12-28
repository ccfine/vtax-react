/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'
import SalesInvoiceCollection from './salesInvoiceCollection'
const SalesInvoiceMatching =()=><div>销项发票匹配</div>
const CampBeforeTheIncreaseInSales =()=><div>营改增前售房</div>

const PATH = `/web/vatManage/salesManag`;

const SalesManag_Routes = [
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:wrapPage('销项发票采集',SalesInvoiceCollection),
        name:'销项发票采集',
        exact:true,
    },{
        path:`${PATH}/salesInvoiceMatching`,
        component:wrapPage('销项发票匹配',SalesInvoiceMatching),
        name:'销项发票匹配',
        exact:true,
    },{
        path:`${PATH}/campBeforeTheIncreaseInSales`,
        component:wrapPage('营改增前售房',CampBeforeTheIncreaseInSales),
        name:'营改增前售房',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/salesInvoiceCollection`,
    }
]

export default SalesManag_Routes