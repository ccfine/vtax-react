/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:36
 * description  :
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,Row,Col,Steps,List, Card} from 'antd'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {composeMenus,request} from '../../../../utils'
import routes from '../../../../modules/routes'
import './styles.less'

const Step = Steps.Step;
const steps = [{
    title: '销项管理',
    decConduct:0,
    //icon:<img alt="销项管理" src={`${ICON_URL_PATH}salesManage.svg`} />,
    //icon:<Icon type="user" />,
}, {
    title: '进项管理',
    decConduct:1,
    //icon:<Icon type="solution" />,
}, {
    title: '其他管理',
    decConduct:2,
    //icon:<Icon type="smile-o" />,
}, {
    title: '税款计算',
    decConduct:3,
    //icon:<Icon type="smile-o" />,
}, {
    title: '纳税申报表',
    decConduct:4,
    //icon:<Icon type="form" />,

}];
const parseJsonToParams = data=>{
    let str = '';
    for(let key in data){
        str += `${key}=${data[key]}&`
    }
    return str;
}
export default class ApplyDeclarationPopModal extends Component{

    static propTypes={
        setButtonStyle:PropTypes.object,
        //title:PropTypes.string,
        params:PropTypes.object,
        onSuccess:PropTypes.func
    }

    static defaultProps={
        setButtonStyle:{
        },
        size:'small',
        title:'申报办理',
    }

    state={
        visible:false,
        loading:false,
        data:[],
        current: 0,
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    toggleVisible = visible =>{
        this.setState({
            visible
        })
    }
    handleCurrent=current=>{
        this.setState({
            current
        },()=>{
            this.fetchDeclarationById(current)
        });
    }
    getContent = (current,routes) => {
        let list = this.state.data;
        let list2 =[];
        let dataSource = [];
        composeMenus(routes).map((item)=>{
            if (!item.name  || item.path === '/web' ) {
                return null;
            }else{
                return list2.push(item)
            }
        })
        list.forEach((t) => {
            list2.forEach((d) => {
                if(t.name === d.name){
                    dataSource.push({
                        name:t.name,
                        path:d.path,
                        status:t.status,
                    });
                }
            })
        })

        return (
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={dataSource}
                renderItem={item => (
                    <List.Item>
                        <Card>
                            <Link style={{color: 'rgba(0, 0, 0, 0.65)'}} to={{
                                pathname:item.path,  //`${item.path}?mainId=${this.props.selectedRows[0].id}`,
                                search:`?${parseJsonToParams({mainId:this.props.selectedRows[0].mainId,
                                    authMonthStart:this.props.selectedRows[0].subordinatePeriodStart,
                                    authMonthEnd:this.props.selectedRows[0].subordinatePeriodEnd})}`, //getQueryString('mainId') || undefined
                                state:{  //在跳转标签的时候值就不存在了
                                    filters:{
                                        mainId:this.props.selectedRows[0].mainId,
                                        authMonthStart:this.props.selectedRows[0].subordinatePeriodStart,
                                        authMonthEnd:this.props.selectedRows[0].subordinatePeriodEnd,
                                    }  //const {state} = this.props.location;  state && state.filters.mainId || undefined,
                                }
                            }}>{item.name} 【{parseInt(item.status,0) === 1 ? <span style={{color:'red'}}>未提交</span> : <span style={{color:'#333'}}>已提交</span> }】</Link>

                        </Card>
                    </List.Item>
                )}
            />
        )
    }
    fetchDeclarationById =(decConduct)=>{
        request.get(`/tax/decConduct/list?decConduct=${decConduct}`)
            .then(({data})=>{
                this.setState({
                    data:data.data,
                })
            })
    }
    componentDidMount(){
        this.fetchDeclarationById(this.state.current)
    }
    componentWillReceiveProps(nextProps) {

    }

    render(){
        const props = this.props;
        const {visible,loading,current} = this.state;
        return(
            <span style={props.style}>
               <Button size={props.size} disabled={props.disabled} onClick={()=>this.toggleVisible(true)}>
                   <Icon type="download" />申报办理
               </Button>
                <Modal
                    maskClosable={false}
                    destroyOnClose={true}
                    title={props.title}
                    visible={visible}
                    confirmLoading={loading}
                    onCancel={()=>this.toggleVisible(false)}
                    width={900}
                    style={{ top: 50 ,maxWidth:'80%'}}
                    footer={
                       <Row>
                           <Col span={12}></Col>
                           <Col span={12}>
                               <Button
                                   type="primary"
                                       //onClick={this.handleSubmit}
                                   disabled
                                   onClick={()=>{
                                       const ref = Modal.warning({
                                           content: '研发中...',
                                           okText: '关闭',
                                           onOk:()=>{
                                               ref.destroy();

                                           }
                                       });
                                   }}>
                                   批量提交
                               </Button>
                               <Button
                                   type="primary"
                                   disabled
                                   //onClick={(e)=>this.handleRevoke}
                                   onClick={()=>{
                                       const ref = Modal.warning({
                                           content: '研发中...',
                                           okText: '关闭',
                                           onOk:()=>{
                                               ref.destroy();
                                           }
                                       });
                                   }}>
                                    批量撤回
                               </Button>
                               <Button onClick={()=>this.toggleVisible(false)}>取消</Button>
                           </Col>
                       </Row>
                   }
                >
                    <div className="steps-main">
                        <Steps current={current} size="small">
                          {
                              steps.map((item,i) => {

                                  return <Step key={item.title} title={item.title} icon={item.icon} onClick={() => this.handleCurrent(i)} />
                              })
                          }
                        </Steps>
                        <div className="steps-content">
                            {
                                this.getContent(this.state.current,routes)
                            }
                        </div>
                      </div>
                </Modal>
            </span>
        )
    }
}