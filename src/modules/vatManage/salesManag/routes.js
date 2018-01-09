/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'
import SalesInvoiceCollection from './salesInvoiceCollection'
import SalesInvoiceMatching from './salesInvoiceMatching'
const CampBeforeTheIncreaseInSales =()=><div>营改增前售房</div>
const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/salesManag`;

const SalesManag_Routes = [
    {
        path:`${PATH}/salesInvoiceCollection`,
        component:wrapPage('销项发票采集',SalesInvoiceCollection),
        name:'销项发票采集',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        exact:true,
    },{
        path:`${PATH}/salesInvoiceMatching`,
        component:wrapPage('销项发票匹配',SalesInvoiceMatching),
        name:'销项发票匹配',
        icon:{
            url:`${ICON_URL_PATH}salesInvoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        exact:true,
    },{
        path:`${PATH}/campBeforeTheIncreaseInSales`,
        component:wrapPage('营改增前售房',CampBeforeTheIncreaseInSales),
        name:'营改增前售房',
        icon:{
            url:`${ICON_URL_PATH}campBeforeTheIncreaseInSales.svg`,
            backgroundColor:'#FFBE06'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/salesInvoiceCollection`,
    }
]

export default SalesManag_Routes