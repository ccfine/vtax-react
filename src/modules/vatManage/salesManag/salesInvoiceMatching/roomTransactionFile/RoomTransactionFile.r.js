/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-16 14:33:49
 *
 */
import React,{Component} from 'react'
import {message,Alert,Modal} from 'antd'
import {TableTotal,SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus,requestTaxSubjectConfig,parseJsonToParams} from 'utils'
import moment from "moment";
const formItemStyle = {
    labelCol:{
        sm:{
            span:10,
        },
        xl:{
            span:8
        }
    },
    wrapperCol:{
        sm:{
            span:14
        },
        xl:{
            span:16
        }
    }
}
const importFeilds = (filters,disabled,declare)=>[
    {
        label:'纳税主体',
        fieldName:'mainId',
        type:'taxMain',
        span:24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        fieldDecoratorOptions:{
            initialValue: (filters && filters["mainId"]) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }, {
        label: '认证月份',
        fieldName: 'authMonth',
        type: 'monthPicker',
        span: 24,
        formItemStyle:{
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:14
            }
        },
        componentProps: {},
        fieldDecoratorOptions: {
            initialValue: (disabled && moment(declare.authMonth, 'YYYY-MM')) || undefined,
            //initialValue: (filters && moment(declare["authMonth"], "YYYY-MM")) || undefined,
            rules: [
                {
                    required: true,
                    message: '请选择认证月份'
                }
            ]
        },
    }
]
const searchFeilds = (disabled,declare) =>(getFieldValue)=>[
    {
        label:'纳税主体',
        fieldName:'main',
        type:'taxMain',
        span:6,
        componentProps:{
            disabled,
            labelInValue:true,
        },
        formItemStyle,
        fieldDecoratorOptions:{
            initialValue: (disabled && {key:declare.mainId,label:declare.mainName}) || undefined,
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    },
    {
        label:'利润中心',
        fieldName:'profitCenterId',
        type:'asyncSelect',
        span:6,
        formItemStyle,
        componentProps:{
            fieldTextName:'profitName',
            fieldValueName:'id',
            doNotFetchDidMount:false,
            fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/taxsubject/profitCenterList/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    },
    {
        label:'交易月份',
        fieldName:'authMonth',
        type:'monthPicker',
        formItemStyle,
        span:6,
    },
    {
        label:'项目名称',
        fieldName:'projectId',
        type:'asyncSelect',
        span:6,
        formItemStyle,
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:false,
            fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/project/list/${(getFieldValue('main') && getFieldValue('main').key ) || (declare && declare.mainId)}`,
        }
    },
    {
        label:'项目分期',
        fieldName:'stagesId',
        type:'asyncSelect',
        span:6,
        formItemStyle,
        componentProps:{
            fieldTextName:'itemName',
            fieldValueName:'id',
            doNotFetchDidMount:true,
            fetchAble:getFieldValue('profitCenterId') || getFieldValue('projectId') || false,
            url:`/project/stage/list?${parseJsonToParams({
                profitCenterId:getFieldValue('profitCenterId') || '',
                projectId:getFieldValue('projectId') || '',
                size:1000,
            })}`,
        }
    },
    {
        label:'房间编码',
        fieldName:'roomCode',
        type:'input',
        formItemStyle,
        span:6
    },
    {
        label:'客户名称',
        fieldName:'customerName',
        type:'input',
        formItemStyle,
        span:6
    },
    {
        label:'匹配状态',
        fieldName:'matchingStatus',
        type:'select',
        formItemStyle,
        span:6,
        options:[
            {
                text:'未匹配',
                value:'0'
            },
            {
                text:'已匹配',
                value:'1'
            }
        ]
    },
    {
        label:'房间交付日期',
        fieldName:'deliveryDate',
        type:'datePicker',
        formItemStyle,
        span:6,
        /*componentProps:{
            format:'YYYY-MM-DD',
        }*/
    },
];

const getColumns = (context,disabled) => {
    return [{
            title: '利润中心',
            dataIndex: 'profitCenterName',
            width:'200px',
        },
        {
            title:'项目名称',
            dataIndex:'projectName',
            width:'150px',
        },
        {
            title:'项目分期名称',
            dataIndex:'stagesName',
            width:'200px',
        },
        {
            title:'路址',
            dataIndex:'htRoomName',
            //width:'300px',
        },
        {
            title:'房间编码',
            dataIndex:'roomCode',
            width:'150px',
        },
        {
            title:'房间交付日期',
            dataIndex:'deliveryDate',
            width:'100px',
        },
        {
            title:'合同约定交付日期',
            dataIndex:'agreeDate',
            width:'150px',
        },
        {
            title:'确收时点',
            dataIndex:'confirmedDate',
            width:'100px',
        },
        {
            title:'成交金额',
            dataIndex:'dealPrice',
            width:'100px',
            className:'table-money',
            render:text=>fMoney(text),
        },
        {
            title:'已开票金额',
            dataIndex:'invoiced',
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
        },
        {
            title:'已收款金额',
            dataIndex:'receivables',
            width:'100px',
            className:'table-money',
            render:text=>fMoney(text),
        },
        {
            title:'税率',
            dataIndex:'taxRate',
            className:'text-right',
            render:text=>text? `${text}%`: text,
            width:'100px',
        },
        {
            title:'修改后税率',
            dataIndex:'newTaxRate',
            className:'text-right',
            render:text=>text? `${text}%`: text,
            width:'100px',
        },
        {
            title: "税额",
            dataIndex: "taxAmount",
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
        },
        {
            title:'价税合计',
            dataIndex:'sdValorem',
            render:text=>fMoney(text),
            className:'table-money',
            width:'100px',
        },
        {
            title:'楼栋名称',
            dataIndex:'buildingName',
            width:'300px',
        },
        {
            title:'单元',
            dataIndex:'element',
            width:'100px',
        },
        {
            title:'房号',
            dataIndex:'roomNumber',
            width:'100px',
        },
        {
            title:'房间面积',
            dataIndex:'roomArea',
            width:'100px',
        },
        {
            title:'交易日期',
            dataIndex:'transactionDate',
            width:'100px',
        },
        {
            title:'客户名称',
            dataIndex:'customerName',
            width:'100px',
        },
        {
            title:'身份证号/纳税识别号',
            dataIndex:'taxIdentificationCode',
            width:'200px',
        },
        {
            title:' 款项名称',
            dataIndex:'priceType',
            width:'100px',
        },
        {
            title:'匹配状态',
            dataIndex:'matchingStatus',
            width:'100px',
            render:text=>{ //0:未匹配,1:已匹配
                let txt = '';
                switch (parseInt(text,0)) {
                    case 0:
                        txt = "未匹配";
                        break;
                    case 1:
                        txt = "已匹配";
                        break;
                    default:
                        txt = text;
                        break;
                }
                return txt
            },
        },{
            title:'装修款（不含税）',
            dataIndex:'decorationValorem',
            render:text=>fMoney(text),
            className:'table-money',
            width:'150px',
        },{
            title:'毛坯结算价（不含税）',
            dataIndex:'embryoSdValorem',
            render:text=>fMoney(text),
            className:'table-money',
            width:'150px',
        },{
            title:'结算价合计（不含税）',
            dataIndex:'oldSdValorem',
            render:text=>fMoney(text),
            className:'table-money',
            width:'150px',
        }, {
            title:'修改后结算价（不含税）',
            dataIndex:'newSdValorem',
            render:text=>fMoney(text),
            className:'table-money',
            width:'150px',

        },{
            title:'发票信息',
            children:[{
                title:'发票号码集',
                dataIndex:'invoiceNum',
                width:'150px',
            },{
                title:'发票代码集',
                dataIndex:'invoiceCode',
                width:'150px',
            }
            ]
        },
    ]}
class RoomTransactionFile extends Component{
    state={
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey:Date.now(),

        selectedRowKeys:[],

        /**
         *修改状态和时间
         * */
        statusParam:'',

        filters:{

        },
        deleteLoading:false,
        totalSource:undefined,
        isShowImport:null,
    }

    refreshTable = ()=>{
        this.mounted && this.setState({
            tableUpDateKey:Date.now(),
            selectedRowKeys:[]
        })
    }
    toggleDeleteLoading=(val)=>{
        this.mounted && this.setState({deleteLoading:val})
    }
    deleteData = () =>{
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '是否要删除选中的记录？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                this.toggleDeleteLoading(true)
                request.post(`/output/room/files/delete/deleteByIds`,this.state.selectedRowKeys)
                    .then(({data})=>{
                        this.toggleDeleteLoading(false)
                        if(data.code===200){
                            message.success('删除成功！');
                            this.refreshTable();
                        }else{
                            message.error(`删除失败:${data.msg}`)
                        }
                    }).catch(err=>{
                    message.error(err.message)
                    this.toggleDeleteLoading(false)
                })
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    }
    fetchResultStatus = ()=>{
        const { declare } = this.props;
        if(!declare){return}
        requestResultStatus('/output/room/files/listMain',{...this.state.filters,authMonth:this.props.declare.authMonth},result=>{
            this.mounted && this.setState({
                statusParam: result,
            })
        })
    }
    fetchTaxSubjectConfig = () =>{
        //根据纳税主体那边的参数设置来判断是否展示导入；并且删除的时候需要加上如果是从接口来的数据不能删除
        requestTaxSubjectConfig(this.state.filters && this.state.filters.mainId, result=>{
            this.mounted && this.setState({
                isShowImport: typeof result === 'undefined' ? 0 : result.unusedMarketingSystem
            })
        })
    }
    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }
    render(){
        const {tableUpDateKey,statusParam,totalSource,filters={},deleteLoading,selectedRowKeys,isShowImport} = this.state;
        const { declare } = this.props;
        let disabled = !!declare,
            isCheck = (disabled && declare.decAction==='edit' && statusParam && parseInt(statusParam.status,10)===1);
        return(
            <div className='oneLine'>
                <SearchTable
                    style={{
                        marginTop:-16
                    }}
                    searchOption={{
                        fields:searchFeilds(disabled,declare),
                        cardProps:{
                            style:{
                                borderTop:0
                            },
                            className:''
                        }
                    }}
                    doNotFetchDidMount={!disabled}
                    backCondition={(filters)=>{
                        this.setState({
                            filters,
                        },()=>{
                            this.fetchResultStatus()
                            this.fetchTaxSubjectConfig()
                        })
                    }}
                    tableOption={{
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                        columns:getColumns(this,(disabled && declare.decAction==='edit')),
                        url: `/output/room/files/list?month=${this.props.declare.authMonth}`,
                        key:tableUpDateKey,
                        extra: <div>
                            {
                                listMainResultStatus(statusParam)
                            }
                            {
                                JSON.stringify(filters)!=='{}' && composeBotton([{
                                    type:'fileExport',
                                    url:'output/room/files/export',
                                    params:filters,
                                    title:'导出',
                                    userPermissions:['1211007'],
                                }])
                            }
                            {
                             composeBotton([{
                                 type:'fileExport',
                                 url:'output/room/files/download',
                                 onSuccess:this.refreshTable
                                 }],statusParam)
                             }
                            {
                                (disabled && declare.decAction==='edit') && parseInt(isShowImport, 0) === 1 &&  composeBotton([{
                                    type:'fileImport',
                                    url:'/output/room/files/upload',
                                    onSuccess:this.refreshTable,
                                    userPermissions:['1211005'],
                                    fields:importFeilds(filters,disabled,declare)
                                }],statusParam)
                            }
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([
                                    {

                                        type:'delete',
                                        icon:'delete',
                                        text:'删除',
                                        btnType:'danger',
                                        loading:deleteLoading,
                                        selectedRowKeys:selectedRowKeys,
                                        userPermissions:['1215013'],
                                        onClick:this.deleteData
                                    },{
                                        type:'submit',
                                        url:'/output/room/files/submit',
                                        params:{...filters,authMonth:declare.authMonth},
                                        userPermissions:['1215010'],
                                        children: totalSource && totalSource.flag===true && (
                                            <Alert
                                                type="warning"
                                                showIcon
                                                message={
                                                    <div>
                                                        <p>房间交付日期在2018年5月1号之后的存在有11%税率，需要统一调整为10%税率，请确认。</p>
                                                        <p>确认后系统会自动调整，同时会反算结算价：结算价=[(结算价*(1+11%)]/(1+10%)</p>
                                                    </div>
                                                }
                                            />
                                        ),
                                        onSuccess:this.refreshTable
                                    },
                                    {
                                        type:'revoke',
                                        url:'/output/room/files/revoke',
                                        params:{...filters,authMonth:declare.authMonth},
                                        userPermissions:['1215011'],
                                        onSuccess:this.refreshTable,
                                    }],statusParam)
                            }
                            <TableTotal type={3} totalSource={totalSource} data={
                                [
                                    {
                                        title:'合计',
                                        total:[
                                            {title: '结算价合计（不含税）', dataIndex: 'allOldSdValorem'},
                                            {title: '已开票金额', dataIndex: 'allInvoicedAmount'},
                                        ],
                                    }
                                ]
                            } />
                        </div>,
                        cardProps: {
                            title: <span><label className="tab-breadcrumb">销项发票匹配 / </label>房间交易档案</span>
                        },
                        scroll:{
                            x: 4150,
                            y:window.screen.availHeight-400-(disabled?50:0),
                        },
                        rowSelection:{
                            getCheckboxProps: record => ({
                                disabled: parseInt(record.delete , 0) === 0 , // Column configuration not to be checked
                            }),
                        },
                        onRowSelect:isCheck?(selectedRowKeys)=>{
                            console.log(selectedRowKeys)
                            this.mounted && this.setState({
                                selectedRowKeys
                            })
                        }:undefined,
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}

export default RoomTransactionFile