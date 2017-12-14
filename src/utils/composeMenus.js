/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 16:05
 * description  :
 */

export default function composeMenus(nodeList) {
    const arr = [];
    nodeList.forEach((node) => {
        const item = node;
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...composeMenus(item.children));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}