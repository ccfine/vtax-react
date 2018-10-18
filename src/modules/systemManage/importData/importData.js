import React from 'react'
import { List, Card, Form } from 'antd'
import {composeBotton} from 'utils'
import DeleteModal from './deleteModal'
const mainId = [
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
            rules:[
                {
                    required:true,
                    message:'请选择纳税主体'
                }
            ]
        },
    }
]
const authMonth = [
    {
        label: '月份',
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
            rules: [
                {
                    required: true,
                    message: '请选择月份'
                }
            ]
        },
    }
]
 class ImportData extends React.Component{

     state={
         updateKey:Date.now(),
     }
     refreshTable = ()=>{
         this.setState({
             updateKey:Date.now(),
         })
     }
    render(){
        const fields = mainId.concat(authMonth)
        const data = [
            {
                title: '房间交易档案',
                importUrl:'/output/room/files/upload',
                deleteUrl:'/output/room/files/delete',
                fields:fields,
            },
            {
                title: '固定资产卡片',
                importUrl:'/fixedAssetCard/report/upload',
                deleteUrl:'/fixedAssetCard/report/delete',
                fields:fields,
            },
            {
                title: '财务凭证',
                importUrl:'/inter/financial/voucher/report/upload',
                deleteUrl:'/inter/financial/voucher/report/delete',
                fields:fields,
            },
            {
                title: '可售面积',
                importUrl:'/interAvailableBuildingAreaInformation/upload',
                fields:mainId,
            },
            {
                title: '项目管理',
                importUrl:'/project/upload/',
                fields:mainId,
            },
            {
                title: '利润中心',
                importUrl:'/profitCenter/upload',
                fields:mainId,
            },
            {
                title: '自持类产品清单',
                importUrl:'/interProductList/upload',
                fields:mainId,
            },
            {
                title: '自持类产品关联进项发票',
                importUrl:'/ReceiptsInvoiceReport/upload',
                fields:mainId,
            },
        ];

        return(
            <React.Fragment key={this.state.updateKey}>

                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card title={item.title}>
                                {
                                    composeBotton([{
                                        type:'fileImport',
                                        url:item.importUrl,
                                        onSuccess:this.refreshTable,
                                        fields:item.fields,
                                        // userPermissions:['1891005'],
                                    }])
                                }
                                {
                                    item.deleteUrl && <DeleteModal
                                        fields={item.fields}
                                        url={item.deleteUrl}
                                        onSuccess={this.refreshTable}
                                    />
                                }
                            </Card>
                        </List.Item>
                    )}
                />

            </React.Fragment>

        )
    }
}
export default  Form.create()(ImportData);

