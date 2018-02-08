/**
 * Created by liurunbin on 2018/2/7.
 */
import React from 'react';
import ButtonModalWithForm from './index'
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
        fieldDecoratorOptions:{
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
        fieldName:'taxMonth',
        type:'monthPicker',
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
            rules:[
                {
                    required:true,
                    message:'请选查询期间'
                }
            ]
        }
    }
]

const SubmitOrRecall = props => {
    const submitOptions = {
        formOptions:{
            type:props.method || 'post',
            url:props.url,
            fields,
            onSuccess:props.onSuccess,
        },
        buttonOptions:{
            text:'提交',
            icon:'check'
        },
        modalOptions:{
            title:'提交'
        }
    };
    const recallOptions = {
        formOptions:{
            type:props.method || 'post',
            url:props.url,
            fields,
            onSuccess:props.onSuccess,
        },
        buttonOptions:{
            text:'撤回提交',
            icon:'rollback'
        },
        modalOptions:{
            title:'撤回提交'
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