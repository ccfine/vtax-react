/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments'
import InvoiceCollection from './invoiceCollection'
import InvoiceMatching from './invoiceMatching'

const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/vatManage/entryManag`;

const EntryManag_Routes = [
    {
        path:`${PATH}/invoiceCollection`,
        component:wrapPage('进项发票采集',InvoiceCollection),
        name:'进项发票采集',
        icon:{
            url:`${ICON_URL_PATH}invoiceCollection.svg`,
            backgroundColor:'#73CF2B'
        },
        exact:true,
    },{
        path:`${PATH}/invoiceMatching`,
        component:wrapPage('进项发票匹配',InvoiceMatching),
        name:'进项发票匹配',
        icon:{
            url:`${ICON_URL_PATH}invoiceMatching.svg`,
            backgroundColor:'#4DC1F0'
        },
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/invoiceCollection`,
    }
]

export default EntryManag_Routes