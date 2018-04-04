/**
 * author       : liuliyuan
 * createTime   : 2017/12/14 12:10
 * description  :
 */
import React, { Component } from 'react'
import {Button,Icon,message} from 'antd'
import {SearchTable} from '../../../../compoments'
import PageTwo from './TabPage2.r'
import {fMoney,request,getUrlParam,listMainResultStatus} from '../../../../utils'
import { withRouter } from 'react-router'
import moment from 'moment';

const searchFields =(disabled)=> (getFieldValue)=> {
    return [
        {
            label:'纳税主体',
            fieldName:'mainId',
            type:'taxMain',
            span:6,
            componentProps:{
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && getUrlParam('mainId')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选择纳税主体'
                    }
                ]
            }
        },{
            label:'查询期间',
            fieldName:'authMonth',
            type:'monthPicker',
            span:6,
            componentProps:{
                format:'YYYY-MM',
                disabled
            },
            fieldDecoratorOptions:{
                initialValue: (disabled && moment(getUrlParam('authMonth'), 'YYYY-MM')) || undefined,
                rules:[
                    {
                        required:true,
                        message:'请选查询期间'
                    }
                ]
            },
        }, {
            label:'项目名称',
            fieldName:'projectId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('mainId') || false,
                url:`/project/list/${getFieldValue('mainId')}`,
            }
        }, {
            label:'项目分期',
            fieldName:'stagesId',
            type:'asyncSelect',
            span:6,
            componentProps:{
                fieldTextName:'itemName',
                fieldValueName:'id',
                doNotFetchDidMount:true,
                fetchAble:getFieldValue('projectId') || false,
                url:`/project/stages/${getFieldValue('projectId') || ''}`,
            }
        }
    ]
}
const columns= [
    {
        title: '纳税主体',
        dataIndex: 'mainName',
    }, {
        title: '项目名称',
        dataIndex: 'projectName',
    },{
        title: '土地出让合同',
        dataIndex: 'contractNum',
    },{
        title: '项目分期',
        dataIndex: 'stagesName',
    },{
        title: '是否清算 ',
        dataIndex: 'isLiquidation',
        render:text=>{
            text = parseInt(text,0);
            if(text===1){
                return '已清算'
            }
            if(text===2){
                return '未清算'
            }
            return text;
        }
    },{
        title: '可售面积(㎡)',
        dataIndex: 'upAreaSale',
    },{
        title: '计税方法',
        dataIndex: 'taxMethod',
        render:text=>{
            //1一般计税方法，2简易计税方法 ,
            text = parseInt(text,0);
            if(text===1){
                return '一般计税方法'
            }
            if(text ===2){
                return '简易计税方法'
            }
            return text;
        }
    },{
        title: '分摊抵扣的土地价款',
        dataIndex: 'deductibleLandPrice',
        render:text=>fMoney(text),
    },{
        title: '单方土地成本',
        dataIndex: 'singleLandCost',
    },{
        title: '上期累计销售的建筑面积(㎡)',
        dataIndex: 'saleArea',
    },{
        title: '上期累计已扣除土地价款',
        dataIndex: 'actualDeductibleLandPrice',
        render:text=>fMoney(text),
    },{
        title: '当期销售建筑面积（㎡）',
        dataIndex: 'salesBuildingArea',
    },{
        title: '当期应扣除土地价款',
        dataIndex: 'deductPrice',
        render:text=>fMoney(text),
    },{
        title: '收入确认金额',
        dataIndex: 'price',
        render:text=>fMoney(text),
    },{
        title: '税率',
        dataIndex: 'taxRate',
        render:text=>fMoney(text),
    },{
        title: '税额',
        dataIndex: 'taxAmount',
        render:text=>fMoney(text),
    },{
        title: '价税合计',
        dataIndex: 'totalAmount',
        render:text=>fMoney(text),
    }
];
class LandPriceDeductionDetails extends Component{
    state={
        updateKey:Date.now(),
        pageTwoKey:Date.now(),
        filters:{},
        selectedRows:[],
        searchTableLoading:false,
        /**
         *修改状态和时间
         * */
        statusParam:{},
        dataSource:[],
    }
    refreshTable = ()=>{
        this.setState({
            updateKey:Date.now(),
        },()=>{
            this.updateStatus()
        })
    }
    toggleSearchTableLoading = b =>{
        this.setState({
            searchTableLoading:b
        })
    }

    handleClickActions=type=>{
        let url = '';
        switch (type){
            case '提交':
                url='/account/landPrice/deductedDetails/submit';
                this.requestPost(url,type,this.state.filters);
                break;
            case '撤回':
                url='/account/landPrice/deductedDetails/revoke';
                this.requestPost(url,type,this.state.filters);
                break;
            case '重算':
                url='/account/landPrice/deductedDetails/reset';
                this.requestPut(url,type,this.state.filters);
                break;
            default:
                this.setState({
                    updateKey:Date.now(),
                    pageTwoKey:Date.now(),
                },()=>{
                    this.updateStatus()
                })
        }
    }

    requestPut=(url,type,values={})=>{
        this.toggleSearchTableLoading(true)
        request.put(url,values)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable()
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    requestPost=(url,type,values={})=>{
        this.toggleSearchTableLoading(true)
        request.post(url,values)
            .then(({data})=>{
                this.toggleSearchTableLoading(false)
                if(data.code===200){
                    message.success(`${type}成功!`);
                    this.refreshTable()
                }else{
                    message.error(`${type}失败:${data.msg}`)
                }
            })
    }
    updateStatus=()=>{
        request.get('/account/landPrice/deductedDetails/listMain',{params:this.state.filters}).then(({data}) => {
            if (data.code === 200) {
                this.setState({
                    statusParam: data.data,
                })
            }
        })
    }
    componentDidMount(){
        const {search} = this.props.location;
        if(!!search){
            this.setState({
                filters:{
                    mainId:getUrlParam('mainId') || undefined,
                    authMonth:moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM') || undefined,
                }
            },()=>{
                this.refreshTable()
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.updateKey !== this.props.updateKey){
            this.setState({
                filters:nextProps.filters,
                updateKey:nextProps.updateKey
            });
        }
    }

    render(){
        const {updateKey,pageTwoKey,searchTableLoading,selectedRows,filters,dataSource,statusParam} = this.state;
        const {mainId,authMonth} = this.state.filters;
        const disabled1 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 1));
        const disabled2 = !((mainId && authMonth) && (statusParam && parseInt(statusParam.status, 0) === 2));
        const {search} = this.props.location;
        let disabled = !!search;
        return(
                <SearchTable
                    spinning={searchTableLoading}
                    doNotFetchDidMount={true}
                    searchOption={{
                        fields:searchFields(disabled),
                        cardProps:{
                            style:{
                                borderTop:0
                            }
                        },
                        onFieldsChange:values=>{
                            if(JSON.stringify(values) === "{}"){
                                this.setState({
                                    filters:{
                                        mainId:(disabled && getUrlParam('mainId')) || undefined,
                                        authMonth:(disabled && moment(getUrlParam('authMonth'), 'YYYY-MM').format('YYYY-MM')) || undefined,
                                    }
                                })
                            }else if(values.mainId || values.authMonth){
                                if(values.authMonth){
                                    values.authMonth = values.authMonth.format('YYYY-MM')
                                }
                                this.setState(prevState=>({
                                    filters:{
                                        ...prevState.filters,
                                        ...values
                                    }
                                }))
                            }
                        }
                    }}
                    backCondition={this.updateStatus}
                    tableOption={{
                        key:updateKey,
                        pageSize:10,
                        columns:columns,
                        cardProps:{
                            title:'项目分期信息'
                        },
                        rowSelection:parseInt(statusParam.status, 0)  === 1 ?  {
                            type:'radio',
                        } : undefined,
                        onRowSelect:parseInt(statusParam.status, 0)  === 1 ? (selectedRowKeys,selectedRows)=>{
                            this.setState({
                                selectedRows,
                                pageTwoKey:Date.now(),
                            })
                        } : undefined,
                        onSuccess:()=>{
                            this.setState({
                                selectedRows:[],
                                pageTwoKey:Date.now(),
                            })
                        },
                        url:'/account/landPrice/deductedDetails/list',
                        extra: <div>
                            {
                                dataSource.length>0 && listMainResultStatus(statusParam)
                            }
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled1}
                                onClick={()=>this.handleClickActions('重算')}>
                                <Icon type="retweet" />
                                重算
                            </Button>
                            {/*<Button size='small' style={{marginRight:5}}>
                                                    <Icon type="check" />
                                                    清算
                                                </Button>*/}
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled1}
                                onClick={()=>this.handleClickActions('提交')}>
                                <Icon type="check" />
                                提交
                            </Button>
                            <Button
                                size='small'
                                style={{marginRight:5}}
                                disabled={disabled2}
                                onClick={()=>this.handleClickActions('撤回')}>
                                <Icon type="rollback" />
                                撤回提交
                            </Button>
                        </div>,
                        onDataChange:(dataSource)=>{
                            this.setState({
                                dataSource
                            })
                        },
                    }}
                >

                    <PageTwo key={pageTwoKey} selectedRows={selectedRows} filters={filters} />
                </SearchTable>

        )
    }
}
export default withRouter(LandPriceDeductionDetails)