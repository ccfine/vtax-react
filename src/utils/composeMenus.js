/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 16:05
 * description  :
 */
export default function (routes) {
    return routes.map(item=>{
        if(item && !item.to && item.icon){
            return {
                name:item.name,
                icon:item.icon,
                path:item.path
            }
        }
        return null;
    }).filter(item=>item);
}