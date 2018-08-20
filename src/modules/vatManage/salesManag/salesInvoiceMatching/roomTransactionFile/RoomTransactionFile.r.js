/**
 * Created by liurunbin on 2018/1/8.
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-08-16 14:33:49
 *
 */
import React,{Component} from 'react'
import {message,Alert} from 'antd'
import {TableTotal,SearchTable} from 'compoments'
import {request,fMoney,listMainResultStatus,composeBotton,requestResultStatus} from 'utils'
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
            doNotFetchDidMount:true,
            fetchAble:(getFieldValue('main') && getFieldValue('main').key) || false,
            url:`/project/list/${getFieldValue('main') && getFieldValue('main').key}`,
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
            fetchAble:getFieldValue('projectId') || false,
            url:`/project/stages/${getFieldValue('projectId') || ''}`,
        }
    },
    {
        label:'房间编码',
        fieldName:'roomNumber',
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
        type:'monthPicker',
        formItemStyle,
        span:6,
    },
];

const getColumns = (context,disabled) => {
    return [{
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
            dataIndex:'decorationValorem ',
            render:text=>fMoney(text),
            className:'table-money',
            width:'150px',
        },{
            title:'毛胚结算价（不含税）',
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

        selectedRowKeys:null,

        /**
         *修改状态和时间
         * */
        statusParam:'',

        filters:{},
        totalSource:undefined,
    }

    refreshTable = ()=>{
        this.setState({
            tableUpDateKey:Date.now()
        })
    }
    deleteRecord = (id,cb) => {
        request.delete(`/output/room/files/delete/${id}`)
            .then(({data})=>{
                if(data.code===200){
                    message.success('删除成功!');
                    cb && cb()
                }else{
                    message.error(`删除失败:${data.msg}`)
                }
            })
            .catch(err => {
                message.error(err.message)
            })
    }
    fetchResultStatus = ()=>{
        const { declare } = this.props;
        if(!declare){return}
        requestResultStatus('/output/room/files/listMain',{...this.state.filters,authMonth:this.props.declare.authMonth},result=>{
            this.setState({
                statusParam: result,
            })
        })
    }
    render(){
        const {tableUpDateKey,statusParam,totalSource,filters={}} = this.state;
        const { declare } = this.props;
        let disabled = !!declare;
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
                        })
                    }}
                    tableOption={{
                        onTotalSource: (totalSource) => {
                            this.setState({
                                totalSource
                            })
                        },
                        columns:getColumns(this,(disabled && declare.decAction==='edit')),
                        url: '/output/room/files/list',
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
                            {/*
                             composeBotton([{
                             type:'fileExport',
                             url:'output/room/files/download',
                             onSuccess:this.refreshTable
                             }],statusParam)
                             */}
                            {
                                (disabled && declare.decAction==='edit') && composeBotton([
                                    {
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
                                            {title: '成交金额', dataIndex: 'allTotalPrice'},
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
                            x: 3950,
                            y:window.screen.availHeight-400-(disabled?50:0),
                        },
                    }}
                >
                </SearchTable>
            </div>
        )
    }
}

export default RoomTransactionFile