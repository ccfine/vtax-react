import React from 'react'
import { Card, Col, Row, Form} from 'antd'
import {getFields,composeBotton} from 'utils'
const fields = [
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
    }, {
        label: '记账月份',
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
                    message: '请选择记账月份'
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
        return(
            <React.Fragment key={this.state.updateKey}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="房间交易档案" bordered={false}>
                            {
                                composeBotton([{
                                    type:'fileImport',
                                    url:'/output/room/files/upload',
                                    onSuccess:this.refreshTable,
                                    fields:fields,
                                    // userPermissions:['1891005'],
                                }])
                            }
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="固定资产卡片" bordered={false}>
                            {
                                composeBotton([{
                                    type:'fileImport',
                                    url:'/fixedAssetCard/report/upload',
                                    onSuccess:this.refreshTable,
                                    fields:fields,
                                    // userPermissions:['1891005'],
                                }])
                            }
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop:10 }}>
                    <Col span={12}>
                        <Card title="财务凭证" bordered={false}>
                            {
                                composeBotton([{
                                    type:'fileImport',
                                    url:'/inter/financial/voucher/report/upload',
                                    onSuccess:this.refreshTable,
                                    fields:fields,
                                    // userPermissions:['1891005'],
                                }])
                            }
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="可售面积" bordered={false}>
                            {
                                composeBotton([{
                                    type:'fileImport',
                                    url:'/interAvailableBuildingAreaInformation/upload',
                                    onSuccess:this.refreshTable,
                                    fields:fields,
                                    // userPermissions:['1891005'],
                                }])
                            }
                        </Card>
                    </Col>
                </Row>
            </React.Fragment>

        )
    }
}
export default  Form.create()(ImportData);

