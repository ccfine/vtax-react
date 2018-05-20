/**
 * Created by liuliyuan on 2018/5/20.
 */
import React,{Component} from 'react'
import {message,Form} from 'antd'
import {request,fMoney,composeBotton} from 'utils'
import SearchTable from 'modules/basisManage/taxFile/licenseManage/popModal/SearchTableTansform.react'
import EditableCell from 'modules/vatManage/otherAccount/taxCalculation/EditableCell.r'
import { withRouter } from 'react-router'

const getColumns = getFieldDecorator => [
    {
        title:'项目',
        dataIndex:'projectName',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>

            </span>
        )
    },{
        title:'栏次',
        dataIndex:'projectName',
        render:text=>(
            <span dangerouslySetInnerHTML={{
                __html:text
            }}>

            </span>
        )
    }, {
        title:'一般项目',
        className:'table-money',
        children: [{
            title: '期初数',
            dataIndex: 'generalAmount',
            render:(text,record)=>{
                return record.generalAmountEdit ?
                    <EditableCell fieldName={`generalAmount_${record.id}`} renderValue={text} getFieldDecorator={getFieldDecorator}/> : fMoney(text)
            },
        }, {
            title: '本年累计',
            dataIndex: 'drawbackPolicyAmount',
            render:(text,record)=>{
                return record.drawbackPolicyAmountEdit ?
                    <EditableCell
                        fieldName={`drawbackPolicyAmount_${record.id}`}
                        renderValue={text} getFieldDecorator={getFieldDecorator} editAble={record.drawbackPolicyAmountEdit} />
                    : fMoney(text)
            },
        }],
    }, {
        title:'即征即退货物及劳务和应税服务',
        className:'table-money',
        children: [{
            title: '期初数',
            dataIndex: 'generalAmount',
            render:(text,record)=>{
                return record.generalAmountEdit ?
                    <EditableCell fieldName={`generalAmount_${record.id}`} renderValue={text} getFieldDecorator={getFieldDecorator}/> : fMoney(text)
            },
        }, {
            title: '本年累计',
            dataIndex: 'drawbackPolicyAmount',
            render:(text,record)=>{
                return record.drawbackPolicyAmountEdit ?
                    <EditableCell
                        fieldName={`drawbackPolicyAmount_${record.id}`}
                        renderValue={text} getFieldDecorator={getFieldDecorator} editAble={record.drawbackPolicyAmountEdit} />
                    : fMoney(text)
            },
        }],

    }
];
class TabPage extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{},
        //tableUrl:'/account/prepaytax/list',
        tableUrl:'/account/taxCalculation/list?authMonth=2018-01&mainId=950212281515552770&taxMonth=2018-01',
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
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.refreshTable()
        }
    }
    render(){
        const {searchTableLoading,tableKey,tableUrl} = this.state;
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
                    searchOption={undefined}
                    spinning={searchTableLoading}
                    tableOption={{
                        key:tableKey,
                        cardProps:{
                            bordered:false,
                            style:{marginTop:"0px"}
                        },
                        onRow:record=>({
                            onDoubleClick:()=>{console.log(record)}
                        }),
                        pagination:false,
                        columns:getColumns(getFieldDecorator),
                        url:tableUrl,
                    }}
                />
        )
    }
}
export default Form.create()(withRouter(TabPage))