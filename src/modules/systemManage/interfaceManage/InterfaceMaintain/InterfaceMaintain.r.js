import React from 'react'
import {Card,Form,Row} from 'antd'
import {getFields} from 'utils'

/*const interfaces = [{
    text:'NC财务系统-固定资产卡片信息接口',
    drainInterface:'/fixedAssetCard/des',
    distributeInterface:'/fixedAssetCard/dds',
},{
    text:'NC财务系统-固定资产卡片信息接口',
    drainInterface:'/fixedAssetCard/des',
    distributeInterface:'/fixedAssetCard/dds',
}]*/

class InterfaceMaintain extends React.Component{
    render(){
        return  <Card title="接口维护"  style={{ width: '100%' }}>
            <div>
                <Form>
                    <Row>
                        {
                            getFields(this.props.form,[{
                                label:'接口',
                                fieldName:'interface',
                                type:'select',
                                span:12,
                                options:[{text:'1',value:'1'}],
                                fieldDecoratorOptions:{
                                    initialValue:0,
                                    rules: [
                                        {
                                            required: true, message: '请选择接口',
                                        }
                                    ],
                                }
                            }])
                        }
                    </Row>
                </Form>
            </div>
            <div contentEditable='true' style={{color:'#FFF',backgroundColor:'#000',width:'100%',minHeight:100,padding:15}}>
            
            </div>
      </Card>
    }
} 

export default Form.create()(InterfaceMaintain);