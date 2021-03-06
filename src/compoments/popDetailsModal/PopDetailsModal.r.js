/**
 * Created by liuliyuan on 2018/11/6.
 */
import React,{Component} from 'react'
import {Row,Col,Button,Modal } from 'antd'
import {SearchTable} from 'compoments'

export default class PopDetailsModal extends Component{
    static defaultProps = {
        tableOption:{
            title:"凭证信息列表"
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            tableKey:Date.now(),
            totalSource:{},

        };
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
            },200)
        }
    }
    render(){
        const {searchTableLoading,tableKey,totalSource} = this.state;
        const { title,visible,fields,toggleModalVoucherVisible,tableOption, totalData=[] } = this.props;
        return(
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={()=>toggleModalVoucherVisible(false)}
                width={900}
                style={{ top: 50 ,maxWidth:'80%'}}
                visible={visible}
                footer={
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Button onClick={()=>toggleModalVoucherVisible(false)}>取消</Button>
                        </Col>
                    </Row>
                }
                title={title}>
                <div className='oneLine'>
                    <SearchTable
                        searchOption={{
                            fields:fields
                        }}
                        doNotFetchDidMount={true}
                        spinning={searchTableLoading}
                        tableOption={{
                            key:tableKey,
                            cardProps: {
                                title: tableOption.title,
                                extra:tableOption.extra || null
                            },
                            pageSize:100,
                            columns:tableOption.columns,
                            url:tableOption.url,
                            scroll:tableOption.scroll || { x: '140%',y:'250px'},
                            onTotalSource: totalSource => {
                                this.setState({
                                    totalSource
                                });
                            },
                            ...tableOption
                        }}

                    />
                </div>
                {/* totalData 格式 [[{label: text, key: valueKey}, ...], ...] */}
                {
                    totalData.length? (
                        <div style={{marginTop: "15px"}}>
                            {totalData.map((row, k)=>(<Row key={k}>
                                {
                                    row.map((item, key)=>(
                                        <Col key={key} span={24 / row.length}>
                                            {item.label} {totalSource[item.key]}
                                        </Col>
                                    ))
                                }
                            </Row>))}
                        </div>
                    ): null
                }
            </Modal>
        )
    }
}
