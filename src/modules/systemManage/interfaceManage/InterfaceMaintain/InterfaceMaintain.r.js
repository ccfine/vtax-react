import React from 'react'
import {Card,Form,Row,Col,Button} from 'antd'
import {getFields} from 'utils'
import {connect} from 'react-redux'

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
    state={
        texts:[]
    }
    socket = null;
    connect=()=>{
        this.socket = new WebSocket('ws://10.187.56.245:81/webSocketHandler/id='+888);
        this.socket.onopen = ()=>{
            console.log('ok')
        };
        this.socket.onmessage = ({data})=>{
            this.setState({texts:[...this.state.texts,data]})
        };
    }
    render(){
        const {texts} = this.state;
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
                    <Row>
                        <Col>
                        <Button type="primary" onClick={this.connect}>连接</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div style={{color:'#FFF',backgroundColor:'#000',width:'100%',padding:15,height:300,overflowY:'auto'}}>
                {
                    texts.map((ele,index)=>{
                        return <p key={index}>{ele}</p>
                    })
                }
            </div>
      </Card>
    }
} 

export default connect(state=>({
    userId:state.user.get('userId')
}))(Form.create()(InterfaceMaintain));