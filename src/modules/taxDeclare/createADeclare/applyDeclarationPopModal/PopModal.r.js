/**
 * author       : liuliyuan
 * createTime   : 2018/1/28 14:36
 * description  :
 */
import React,{Component} from 'react'
import {Button,Icon,Modal,Row,Col,Steps,List, Card} from 'antd'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {composeMenus} from '../../../../utils'
import routes from '../../../../modules/routes'
import './styles.less'

const Step = Steps.Step;
const steps = [{
    title: '销项管理',
    icon:<Icon type="user" />,
}, {
    title: '进项管理',
    icon:<Icon type="user" />,
}, {
    title: '其他管理',
    icon:<Icon type="user" />,
}, {
    title: '税款计算',
    icon:<Icon type="user" />,
}, {
    title: '纳税申报表',
    icon:<Icon type="user" />,

}];

//销项管理
const data = [
    {
        key:'1',
        //title: '销项管理',
        children:[
            {
                name:'销项发票采集',
            },{
                name:'销项发票匹配',
            },{
                name:'营改增前售房',
            },{
                name:'开票销售台账',
            },{
                name:'未开票销售台账',
            }, {
                name: '其他涉税调整台账',
            },{
                name:'其他业务未开票销售台账',
            }
        ]
    }, {
        key:'2',
        //title: '进项管理',
        children:[
            {
                name:'进项发票采集',
            },{
                name:'进项发票匹配',
            },{
                name:'进项税额明细台账',
            },{
                name:'进项税额结构台账',
            },{
                name:'固定资产进项税额台账',
            },{
                name:'跨期合同进项税额转出台账',
            },{
                name:'其他业务进项税额转出台账',
            }
        ]
    }, {
        key:'3',
        //title: '其他管理',
        children:[
            {
                name:'售房预缴台账',
            },{
                name:'预缴税款台账',
            },{
                name:'土地价款扣除明细台账',
            },{
                name:'扣除项目汇总台账',
            },{
                name:'减免税明细台账',
            },{
                name:'营改增税负分析测算台账',
            }
        ]
    }, {
        key:'4',
        //title: '税款计算',
        children:[
            {
                name: '税款计算台账',
            }
        ]
    }, {
        key:'5',
        //title: '纳税申报表',
        children:[
            {
                name: '纳税申报表',
            },{
                name: '增值税预缴表',
            }
        ]
    },
];

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

        current: 0,
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    toggleVisible = visible =>{
        /*if(visible){
            this.props.form.resetFields()
        }*/
        this.setState({
            visible
        })
    }
    handleCurrent=current=>{
        this.setState({ current });
    }
    handleSubmit=()=>{

    }
    handleRevoke=()=>{

    }

    getContent = (current,routes) => {
        let list = data[current].children;
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
                        name:d.name,
                        path:d.path,
                    });
                }
            })
        })

        return (
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={dataSource}
                renderItem={item => (
                    <List.Item>
                        <Card>
                            <Link to={{
                                pathname:item.path,  //`${item.path}?mainId=${this.props.selectedRows[0].id}`,
                                //search:`?mainId=${this.props.selectedRows[0].id}`, //getQueryString('mainId') || undefined
                                state:{
                                    filters:{...this.props.selectedRows[0]}  //const {state} = this.props.location;  state && state.filters.mainId || undefined,
                                }
                            }}>{item.name}</Link>
                        </Card>
                    </List.Item>
                )}
            />
        )
    }
    render(){
        const props = this.props;
        const {visible,loading,current} = this.state;
        return(
            <span style={props.style}>
               <Button size={props.size} disabled={props.disabled} onClick={()=>this.toggleVisible(true)}>
                   <Icon type="download" />申报办理
               </Button>
                <Modal title={props.title}
                       visible={visible}
                       confirmLoading={loading}
                       onCancel={()=>this.toggleVisible(false)}
                       width={900}
                       footer={
                           <Row>
                               <Col span={12}></Col>
                               <Col span={12}>
                                   <Button type="primary" onClick={this.handleSubmit}>批量提交</Button>
                                   <Button type="primary" onClick={(e)=>this.handleRevoke}>批量撤回</Button>
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