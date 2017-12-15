/**
 * author       : liuliyuan
 * createTime   : 2017/12/7 17:42
 * description  :
 */
import React from 'react';
import {Link} from 'react-router-dom'
import { Breadcrumb} from 'antd';

const getBreadcrumb=(breadcrumbNameMap, url)=>{
    if (breadcrumbNameMap[url]) {
        return breadcrumbNameMap[url];
    }
    const urlWithoutSplash = url.replace(/\/$/, '');
    if (breadcrumbNameMap[urlWithoutSplash]) {
        return breadcrumbNameMap[urlWithoutSplash];
    }
    let breadcrumb = '';
    Object.keys(breadcrumbNameMap).forEach((item) => {
        const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
        const itemRegExp = new RegExp(itemRegExpStr);
        if (itemRegExp.test(url)) {
            breadcrumb = breadcrumbNameMap[item];
        }
    });
    return breadcrumb;
}

const getNodeList =(nodeList)=>{
    const arr = [];
    nodeList.forEach((item) => {
        if (item.to) {
            return null;
        }
        if (item.children) {
            arr.push({...item,children:null}, ...getNodeList(item.children));
        }else{
            arr.push(item);
        }
    });
    return arr;
}

const VTaxBreadCrumb = props =>  {
    const { location,routes} = props;
    const route = getNodeList(routes);
    const breadcrumbNameMap = [];

    if (location && location.pathname) {
        const pathSnippets = location.pathname.split('/').filter(i => i);

        route.forEach(item=>{
            breadcrumbNameMap[item.path] = item.name
        })

        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
            const isLinkable = (index !== pathSnippets.length - 1);

            return (
                <Breadcrumb.Item key={url}>
                    {
                        //这条判断是为了在当前位置的时候禁止再点击当前位置的面包屑
                        !isLinkable ? <span>{currentBreadcrumb}</span>  :  <Link to={url}>
                            {currentBreadcrumb}
                        </Link>
                    }
                </Breadcrumb.Item>
            );
        })
        const breadcrumbItems = [].concat(extraBreadcrumbItems);
        return (
            pathSnippets.length > 1 && <Breadcrumb style={{margin:'10px 24px 0'}}>
                {breadcrumbItems}
            </Breadcrumb>
        )

    }

}

export default VTaxBreadCrumb