/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 14:51:15 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-21 15:19:07
 */
import React from "react";
/*import ButtonWithPut from "../compoments/buttonWithPut";*/
import ButtonReset from 'compoments/buttonReset'
import SubmitOrRecall from "compoments/buttonModalWithForm/SubmitOrRecall.r";
import PermissibleRender from "compoments/permissible/PermissibleRender.r";
import ButtonMarkModal from 'compoments/buttonMarkModal'
import ButtonConsistent from 'compoments/buttonConsistent'
import {FileExport,FileImportModal} from 'compoments';
//1：暂存 2：提交
// 判断当前状态是否提交
const isDisabled = (statusParam = {})=> parseInt(statusParam.status, 0) === 2;
const formatJson = (param) => {
    if(("authMonth" in param)){
        param['taxMonth'] = param['authMonth'];
    }
    return param
}

//新增
const getConsistentOptions = (item, statusParam) => {
    if(("selectedRowKeys" in item)){
        return {
            ...item,
            disabled: isDisabled(statusParam) ? isDisabled(statusParam) : !item.selectedRowKeys.length>0,
            style: item.style || {marginRight:5},
        };
    }else{
        return {
            ...item,
            disabled: isDisabled(statusParam),
            style: item.style || {marginRight:5},
        };
    }
};

// 重算参数
const getResetOptions = (item, statusParam) => {
    // url,参数不存在，或是已经提交 重算不可用
    return {
        ...item,
        url:item.url,
        filters:formatJson(item.params),
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
        initialValue: formatJson(item.params) || item.initialValue,
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
        initialValue: formatJson(item.params) || item.initialValue,
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
        style:item.style || item.setButtonStyle || {marginRight:5},
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


//标记
const getMarkOptions = (item,statusParam) =>{

    /*if(isDisabled(statusParam)){
     item.formOptions.disabled = isDisabled(statusParam)
     }else{
     item.formOptions.disabled = !item.formOptions.selectedRowKeys.length>0
     }*/
    return {
        ...item,
        formOptions:{
            ...item.formOptions,
            disabled: isDisabled(statusParam) ? isDisabled(statusParam) : !item.formOptions.selectedRowKeys.length>0,
        },
        style:item.style || item.setButtonStyle || {marginRight:5},
    };
}

// 数据匹配参数
const getMatchOptions = (item,statusParam) =>{
    return {
        ...item,
        url:item.url,
        filters:formatJson(item.params),
        disabled: isDisabled(statusParam),
        onSuccess: item.onSuccess,
        text:'数据匹配',
        icon:'copy',
        style: { marginRight: 5 }
    };
}

//buttons 参数形式
// [{type:'re',url:'',params:'',buttonOptions,PermissibleRender}]
const composeBotton = (buttons = [], params) => {
    return buttons.map((item, i) => {
        let component = undefined;
        if(item.type === 'add' || item.type === 'save' || item.type ==='view' || item.type === 'cancel'){
            item.type = 'consistent'
        }
        switch (item.type) {
            case "consistent":
                component = (
                    <ButtonConsistent {...getConsistentOptions(item, params)} />
                );
                break;
            case "reset":
                component = (
                    <ButtonReset {...getResetOptions(item, params)} />
                );
                break;
            case "submit":
                component = (
                    <SubmitOrRecall
                        type={1}
                        {...getSubmitOptions(item, params)}
                    />
                );
                break;
            case "revoke":
                component = (
                    <SubmitOrRecall
                        type={2}
                        {...getRevokeOptions(item, params)}
                    />
                );
                break;
            case "fileImport":
                component = (
                    <FileImportModal
                        {...getFileImportOptions(item, params)}
                    />
                );
                break;
            case "fileExport":
                component = (
                    <FileExport {...getFileExportOptions(item, params)} />
                );
                break;
            case "mark":
                component = (
                    <ButtonMarkModal {...getMarkOptions(item, params)} />
                );
                break;
            case 'match':
                component = (
                    <ButtonReset {...getMatchOptions(item, params)} />
                );
                break;
            default:
                break;
        }
        return (
            component && (
                <PermissibleRender
                    key={i}
                    userPermissions={item.userPermissions || []}>
                    {component}
                </PermissibleRender>
            )
        );
    });
};

export default composeBotton;
