/**
 * author       : liuliyuan
 * createTime   : 2017/12/15 18:04
 * description  :
 */
import React from 'react'
import Children_Routes from './children/routes'

const PATH = `/web/taxDeclare`;

const TaxDeclare_Routes = [
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/createAMatter`,
        children:Children_Routes
    }
]

export default TaxDeclare_Routes