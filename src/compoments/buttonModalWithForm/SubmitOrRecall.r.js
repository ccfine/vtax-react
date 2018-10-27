/**
 * Created by liurunbin on 2018/2/7.
 */
import React from 'react';
import moment from 'moment';
import ButtonModalWithForm from './index'

const SubmitOrRecall = props => {
    let {initialValue={}} = props,
    monthFieldName = props.monthFieldName || 'taxMonth';

    const fields = [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:20,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                disabled: initialValue['mainId'] ? true : false,
            },
            fieldDecoratorOptions:{
                initialValue: initialValue['mainId'] || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'查询期间',
            fieldName:monthFieldName,
            type:'monthPicker',
            componentProps:{
                format:'YYYY-MM',
                disabled: initialValue[monthFieldName] && moment(initialValue[monthFieldName]) ? true : false,
            },
            span:20,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            fieldDecoratorOptions:{
                initialValue:initialValue[monthFieldName] && moment(initialValue[monthFieldName]),
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            }
        }
    ]
    const submitOptions = {
        formOptions:{
            type:props.method || 'post',
            url:props.url,
            fields,
            children:props.children || null,
            disabled:props.disabled,
            onSuccess:props.onSuccess,
        },
        buttonOptions:{
            text:'审核',
            icon:'check'
        },
        modalOptions:{
            title:'审核'
        }
    };
    const recallOptions = {
        formOptions:{
            type:props.method || 'post',
            url:props.url,
            fields,
            disabled:props.disabled,
            onSuccess:props.onSuccess,
        },
        buttonOptions:{
            text:'撤回审核',
            icon:'rollback'
        },
        modalOptions:{
            title:'撤回审核'
        }
    }
    if(props.type===1){
        return (
            <ButtonModalWithForm {...submitOptions} style={{marginRight:5}} />
        )
    }else{
        return (
            <ButtonModalWithForm {...recallOptions} />
        )
    }
}
export default SubmitOrRecall;