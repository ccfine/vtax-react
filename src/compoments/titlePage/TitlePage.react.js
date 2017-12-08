/**
 * author       : liuliyuan
 * createTime   : 2017/12/6 10:16
 * description  :
 */
import React from 'react';
import DocumentTitle from 'react-document-title'
const wrapPage = (title,Component) => props => <DocumentTitle title={`${title}`}>{<Component {...props}/>}</DocumentTitle>
export default wrapPage