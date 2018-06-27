/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {message,Form} from 'antd'
import {request,fMoney,composeBotton} from 'utils'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import { NumericInputCell } from 'compoments/EditableCell'
import { withRouter } from 'react-router'
const getColumns = (getFieldDecorator,disabled) =>[
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
                    initialValue={text}
                    getFieldDecorator={getFieldDecorator}
                    editAble={disabled}
                    componentProps={{allowNegative:true}}
                /> : fMoney(parseFloat(text))
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
                request.post('/tax/credit/items/collection/save',{
                   ...values,
                    mainId:this.props.mainId,
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
                    columns:getColumns(getFieldDecorator,this.props.disabled),
                    url:`/tax/credit/items/collection/list/${props.mainId}`,
                    key:updateKey,
                    cardProps:{
                        bordered:false,
                        style:{marginTop:"0px"}
                    }
                }}
            />

        )
    }
}
export default Form.create()(withRouter(TabPage))