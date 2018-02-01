/**
 * Created by liurunbin on 2018/2/1.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Row, Col, Button} from 'antd'
import {getFields} from '../../../../utils'
import moment from 'moment'
import Sheet from './Sheet.r'
class SheetWithSearchFields extends Component{
    static propTypes={
        grid:PropTypes.array,
        url:PropTypes.string,
        composeGrid:PropTypes.func
    }
    static defaultProps = {
        grid:[],
        searchFields:[
            {
                label:'纳税主体',
                fieldName:'mainId',
                type:'taxMain',
                fieldDecoratorOptions:{
                    rules:[
                        {
                            required:true,
                            message:'请选择纳税主体'
                        }
                    ]
                },
            },
            {
                label:'月份',
                fieldName:'taxMonth',
                type:'monthPicker',
                fieldDecoratorOptions:{
                    rules:[
                        {
                            required:true,
                            message:'请选择月份'
                        }
                    ]
                }
            },
        ]
    }
    state={
        params:{},
        updateKey:Date.now()
    }
    componentDidMount(){
    }
    toggleLoading = loading =>{
        this.setState({
            loading
        })
    }
    onSubmit = e =>{
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if(!err){
                for(let key in values){
                    if(Array.isArray( values[key] ) && values[key].length === 2 && moment.isMoment(values[key][0])){
                        //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                        values[`${key}Start`] = values[key][0].format('YYYY-MM-DD');
                        values[`${key}End`] = values[key][1].format('YYYY-MM-DD');
                        values[key] = undefined;
                    }
                    if(moment.isMoment(values[key])){
                        //格式化一下时间 YYYY-MM类型
                        if(moment(values[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                            values[key] = values[key].format('YYYY-MM');
                        }
                    }
                }
                this.setState({
                    params:values,
                    updateKey:Date.now()
                })
            }
        })
    }
    mounted=true;
    componentWillUnmount(){
        this.mounted=null;
    }
    render(){
        const { grid, url , searchFields, form, composeGrid} = this.props;
        const { params,updateKey } = this.state;
        return(
            <div>
                <div style={{
                    backgroundColor:'#fff',
                    padding:'10px 10px 0 0',
                    marginBottom:10
                }}>
                    <Form onSubmit={this.onSubmit}>
                        <Row>
                            {
                                getFields(form, searchFields)
                            }
                            <Col style={{width:'100%',textAlign:'right'}}>
                                <Button size='small' style={{marginTop:5,marginLeft:20}} type="primary" htmlType="submit">查询</Button>
                                <Button size='small' style={{marginTop:5,marginLeft:10}} onClick={()=>{
                                    form.resetFields();
                                    this.setState({
                                        params:{}
                                    })
                                }}>重置</Button>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <Sheet grid={grid} url={url} params={params} composeGrid={composeGrid} updateKey={updateKey}/>
            </div>
        )
    }
}
export default Form.create()(SheetWithSearchFields)