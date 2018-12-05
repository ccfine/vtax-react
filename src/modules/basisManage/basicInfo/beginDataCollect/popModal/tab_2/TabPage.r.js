/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {message,Form} from 'antd'
import {request,fMoney,composeBotton,parseJsonToParams} from 'utils'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import { NumericInputCell } from 'compoments/EditableCell'
import { withRouter } from 'react-router'
const getColumns = (context,getFieldDecorator,disabled) =>[
    {
        title: '项目名称',
        dataIndex: 'name',
    },{
        title: '金额',
        dataIndex: 'amount',
        className:'table-money',
        render:(text,record)=>{
            return !disabled ?
                <NumericInputCell
                    fieldName={`amount_${record.id}`}
                    initialValue={text==='0' ? '0.00' : fMoney(text)}
                    getFieldDecorator={getFieldDecorator}
                    editAble={disabled}
                    componentProps={{
                        allowNegative:true,
                        onFocus:(e)=>context.handleFocus(e,`amount_${record.id}`),
                        onBlur:(e)=>context.handleBlur(e,`amount_${record.id}`)
                    }}
                /> : text==='0' ? '0.00' : fMoney(text)
        },
    }
];

class TabPage extends Component{
    state={
        updateKey:Date.now(),
        searchTableLoading:false,
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }
    cancel = e =>{
        e && e.preventDefault()
        this.props.form.resetFields();
        this.refreshTable()
    }
    save = e =>{
        e && e.preventDefault()
        this.toggleSearchTableLoading(true)

        this.props.form.validateFields((err, values) => {
            if(!err){
                for(let key in values){
                    values[key] = values[key].replace(/\$\s?|(,*)/g, '')
                }
                request.post(`/tax/credit/items/collection/${this.props.beginType === '2' ? 'pc/' : ''}save`,{
                   ...values,
                    ...this.props.filters,
                })
                    .then(({data})=>{
                        this.toggleSearchTableLoading(false)
                        if(data.code===200){
                            message.success(`保存成功！`);
                            this.props.form.resetFields();
                            this.refreshTable();
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                    this.toggleSearchTableLoading(false)
                })
            }
        })
    }
    handleFocus = (e,fieldName) => {
        e && e.preventDefault()
        const {setFieldsValue,getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if(value === '0.00'){
            setFieldsValue({
                [fieldName]:''
            })
        }else{
            setFieldsValue({
                [fieldName]:value.replace(/\$\s?|(,*)/g, '')
            })
        }
    }

    handleBlur = (e,fieldName) => {
        e && e.preventDefault()
        const {setFieldsValue,getFieldValue} = this.props.form;
        let value = getFieldValue(fieldName);
        if(value !== ''){
            setFieldsValue({
                [fieldName]:fMoney(value)
            })
        }else{
            setFieldsValue({
                [fieldName]:'0.00'
            })
        }
    }
    componentWillReceiveProps(props){
        if(props.updateKey !== this.props.updateKey){
            this.setState({updateKey:props.updateKey});
        }
    }
    render(){
        const {updateKey,searchTableLoading} = this.state;
        const props = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <SearchTable
                spinning={searchTableLoading}
                actionOption={
                    !props.disabled ? {
                        body:(
                            <span>
                                {
                                    composeBotton([{
                                        type:'save',
                                        text:'保存',
                                        icon:'save',
                                        onClick:()=>this.save(),
                                        userPermissions:['1121003']
                                    },{
                                        type:'cancel',
                                        text:'取消',
                                        icon:'rollback',
                                        btnType:'default',
                                        onClick:()=>this.cancel(),
                                        userPermissions:['1121003']
                                    }])
                                }
                            </span>
                        )
                    } : null
                }
                searchOption={null}
                tableOption={{
                    pagination:false,
                    columns:getColumns(this,getFieldDecorator,props.disabled),
                    url:`/tax/credit/items/collection/${this.props.beginType === '2' ? 'pc/' : ''}list?${parseJsonToParams(props.filters)}`,
                    key:updateKey,
                    cardProps:{
                        bordered:false,
                        style:{
                            marginTop:10,
                            maxHeight:window.screen.availHeight-300,
                            overflowY:'auto',
                        }
                    },
                }}
            />

        )
    }
}
export default Form.create()(withRouter(TabPage))