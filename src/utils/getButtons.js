/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-16 14:51:15 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-16 17:17:09
 */
import React from "react";
import ButtonWithPut from "../compoments/buttonWithPut";
import SubmitOrRecall from "compoments/buttonModalWithForm/SubmitOrRecall.r";
import PermissibleRender from "compoments/permissible/PermissibleRender.r";
//1：暂存 2：提交
// 判断当前状态是否提交
const isSubmit = (statusParam = {}) => {
    return parseInt(statusParam.status, 10) === 2;
};

// 判断参数数据是否存在
const hasParams = (params = {}) => {
    let hasMainId = false,
        hasMonth = false;
    for (let index in params) {
        if (/^mainId$/i.test(index) && params[index]) {
            hasMainId = true;
        } else if (/month/i.test(index) && params[index]) {
            hasMonth = true;
        }
    }

    return hasMainId && hasMonth;
};

// 重算参数
const getRecaculateOptions = (item, statusParam) => {
    // url,参数不存在，或是已经提交 重算不可用
    let res = { ...item, type: undefined };
    res.buttonOptions = res.buttonOptions || {};
    res.buttonOptions.disabled = true;
    res.buttonOptions.style = { marginRight: 5 };
    if (
        res.url &&
        res.params &&
        hasParams(res.params) &&
        !isSubmit(statusParam)
    ) {
        res.buttonOptions.disabled = false;
    }
    return res;
};

// 提交参数
const getSubmitOptions = (item, statusParam) => {
    let res = {
        ...item,
        url: item.url,
        disabled: true,
        onSuccess: item.onSuccess,
        initialValue: item.params || item.initialValue,
        type: 1
    };
    if (
        res.url &&
        res.initialValue &&
        hasParams(res.initialValue) &&
        !isSubmit(statusParam)
    ) {
        res.disabled = false;
    }
    return res;
};

// 撤回参数
const getRecallOptions = (item, statusParam) => {
    let res = {
        ...item,
        url: item.url,
        disabled: true,
        onSuccess: item.onSuccess,
        initialValue: item.params || item.initialValue,
        type: 2
    };
    if (
        res.url &&
        res.initialValue &&
        hasParams(res.initialValue) &&
        isSubmit(statusParam)
    ) {
        res.disabled = false;
    }
    return res;
};

//buttons 参数形式
// [{type:'re',url:'',params:'',buttonOptions,PermissibleRender}]
const getButtons = (buttons = [], ...params) => {
    let buttonElements = buttons.map(item => {
        switch (item.type) {
            case "recaculate":
                return (
                    <PermissibleRender key={item.type} userPermissions={item.userPermissions||[]}>
                        <ButtonWithPut
                            {...getRecaculateOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            case "submit":
                return (
                    <PermissibleRender key={item.type} userPermissions={item.userPermissions||[]}>
                        <SubmitOrRecall
                            type={1}
                            {...getSubmitOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            case "recall":
                return (
                    <PermissibleRender key={item.type} userPermissions={item.userPermissions||[]}>
                        <SubmitOrRecall
                            type={2}
                            {...getRecallOptions(item, ...params)}
                        />
                    </PermissibleRender>
                );
            default:
                return "";
        }
    });

    return buttonElements;
};

export default getButtons;
