/**
 * Created by liuliyuan on 2018/5/20.
 */
import React, { Component } from 'react'
import {message,Form} from 'antd'
import {request,fMoney,composeBotton} from 'utils'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import EditableCell from 'modules/vatManage/otherAccount/taxCalculation/EditableCell.r'
import { withRouter } from 'react-router'
const getColumns = getFieldDecorator =>[
    {
        title: '项目名称',
        dataIndex: 'name',
    },{
        title: '金额',
        dataIndex: 'amount',
        //render:text=>fMoney(text),
        className:'table-money',
        render:(text,record)=>{
            return record.amount ?
                <EditableCell fieldName={`amount_${record.id}`} renderValue={text} getFieldDecorator={getFieldDecorator}/> : fMoney(text)
        },
    }
];

class TabPage extends Component{
    state={
        updateKey:Date.now()
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now()
        })
    }
    cancel = e =>{
        e && e.preventDefault()
    }
    save = e =>{
        e && e.preventDefault()
        this.toggleSearchTableLoading(true)

        this.props.form.validateFields((err, values) => {
            if(!err){
                request.post('/account/taxCalculation/save',{
                    data:values,
                    mainId:this.state.filters.mainId,
                    authMonth:this.state.filters.authMonth
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
        const props = this.props;
        const {getFieldDecorator} = this.props.form;
        return(
            <SearchTable
                actionOption={{
                    body:(
                        <span>
                            {
                                composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    onClick:()=>this.save()
                                },{
                                    type:'save',
                                    text:'取消',
                                    icon:'logout',
                                    onClick:()=>this.cancel()
                                }])
                            }
                        </span>
                    )
                }}
                searchOption={null}
                tableOption={{
                    columns:getColumns(getFieldDecorator),
                    url:`/tax/credit/items/collection/list/${props.mainId}`,
                    key:this.state.updateKey,
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