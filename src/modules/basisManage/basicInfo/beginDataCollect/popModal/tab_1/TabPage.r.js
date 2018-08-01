/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react'
import {message,Form} from 'antd'
import {request,fMoney,composeBotton} from 'utils'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import { NumericInputCell } from 'compoments/EditableCell'
import { withRouter } from 'react-router'

const getColumns = (context,getFieldDecorator,disabled)=> [
    {
        title:'项目',
        dataIndex:'project',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>
            </span>
        )
    },{
        title:'栏次',
        dataIndex:'item',
        className:'text-center',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>
            </span>
        )
    }, {
        title:'一般项目',
        className:'text-center',
        children: [{
            title: '期初数',
            dataIndex: 'commonInitial',
            className:'text-center',
            render:(text,record)=>{
                let __html = <span dangerouslySetInnerHTML={{  __html:text }}/>;
                if(disabled){
                    return record.commonInitialEdit ? fMoney(text) : __html
                }else{
                    return record.commonInitialEdit ?
                        <NumericInputCell
                            fieldName={`commonInitial_${record.id}`}
                            initialValue={text==='0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            editAble={disabled}
                            componentProps={{
                                allowNegative:true,
                                onFocus:(e)=>context.handleFocus(e,`commonInitial_${record.id}`),
                                onBlur:(e)=>context.handleBlur(e,`commonInitial_${record.id}`)
                            }}

                        /> : __html
                }

            },
        }, {
            title: '本年累计',
            dataIndex: 'commonCount',
            className:'text-center',
            render:(text,record)=>{
                let __html = <span dangerouslySetInnerHTML={{  __html:text }}/>;
                if(disabled){
                    return record.commonCountEdit ? fMoney(text) : __html
                }else {
                    return record.commonCountEdit ?
                        <NumericInputCell
                            fieldName={`commonCount_${record.id}`}
                            initialValue={text==='0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            disabled={disabled}
                            componentProps={{
                                allowNegative:true,
                                onFocus:(e)=>context.handleFocus(e,`commonCount_${record.id}`),
                                onBlur:(e)=>context.handleBlur(e,`commonCount_${record.id}`)
                            }}
                        /> : __html
                }
            },
        }],
    }, {
        title:'即征即退货物及劳务和应税服务',
        className:'text-center',
        children: [{
            title: '期初数',
            dataIndex: 'promptlyInitial',
            className:'text-center',
            render:(text,record)=>{
                let __html = <span dangerouslySetInnerHTML={{  __html:text }}/>;
                if(disabled){
                    return record.promptlyInitialEdit ? fMoney(text) : __html
                }else {
                    return record.promptlyInitialEdit ?
                        <NumericInputCell
                            fieldName={`promptlyInitial_${record.id}`}
                            initialValue={text==='0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            disabled={disabled}
                            componentProps={{
                                allowNegative:true,
                                onFocus:(e)=>context.handleFocus(e,`promptlyInitial_${record.id}`),
                                onBlur:(e)=>context.handleBlur(e,`promptlyInitial_${record.id}`)
                            }}
                        /> : __html
                }
            },
        }, {
            title: '本年累计',
            dataIndex: 'promptlyCount',
            className:'text-center',
            render:(text,record)=>{
                let __html = <span dangerouslySetInnerHTML={{  __html:text }}/>;
                if(disabled){
                    return record.promptlyCountEdit ? fMoney(text) : __html
                }else {
                    return record.promptlyCountEdit ?
                        <NumericInputCell
                            fieldName={`promptlyCount_${record.id}`}
                            initialValue={text==='0' ? '0.00' : fMoney(text)}
                            getFieldDecorator={getFieldDecorator}
                            disabled={disabled}
                            componentProps={{
                                allowNegative:true,
                                onFocus:(e)=>context.handleFocus(e,`promptlyCount_${record.id}`),
                                onBlur:(e)=>context.handleBlur(e,`promptlyCount_${record.id}`)
                            }}
                        /> : __html
                }
            },
        }],

    }
];
class TabPage extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    toggleSearchTableLoading = searchTableLoading =>{
        this.setState({
            searchTableLoading
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
                request.post('/mainProjectCollection/save',values)
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

    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey} = this.state;
        const {getFieldDecorator} = this.props.form;
        return(
                <SearchTable
                    actionOption={
                        !this.props.disabled ? {
                            body:(
                                <span>
                                {
                                    composeBotton([{
                                        type:'save',
                                        text:'保存',
                                        icon:'save',
                                        userPermissions:['1121003'],
                                        onClick:()=>this.save()
                                    },{
                                        type:'cancel',
                                        text:'取消',
                                        icon:'rollback',
                                        btnType:'default',
                                        userPermissions:['1121003'],
                                        onClick:()=>this.cancel()
                                    }])
                                }
                            </span>
                            )
                        } : null
                    }
                    searchOption={undefined}
                    spinning={searchTableLoading}
                    tableOption={{
                        key:tableKey,
                        cardProps:{
                            bordered:false,
                            style:{
                                marginTop:0,
                                maxHeight:400,
                                overflowY:'auto',
                            }
                        },
                        onRow:record=>({
                            onDoubleClick:()=>{console.log(record)}
                        }),
                        pagination:false,
                        columns:getColumns(this,getFieldDecorator,this.props.disabled),
                        url:`/mainProjectCollection/list/${this.props.mainId}`,
                    }}
                />
        )
    }
}
export default Form.create()(withRouter(TabPage))