/**
 * Created by liuliyuan on 2018/5/9.
 */

import intersection from 'lodash/intersection'; //取出各数组中全等的元素，使用SameValueZero方式平等比较。
//import difference from 'lodash/difference'; //只要array中比[values]中多出的值，都会返回，不管个数出现了几次

export default function checkPermissions(authorityInfo, options){
    if(authorityInfo && authorityInfo.length>0){
        //console.log(difference(this.props.options, item.authorityInfo).length > 0)
        return intersection(authorityInfo, options).length > 0
    }else{
        return null
    }
}
