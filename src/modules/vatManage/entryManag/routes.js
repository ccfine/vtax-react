/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import {wrapPage} from '../../../compoments'

const InvoiceCollection =()=><div>进项发票采集</div>
const InvoiceMatching =()=><div>进项发票匹配</div>


const PATH = `/web/vatManage/entryManag`;

const EntryManag_Routes = [
    {
        path:`${PATH}/invoiceCollection`,
        component:wrapPage('进项发票采集',InvoiceCollection),
        name:'进项发票采集',
        exact:true,
    },{
        path:`${PATH}/invoiceMatching`,
        component:wrapPage('进项发票匹配',InvoiceMatching),
        name:'进项发票匹配',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/invoiceCollection`,
    }
]

export default EntryManag_Routes