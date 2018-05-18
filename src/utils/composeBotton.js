/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 14:51:15 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-16 19:20:53
 */
import React from "react";
/*import ButtonWithPut from "../compoments/buttonWithPut";*/
import ButtonReset from 'compoments/buttonReset'
import SubmitOrRecall from "compoments/buttonModalWithForm/SubmitOrRecall.r";
import PermissibleRender from "compoments/permissible/PermissibleRender.r";
import {FileExport,FileImportModal} from 'compoments';
//1：暂存 2：提交
// 判断当前状态是否提交
const isDisabled = (statusParam = {})=> parseInt(statusParam.status, 0) === 2;

// 重算参数
const getResetOptions = (item, statusParam) => {
    // url,参数不存在，或是已经提交 重算不可用
    return {
        ...item,
        url:item.url,
        filters:item.item,
        disabled: isDisabled(statusParam),
        onSuccess: item.onSuccess,
        style: { marginRight: 5 }
    };
};

// 提交参数
const getSubmitOptions = (item, statusParam) => {
    return {
        ...item,
        url: item.url,
        disabled: isDisabled(statusParam),
        onSuccess: item.onSuccess,
        initialValue: item.params || item.initialValue,
        type: 1
    };
};

// 撤回参数
const getRevokeOptions = (item, statusParam) => {
    return {
        ...item,
        url: item.url,
        disabled: !isDisabled(statusParam),
        onSuccess: item.onSuccess,
        initialValue: item.params || item.initialValue,
        type: 2
    };
};

//文件导入
const getFileImportOptions = (item, statusParam)=>{
    return {
        title:"导入",
        url: item.url,
        disabled: isDisabled(statusParam),
        onSuccess: item.onSuccess,
        fields: item.fields,
        ...item,
        style:item.style || item.setButtonStyle|| {marginRight:5},
    };
}

//文件导出
const getFileExportOptions = (item)=>{
    return {
        disabled: false,
        title:"下载导入模板",
        url: item.url,
        onSuccess: item.onSuccess,
        ...item,
        setButtonStyle:item.style || item.setButtonStyle || {marginRight:5},
    };
};

//buttons 参数形式
// [{type:'re',url:'',params:'',buttonOptions,PermissibleRender}]
const composeBotton = (buttons = [], ...params) => {
    let buttonElements = buttons.map(item => {

        let paramsList = {
            key:item.key || item.type,
            userPermissions:item.userPermissions||[]
        }

        switch (item.type) {
            case "reset":
                return (
                    <PermissibleRender {...paramsList}>
                        <ButtonReset
                            {...getResetOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            case "submit":
                return (
                    <PermissibleRender {...paramsList}>
                        <SubmitOrRecall
                            type={1}
                            {...getSubmitOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            case "revoke":
                return (
                    <PermissibleRender {...paramsList}>
                        <SubmitOrRecall
                            type={2}
                            {...getRevokeOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            case 'fileImport':
                return (
                    <PermissibleRender {...paramsList}>
                        <FileImportModal {...getFileImportOptions(item, ...params)} />
                    </PermissibleRender>
                );
            case 'fileExport':
                return (
                    <PermissibleRender {...paramsList}>
                        <FileExport {...getFileExportOptions(item, ...params)} />
                    </PermissibleRender>
                );
            default:
                return null;
        }
    });

    return buttonElements;
};

export default composeBotton;
