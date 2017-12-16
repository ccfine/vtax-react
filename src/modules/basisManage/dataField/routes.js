/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import {wrapPage} from '../../../compoments/index'

import DataDictionaryMaintain from './dataDictionaryMaintain'


const PATHS = '/web/basisManage/dataField';

const DataField_Routes = [
    {
        path:`${PATHS}/dataDictionaryMaintain`,
        component:wrapPage('数据字典维护',DataDictionaryMaintain),
        name:'数据字典维护',
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/dataDictionaryMaintain`,
    }
]

export default DataField_Routes