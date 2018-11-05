/**
 * Created by liurunbin on 2018/1/18.
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-24 18:29:09
 *
 */
import React,{Component} from 'react'
import {Form,message} from 'antd'
import {SearchTable,TableTotal} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
import moment from 'moment';
import { NumericInputCell } from 'compoments/EditableCell'
const searchFields =(disabled,declare)=> getFieldValue => {
    return [
        {
            label:'纳税主体',
            fieldName:'main',
            type:'taxMain',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                labelInValue:true,
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },
        {
            label:'纳税申报期',
            fieldName:'authMonth',
            type:'monthPicker',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税申报期'
                    }
                ]
            },
        },
        {
            label:'利润中心',
            fieldName:'profitCenterId',
            type:'asyncSelect',
            span:8,
            formItemStyle:{
                labelCol:{
                    span:8
                },
                wrapperCol:{
                    span:16
                }
            },
            componentProps:{
                fieldTextName:'profitName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
                url:`/taxsubject/profitCenterList/${getFieldValue('main') && getFieldValue('main').key}`,
            }
        }
    ]
}
const getColumns = (context,disabled) => {
    let lastStegesId2 = '',{dataSource} = context.state;
    let profitCenterList = [];
    dataSource.forEach((item, index) => {
        profitCenterList.includes(item.profitCenterId) ? profitCenterList.push(0) : profitCenterList.push(item.profitCenterId);
        return item;
    })
    return [
        {
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width:'150px',
            render: (text, row, index) => {
                let rowSpan = 0;
                if(profitCenterList[index] === row.profitCenterId){
                    rowSpan = dataSource.filter(ele=>ele.profitCenterId === row.profitCenterId).length;
                }
                return {
                    children: text,
                    props: {
                        rowSpan: rowSpan,
                    },
                };
            }
        },{
        title:'项目分期',
        dataIndex:'stagesName',
        width:'15%',
        render:(text, row, index) => {
            let rowSpan = 0;
            if(lastStegesId2 !== row.stagesId){
                lastStegesId2 = row.stagesId;
                rowSpan = dataSource.filter(ele=>ele.stagesId === row.stagesId).length;
            }
            return {
              children: text,
              props: {
                rowSpan: rowSpan,
              },
            };
          },
    },{
        title:'预征项目',
        dataIndex:'preProject',
        width:'20%',
    }, {
        title:'金额（不含税）',
        dataIndex:'withOutAmount',
        render:(text,record)=>{
            const {getFieldDecorator} = context.props.form;
            if(disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1 && record.preProject !=='销售不动产'){
                return <NumericInputCell
                        fieldName={`list[${record.id}].withOutAmount`}
                        initialValue={text==='0' ? '0.00' : fMoney(text)}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            onFocus:(e)=>context.handleFocus(e,`list[${record.id}].withOutAmount`),
                            onBlur:(e)=>context.handleBlur(e,`list[${record.id}].withOutAmount`),
                        }}
                    />
            }else{
                return fMoney(text)
            }
        },
        className:'table-money',
        width:'15%',
    }, {
        title:'金额（含税）',
        dataIndex:'withTaxAmount',
        render:(text,record)=>{
            const {getFieldDecorator} = context.props.form;
            if(disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1 && record.preProject !=='销售不动产'){
                return <NumericInputCell
                        fieldName={`list[${record.id}].withTaxAmount`}
                        initialValue={text==='0' ? '0.00' : fMoney(text)}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            onFocus:(e)=>context.handleFocus(e,`list[${record.id}].withTaxAmount`),
                            onBlur:(e)=>context.handleBlur(e,`list[${record.id}].withTaxAmount`)
                        }}
                    />
            }else{
                return fMoney(text)
            }
        },
        className:'table-money',
        width:'15%',
    }, {
        title:'预缴税率（%）',
        dataIndex:'taxRate',
        className:'text-right',
        render:(text,record,index)=>{
            const {getFieldDecorator,setFieldsValue} = context.props.form,
            {dataSource} = context.state;
            if(disabled && context.state.statusParam && parseInt(context.state.statusParam.status, 0) === 1 && record.preProject !=='销售不动产'){
                return <NumericInputCell
                        fieldName={`list[${record.id}].taxRate`}
                        initialValue={text}
                        getFieldDecorator={getFieldDecorator}
                        componentProps={{
                            valueType:'int',
                            onChange:(value)=>{
                                let values = {};
                                dataSource.forEach(ele=>{
                                    if(record.preProject === ele.preProject){
                                        values[`list[${ele.id}].taxRate`] = value;
                                    }
                                })
                                setFieldsValue(values)
                            }
                        }}
                    />
            }else{
                return text
            }
        },
        // width:80,
    }, {
        title:'预缴税款',
        dataIndex:'prepayAmount',
        render:text=>fMoney(text),
        className:'table-money',
        width:'10%',
    }
];
}


class PrepayTax extends Component{
    state={
        tableKey:Date.now(),
        searchTableLoading:false,
        filters:{},
        /**
         *修改状态和时间
         * */
        statusParam:{},
        totalSource:undefined,
        dataSource:[],
        saveLoding:false,
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
    fetchResultStatus = ()=>{
        requestResultStatus('/account/prepaytax/listMain',this.state.filters,result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    save=(e)=>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                const {dataSource} = this.state;
                let params = dataSource.filter(ele=>ele.preProject!=='销售不动产').map(ele=>{
                    let res = {};
                    res.id = ele.id;
                    res.withOutAmount = values.list[ele.id].withOutAmount.replace(/,/g,'') || 0;
                    res.withTaxAmount = values.list[ele.id].withTaxAmount.replace(/,/g,'') || 0;
                    res.taxRate = values.list[ele.id].taxRate || 0;
                    return res;
                });

                this.setState({saveLoding:true})
                request.post('/account/prepaytax/save',params)
                    .then(({data})=>{
                        this.setState({saveLoding:false})
                        if(data.code===200){
                            message.success('保存成功!');
                            this.props.form.resetFields()
                            this.refreshTable()
                        }else{
                            message.error(`保存失败:${data.msg}`)
                        }
                    })
                    .catch(err => {
                        message.error(err.message)
                        this.setState({saveLoding:false})
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
    render(){
        const {searchTableLoading,tableKey,statusParam,filters,totalSource,saveLoding} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
        return(
            <div className="oneLine">
                    <SearchTable
                    searchOption={{
                        fields:searchFields(disabled,declare),
                        cardProps:{
                            className:'',
                            style:{
                                borderTop:0
                            }
                        },
                    }}
                    doNotFetchDidMount={!disabled}
                    spinning={searchTableLoading}
                    backCondition={(filters) => {
                        this.setState({
                            filters,
                        },() => {
                            this.fetchResultStatus();
                        });
                        this.props.form.resetFields();
                    }}
                    tableOption={{
                        key:tableKey,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        },
                        cardProps: {
                            title: "预缴税款台账",
                        },
                        // pageSize:100,
                        pagination:false,
                        columns:getColumns(this,disabled),
                        url:'/account/prepaytax/prepayTaxList',
                        extra:<div>
                            {
                                listMainResultStatus(statusParam)
                            }{
                                JSON.stringify(filters) !=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'account/prepaytax/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1331007'],
                                }])
                            }
                            {
                                (disabled && declare.decAction==='edit') &&  composeBotton([{
                                    type:'save',
                                    text:'保存',
                                    icon:'save',
                                    userPermissions:['1331003'],
                                    onClick:this.save,
                                    loading:saveLoding
                                },{
                                    type:'reset',
                                    url:'/account/prepaytax/reset',
                                    params:filters,
                                    userPermissions:['1331009'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'submit',
                                    url:'/account/prepaytax/submit',
                                    params:filters,
                                    userPermissions:['1331010'],
                                    onSuccess:this.refreshTable
                                },{
                                    type:'revoke',
                                    url:'/account/prepaytax/revoke',
                                    params:filters,
                                    userPermissions:['1331011'],
                                    onSuccess:this.refreshTable,
                                }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '预缴税款', dataIndex: 'prepayAmount'},
                                            {title: '金额（不含税）', dataIndex: 'withOutAmount'},
                                            {title: '金额（含税）', dataIndex: 'withTaxAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>,
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                        scroll:{
                            x:1000,
                            y:window.screen.availHeight-380-(disabled?50:0),
                        },
                    }}
                />
            </div>
        )
    }
}
export default Form.create()(PrepayTax)
